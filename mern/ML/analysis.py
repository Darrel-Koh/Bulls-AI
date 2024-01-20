import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from datetime import datetime
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import LSTM, Dense
from tensorflow.keras.layers import RNN, LSTMCell
from bson.binary import Binary
import pymongo

def connect_to_db():
    with open('../server/config.env', 'r') as file:
        connection_string = file.read().strip()

    connection_string = connection_string.replace('ATLAS_URI=', '')

    client = pymongo.MongoClient(connection_string)
    db = client['bullsai']
    return db

def download_data(symbol, start_date, end_date):
    db = connect_to_db()
    collection = db['ticker_data']
    data = collection.find_one({"symbol": symbol})

    if data is not None and 'transactions' in data:
        dataDF = pd.DataFrame(data['transactions'])
        dataDF = dataDF.set_index('Date')
        dataDF.index = pd.to_datetime(dataDF.index)
        mask = (dataDF.index >= start_date) & (dataDF.index <= end_date)
        dataDF = dataDF.loc[mask]
        return dataDF

    return None

def create_dataset(data):
    data = data.filter(['Adj Close'])
    dataset = data.values
    training_data_len = int(np.ceil(len(dataset) * .95))
    return dataset, training_data_len

def scale_data(dataset):
    scaler = MinMaxScaler(feature_range=(0, 1))
    return scaler.fit_transform(dataset), scaler

def create_training_data(scaled_data, training_data_len):
    train_data = scaled_data[0:int(training_data_len), :]
    x_train = []
    y_train = []
    for i in range(60, len(train_data)):
        x_train.append(train_data[i-60:i, 0])
        y_train.append(train_data[i, 0])
    return np.array(x_train), np.array(y_train)

def reshape_data(x_train):
    return np.reshape(x_train, (x_train.shape[0], x_train.shape[1], 1))

def build_and_train_model(x_train, y_train):
    model = Sequential()
    model.add(LSTM(128, return_sequences=True, input_shape=(x_train.shape[1], 1)))
    model.add(LSTM(64, return_sequences=False))
    model.add(Dense(25))
    model.add(Dense(1))
    model.compile(optimizer='adam', loss='mean_squared_error')
    model.fit(x_train, y_train, batch_size=1, epochs=2)
    return model

def create_test_data(scaled_data, dataset, training_data_len):
    test_data = scaled_data[training_data_len - 60:, :]
    x_test = []
    y_test = dataset[training_data_len:, :]
    for i in range(60, len(test_data)):
        x_test.append(test_data[i-60:i, 0])
    return np.array(x_test), y_test

def make_predictions(model, x_test, scaler):
    x_test = np.reshape(x_test, (x_test.shape[0], x_test.shape[1], 1))
    predictions = model.predict(x_test)
    return scaler.inverse_transform(predictions)

def calculate_rmse(predictions, y_test):
    return np.sqrt(np.mean(((predictions - y_test) ** 2)))

def plot_data(data, training_data_len, predictions, symbol):
    train = data[:training_data_len]
    valid = data[training_data_len:].copy()
    valid.loc[:, 'Predictions'] = predictions
    plt.figure(figsize=(16, 6))
    plt.title(symbol + ' Model')
    plt.xlabel('Date', fontsize=18)
    plt.ylabel('Adj Close Price SGD ($)', fontsize=18)
    plt.plot(train['Adj Close'])
    plt.plot(valid[['Adj Close', 'Predictions']])
    plt.legend(['Train', 'Val', 'Predictions'], loc='lower right')
    plt.show()

def save_model(model, model_path):
    model.save(model_path)

def load_model_if_exists(model_path):
    if os.path.exists(model_path):
        return load_model(model_path)
    else:
        return None

def load_model_from_db(symbol):
    db = connect_to_db()
    collection = db['models']
    doc = collection.find_one({'symbol': symbol})

    if doc is not None:
        print(f"Document found for symbol {symbol}")
        if 'model' in doc:
            print("Model key found in document")
            binary_model = doc['model']
            with open('model.h5', 'wb') as f:
                f.write(binary_model)
            model = load_model('model.h5')
            os.remove('model.h5')
        else:
            print("Model key not found in document")
            model = None
    else:
        print(f"No document found for symbol {symbol}")
        model = None

    return model

def save_model_to_db(model, symbol):
    model.save('model.h5')
    with open('model.h5', 'rb') as f:
        binary_model = Binary(f.read())

    db = connect_to_db()
    collection = db['models']
    collection.update_one({'symbol': symbol}, {'$set': {'model': binary_model}}, upsert=True)
    os.remove('model.h5')

def main(symbol, start_date, end_date):
    data = download_data(symbol, start_date, end_date)

    if data is None:
        print(f"No data found on {symbol} Exiting.")
        return

    dataset, training_data_len = create_dataset(data)
    scaled_data, scaler = scale_data(dataset)

    model = load_model_from_db(symbol)

    if model is None:
        print(f"No model found for symbol {symbol}. Please train a model first.")
        x_train, y_train = create_training_data(scaled_data, training_data_len)
        x_train = reshape_data(x_train)
        model = build_and_train_model(x_train, y_train)
        save_model_to_db(model, symbol)
    else:
        print(f"Model found for symbol {symbol}. Using existing model.")

    x_test, y_test = create_test_data(scaled_data, dataset, training_data_len)
    predictions = make_predictions(model, x_test, scaler)
    plot_data(data, training_data_len, predictions, symbol)

if __name__ == "__main__":
    main("BN4.SI", "2000-01-01", datetime.today())
