import prismadb from '@/lib/prismadb';
import bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password) return new NextResponse('Missing email, or password', { status: 400 });

  const exist = await prismadb.user.findUnique({ where: { email } });

  if (exist) return new NextResponse('User already exist', { status: 409 });

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prismadb.user.create({
    data: {
      email,
      passwordHash,
    },
  });

  const { passwordHash: reqPassword, ...userInfo } = user;

  return NextResponse.json(userInfo);
}
