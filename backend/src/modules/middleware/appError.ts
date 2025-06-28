export class AppError extends Error {
    status: number;
    success: boolean;
    errors: { path: string; message: string }[];

    constructor(
        message: string,
        status = 500,
        success = false,
        errors: { path: string; message: string }[] = []
    ) {
        super(message);
        this.status = status;
        this.success = success;
        this.errors = errors;
        this.name = 'AppError';
    }
}