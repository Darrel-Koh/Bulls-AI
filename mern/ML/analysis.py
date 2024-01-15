from pymongo import MongoClient
import os
import pymongo
import pandas as pd
import requests

# Create a client
# client = MongoClient('mongodb://localhost:27017/')
# Read the connection string from the config.env file
with open('../server/config.env', 'r') as file:
    connection_string = file.read().strip()

connection_string = connection_string.replace('ATLAS_URI=', '')
# print(connection_string)

# Create a client
client = pymongo.MongoClient(connection_string)

# Connect to your database
db = client['your_database_name']

# Get your collection
collection = db['records']

# Retrieve all documents
documents = collection.find()

# Print all documents
for document in documents:
    print(document)