import { promises as fs } from 'fs';

export default async function writeModelFiles(ticker, doc) {
  // Parse the model JSON
  const modelJson = JSON.parse(Buffer.from(doc.model_json.buffer, 'base64').toString());

  // Modify the paths value in the weightsManifest array
  modelJson.weightsManifest.forEach((manifestItem, index) => {
    manifestItem.paths = manifestItem.paths.map(() => `${ticker}_weights_${index}.bin`);
  });

  // Write the modified model JSON to a file
  const modelJsonPath = `./tfjs_model/${ticker}_model.json`;
  await fs.writeFile(modelJsonPath, JSON.stringify(modelJson));

  // Write each weights data to a separate file
  await Promise.all(doc.model_weights.map((weightData, index) => {
    const weightPath = `./tfjs_model/${ticker}_weights_${index}.bin`;
    return fs.writeFile(weightPath, weightData.buffer);
  }));

  return {
    modelJsonPath,
    weightsPaths: doc.model_weights.map((_, index) => `./tfjs_model/${ticker}_weights_${index}.bin`)
  };
}