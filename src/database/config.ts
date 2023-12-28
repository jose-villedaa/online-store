import { set, connect } from 'mongoose';
import { Logger, ILogObj } from 'tslog';

const log: Logger<ILogObj> = new Logger();

const dbConnection = async () => {
  try {
    set('strictQuery', false);
    const mongoDbUrl = process.env.MONGODB_CNN;
    if (!mongoDbUrl) {
      throw new Error('The MONGODB_CNN environment variable is not set');
    }
    await connect(mongoDbUrl);
    log.info('The database is connected');
  } catch (error) {
    log.error(error);
    throw new Error('Error al momento de conectar la base de datos');
  }
};

export default dbConnection;
