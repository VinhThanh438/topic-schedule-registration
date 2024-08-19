import routes from '@api/router';
import express, { Express, NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { ValidationError } from 'express-validation';
import { StatusCode } from '@config/status-code';

export class ExpressServer {
    private server?: Express;

    public async setup(port: number): Promise<Express> {
        const server = express();

        this.configBodyParser(server);
        this.useRoute(server);
        this.setupErrorHandler(server);
        this.listen(server, port);

        return this.server;
    }

    public useRoute(app: Express) {
        app.use(routes);
    }

    public configBodyParser(app: Express) {
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
    }

    public listen(app: Express, port: number) {
        app.listen(port, () => {
            console.log(`Application is running on port: ${port}`);
        });
    }

    private setupErrorHandler(server: Express) {
        server.use((err: Error, req: Request, res: Response, next: NextFunction) => {
            if (err instanceof ValidationError) return res.status(err.statusCode).json(err);
            return res.status(StatusCode.SERVER_ERROR).json(err);
        });
    }
}
