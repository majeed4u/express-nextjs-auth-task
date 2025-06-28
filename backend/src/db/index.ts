import { PrismaClient } from "../generated/prisma";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { betterAuth } from "better-auth";

declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
}
const prisma =
    global.prisma ||
    new PrismaClient({
        log: ["query", "info", "warn", "error"],
    });
if (process.env.NODE_ENV !== "production") {
    global.prisma = prisma;
}



export const db = prisma;
