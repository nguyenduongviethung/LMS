import { HttpError } from "./HttpError";

export class ConflictError extends HttpError {
    constructor(message = "Conflict") {
        super(message, 409);
    }
}
