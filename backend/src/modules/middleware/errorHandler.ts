import { ZodError } from 'zod'


export const handleZodeError = (error: ZodError) => {
    return {
        status: 400,
        success: false,
        message: 'Validation error',
        errors: error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message
        }))
    }
}

export const handleServerError = (error: Error) => {
    console.error('Server Error:', error);
    return {
        status: 500,
        success: false,
        message: 'Internal server error',
        errors: [{ path: 'server', message: 'An unexpected error occurred' }]
    }
}