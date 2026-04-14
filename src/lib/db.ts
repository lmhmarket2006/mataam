import { PrismaClient, type Prisma } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prismaLog: Prisma.LogLevel[] =
  process.env.NODE_ENV === 'production' ? ['warn', 'error'] : ['query'];

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: prismaLog,
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db