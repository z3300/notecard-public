import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/server/api/root';
import { prisma } from '@/server/db';

const handler = (req: Request) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => {
      return { prisma };
    },
    onError: (opts) => {
      console.error('tRPC Handler Error:', {
        error: opts.error,
        path: opts.path,
        input: opts.input,
        type: opts.type,
      });
    },
  });
};

export { handler as GET, handler as POST }; 