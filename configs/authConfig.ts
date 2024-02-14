import { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import YandexProvider from 'next-auth/providers/yandex';

const { YANDEX_CLIENT_ID, YANDEX_CLIENT_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

export const authConfig: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID!,
      clientSecret: GOOGLE_CLIENT_SECRET!,
    }),
    YandexProvider({
      clientId: YANDEX_CLIENT_ID!,
      clientSecret: YANDEX_CLIENT_SECRET!,
    }),
  ],
};
