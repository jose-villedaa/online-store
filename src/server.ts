import express, { Express } from 'express';
import cors from 'cors';
import { Logger, ILogObj } from 'tslog';
import dbConnection from './database/config';

import auth from './routes/auth.route';
import search from './routes/find.route';
import user from './routes/user.route';
import category from './routes/category.route';
import product from './routes/product.route';
import invoice from './routes/invoice.route';
import cart from './routes/cart.route';

const log: Logger<ILogObj> = new Logger();

class Server {
  private app: Express;

  private port: string;

  private paths = {
    auth: '/api/auth',
    search: '/api/search',
    categories: '/api/categories',
    products: '/api/products',
    users: '/api/users',
    invoices: '/api/invoices',
    carts: '/api/carts',
  };

  constructor() {
    this.app = express();
    this.port = process.env.PORT || '';

    this.connectDB();

    this.middlewares();

    this.routes();
  }

  // eslint-disable-next-line class-methods-use-this
  private async connectDB() {
    await dbConnection();
  }

  private middlewares() {
    this.app.use(cors());

    this.app.use(express.json());

    this.app.use(express.static('public'));
  }

  private routes() {
    this.app.use(this.paths.auth, auth);
    this.app.use(this.paths.search, search);
    this.app.use(this.paths.users, user);
    this.app.use(this.paths.categories, category);
    this.app.use(this.paths.products, product);
    this.app.use(this.paths.invoices, invoice);
    this.app.use(this.paths.carts, cart);
  }

  public listen() {
    this.app.listen(this.port, () => {
      log.info(`Server running on port ${this.port}`);
    });
  }
}

export default Server;
