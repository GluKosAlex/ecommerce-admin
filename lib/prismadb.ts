import { PrismaClient } from '@prisma/client';

// add to global object Prisma
declare global {
  var prisma: PrismaClient | undefined;
}

const prismadb = globalThis.prisma || new PrismaClient(); // Saves as from Next hot reloading
if (process.env.NODE_ENV !== 'production') global.prisma = prismadb;

export default prismadb;
