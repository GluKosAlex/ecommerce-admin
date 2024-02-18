import { Metadata } from 'next';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { UserAuthForm } from '@/components/forms/user-auth-form';
import { buttonVariants } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Jou-B-Jou dashboard. Sign-in',
  description: 'Jou-B-Jou dashboard Sign-in page',
};

export default function RegisterPage() {
  return (
    <>
      <div className='container relative min-h-[800px] flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
        <Link
          href='/sign-up'
          className={cn(buttonVariants({ variant: 'ghost' }), 'absolute right-4 top-4 md:right-8 md:top-8')}
        >
          Register
        </Link>
        <div className='relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r'>
          <div className='absolute inset-0 bg-zinc-900' />
          <div className='relative z-20 flex items-center text-lg font-medium'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='mr-2 h-6 w-6'
            >
              <path d='M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3' />
            </svg>
            Jou-B-Jou
          </div>
          <div className='relative z-20 mt-auto'>
            <blockquote className='space-y-2'>
              <p className='text-lg'>
                &ldquo;Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque quisquam eum atque,
                animi maiores soluta totam laudantium velit dolor omnis quis alias ipsam at eius dolorem
                consectetur unde? Dicta, illum.&rdquo;
              </p>
              <footer className='text-sm'>Somebody Says</footer>
            </blockquote>
          </div>
        </div>
        <div className='lg:p-8'>
          <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
            <div className='flex flex-col space-y-2 text-center'>
              <h1 className='text-2xl font-semibold tracking-tight'>Login to account</h1>
              <p className='text-sm text-muted-foreground'>Enter your email below to login to your account</p>
            </div>

            <UserAuthForm />

            <p className='px-8 text-center text-sm text-muted-foreground'>
              By clicking continue, you agree to our{' '}
              <Link href='/terms' className='underline underline-offset-4 hover:text-primary'>
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href='/privacy' className='underline underline-offset-4 hover:text-primary'>
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
