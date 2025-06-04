import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import type { PrismaClient } from '@prisma/client';

const t = initTRPC.context<{ prisma: PrismaClient }>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure; 