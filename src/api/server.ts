import routes from '@api/router';
import express, { Express, NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { ValidationError } from 'express-validation';
import { StatusCode } from '@config/status-code';
import helmet from 'helmet';
import limiter from '@config/rate-limit';
import { Server } from 'http';
import { ROOT_ROUTE } from '@config/environment';

export class ExpressServer {
    private server?: Express;
    private httpServer: Server;

    public async setup(port: number): Promise<Express> {
        const server = express();

        this.configBodyParser(server);
        this.setupRatelimitingMiddleware(server);
        this.setupSecurityMiddlewares(server);
        this.useRoute(server);
        this.setupErrorHandler(server);
        this.listen(server, port);

        return this.server;
    }

    public setupRatelimitingMiddleware(app: Express) {
        app.use(limiter);
    }

    public useRoute(app: Express) {
        app.use(ROOT_ROUTE, routes);
    }

    public configBodyParser(app: Express) {
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
    }

    public setupSecurityMiddlewares(app: Express) {
        app.use(helmet());
        app.use(helmet.referrerPolicy({ policy: 'same-origin' }));
        app.disable('x-powered-by');
    }

    public listen(app: Express, port: number) {
        app.listen(port, () => {
            console.log(`Application is running on port: ${port}`);
        });
    }

    public setupErrorHandler(app: Express) {
        app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
            if (err instanceof ValidationError) return res.status(err.statusCode).json(err);
            return res.status(StatusCode.SERVER_ERROR).json(err);
        });
    }

    public async kill(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.httpServer) {
                this.httpServer.close((err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            } else {
                resolve();
            }
        });
    }
}
