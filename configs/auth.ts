import { getServerSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
// import YandexProvider from 'next-auth/providers/yandex';
// import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from 'bcrypt';

import type { NextAuthOptions } from 'next-auth';
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';

import prismadb from '@/lib/prismadb';

// const { YANDEX_CLIENT_ID, YANDEX_CLIENT_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

export const authConfig = {
  adapter: PrismaAdapter(prismadb),

  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'your@email.com', required: 'true' },
        password: { label: 'Password', type: 'password', required: 'true' },
      },

      async authorize(credentials) {
        // Check if the email and password are passed
        if (!credentials?.email || !credentials.password) return null;

        const { email, password } = credentials;

        // Check if the user exists
        const user = await prismadb.user.findUnique({ where: { email } });
        if (!user) return null;

        // Check if the passwords match
        const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
        if (!passwordsMatch) return null;

        return user;
      },
    }),

    // GoogleProvider({
    //   clientId: GOOGLE_CLIENT_ID!,
    //   clientSecret: GOOGLE_CLIENT_SECRET!,
    // }),

    // YandexProvider({
    //   clientId: YANDEX_CLIENT_ID!,
    //   clientSecret: YANDEX_CLIENT_SECRET!,
    //   authorization: { params: { scope: '' } },
    // }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // Pass in new fields to token from user when he login first time
      if (user) token.userId = user.id;
      //TODO: try 'update' method via 'trigger' for updating user information

      return token;
    },

    async session({ session, token }) {
      // Pass in fields to session from the token to have access with useSession and useServerSession
      session.user.id = token.userId;

      return session;
    },
  },

  session: {
    strategy: 'jwt',
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  pages: { signIn: '/sign-in' }, // custom sign-in page
} satisfies NextAuthOptions;

// Helper function so you don't need to pass authOptions around
// Use it in server contexts
export function auth(
  ...args:
    | [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authConfig);
}
