import { HttpError } from "./HttpError";

export class NotFoundError extends HttpError {
    constructor(message = "Resource not found") {
        super(message, 404);
    }
}
