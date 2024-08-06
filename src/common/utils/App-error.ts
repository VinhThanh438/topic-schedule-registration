export class AppError extends Error {
    constructor(message?: string, option?: ErrorOptions) {
        super()
        this.message = message

        Object.setPrototypeOf(this, new.target.prototype);
        Object.defineProperty(this, 'name', {
			value: new.target.name,
			enumerable: false,
			configurable: true,
		})
        Error.captureStackTrace(this);
    }
}