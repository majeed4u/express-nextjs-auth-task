import { z } from 'zod';

export const registerSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters long'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    confirmPassword: z.string().min(6, 'Confirm Password must be at least 6 characters long'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
});

export type RegisterSchema = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters long').optional(),
    email: z.string().email('Invalid email address').optional(),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
}).refine((data) => data.username || data.email, {
    message: 'Either username or email must be provided',
    path: ['username', 'email'],
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const refreshTokenSchema = z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
});

export type RefreshTokenSchema = z.infer<typeof refreshTokenSchema>;