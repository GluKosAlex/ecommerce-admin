import prismadb from '@/lib/prismadb';
import { AuthOptions } from 'next-auth';
import bcrypt from 'bcrypt';
import Credentials from 'next-auth/providers/credentials';
// import GoogleProvider from 'next-auth/providers/google';
// import YandexProvider from 'next-auth/providers/yandex';
import { PrismaAdapter } from '@next-auth/prisma-adapter';

// const { YANDEX_CLIENT_ID, YANDEX_CLIENT_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

export const authConfig: AuthOptions = {
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

  session: {
    strategy: 'jwt',
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  // pages: { signIn: '/sign-in' }, // custom sign-in page
};
