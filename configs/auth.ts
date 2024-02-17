import prismadb from '@/lib/prismadb';
import { AuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import YandexProvider from 'next-auth/providers/yandex';
import { PrismaAdapter } from '@next-auth/prisma-adapter';

const { YANDEX_CLIENT_ID, YANDEX_CLIENT_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

export const authConfig: AuthOptions = {
  adapter: PrismaAdapter(prismadb),
  session: {
    strategy: 'jwt',
  },
  // pages: { signIn: '/sign-in' }, // custom sign-in page
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'your@email.com', required: 'true' },
        password: { label: 'Password', type: 'password', required: 'true' },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const { email, password } = credentials;

        const user = prismadb.user.findUnique({ where: { email } });
        if (!user) return null;

        // const userPassword = user.;

        return null;
      },
    }),

    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID!,
      clientSecret: GOOGLE_CLIENT_SECRET!,
    }),

    YandexProvider({
      clientId: YANDEX_CLIENT_ID!,
      clientSecret: YANDEX_CLIENT_SECRET!,
      authorization: { params: { scope: '' } },
    }),
  ],

  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.username = token.username;
      }

      return session;
    },
  },
};
