import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/server/api/root';
import { prisma } from '@/server/db';

const handler = (req: Request) => {
  console.log('🚀 tRPC request received:', req.method, req.url);
  console.log('🔧 Environment variables check:');
  console.log('  - DATABASE_URL exists:', !!process.env.DATABASE_URL);
  console.log('  - NODE_ENV:', process.env.NODE_ENV);
  
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => {
      console.log('🏗️ Creating tRPC context with Prisma client');
      return { prisma };
    },
    onError: (opts) => {
      console.error('💥 tRPC Handler Error:', {
        error: opts.error,
        path: opts.path,
        input: opts.input,
        type: opts.type,
      });
    },
  });
};

export { handler as GET, handler as POST }; 