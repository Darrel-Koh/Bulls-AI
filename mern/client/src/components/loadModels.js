async function loadModel(ticker) {
    try {
      // Replace 'http://your-server-url' with the actual URL of your server
      const model = await tf.loadLayersModel(`${REACT_APP_BASE_URL}/${ticker}`);
      model.summary();
  
      // Prepare input data
      // const input = tf.tensor2d([some, input, values]);
  
      // Get the model prediction
      // const prediction = model.predict(input);
      // console.log(prediction.dataSync());
  
    } catch (error) {
      console.error(error);
    }
  }
  
  // Replace 'some-ticker' with the actual ticker you want to load the model for
  loadModel('some-ticker');