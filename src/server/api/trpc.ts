import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import type { PrismaClient } from '@prisma/client';

const t = initTRPC.context<{ prisma: PrismaClient }>().create({
  transformer: superjson,
  errorFormatter: ({ shape, error }) => {
    console.error('🚨 tRPC Error:', {
      code: error.code,
      message: error.message,
      cause: error.cause,
    });
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === 'BAD_REQUEST' && error.cause?.constructor?.name === 'ZodError'
            ? error.cause.flatten()
            : null,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure; 