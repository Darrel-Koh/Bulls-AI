// middleware.mjs
import { bullsdb } from '../db/conn.mjs';

  
export const closeDatabaseConnectionMiddleware = async (req, res, next) => {
    try {
      await bullsdb.close();
      next();
    } catch (error) {
      console.error('Error closing the database connection:', error);
      res.status(500).json({ error: 'Internal Server Error', details: 'Failed to close the database connection' });
    }
  };
  
export const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  };


export const asyncMiddleware = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
  
export const connectToDatabaseMiddleware = async (req, res, next) => {
    try {
      await bullsdb.connect();
      next();
    } catch (error) {
      console.error('Error connecting to the database:', error);
      if (process.env.NODE_ENV === 'production') {
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.status(500).json({ error: 'Internal Server Error', details: 'Failed to connect to the database' });
      }
    }
  };
  
  