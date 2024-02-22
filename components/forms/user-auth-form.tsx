'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import axios from 'axios';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const formSchema = z.object({
  email: z.string().min(7).email(),
  password: z.string().min(5).max(64),
});

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type UserData = z.infer<typeof formSchema>;

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const pathname = usePathname();
  const router = useRouter();

  const form = useForm<UserData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { toast } = useToast();

  const registerUser = async (data: UserData) => {
    const userInfo = await axios.post('/api/register', data);

    return userInfo;
  };

  const onSubmit = async (values: UserData) => {
    setIsLoading(true);

    if (pathname === '/sign-up') {
      await registerUser(values)
        .then(() => {
          form.reset();
          router.push('/sign-in');
        })
        .catch((error) => {
          console.error('SERVER ERROR:', error);
          toast({
            variant: 'destructive',
            title: 'Uh oh! Something went wrong.',
            description: 'There was a problem with your request.',
            action: (
              <ToastAction onClick={async () => await onSubmit(values)} altText='Try again'>
                Try again
              </ToastAction>
            ),
          });

          form.setFocus('email', { shouldSelect: true });
        });
    }

    if (pathname === '/sign-in') {
      await signIn('credentials', { ...values, redirect: false })
        .then((res) => {
          if (!res?.ok) return Promise.reject(res?.status + ': Not correct email or/and password');

          form.reset();
          router.push('/');
        })
        .catch((error) => {
          console.error('SERVER ERROR:', error);
          toast({
            variant: 'destructive',
            title: 'Uh oh! Something went wrong.',
            description: 'There was a problem with your request.',
            action: (
              <ToastAction onClick={async () => await onSubmit(values)} altText='Try again'>
                Try again
              </ToastAction>
            ),
          });

          form.setFocus('email', { shouldSelect: true });
        });
    }

    setIsLoading(false);
  };

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-8'>
            <div className='grid gap-2'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type='email' placeholder='name@example.com' {...field} autoComplete='email' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder=''
                        {...field}
                        autoComplete={pathname === '/sign-up' ? 'new-password' : 'current-password'}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type='submit' disabled={isLoading || (!form.formState.isValid && form.formState.isDirty)}>
              {isLoading && <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />}
              {pathname === '/sign-up' ? 'Sign Up' : 'Sign In'}
            </Button>
          </div>
        </form>
      </Form>

      {/* <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-background px-2 text-muted-foreground'>Or continue with</span>
        </div>
      </div>
      <Button variant='outline' type='button' disabled={isLoading}>
        {isLoading ? (
          <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
        ) : (
          <Icons.gitHub className='mr-2 h-4 w-4' />
        )}{' '}
        GitHub
      </Button> */}
    </div>
  );
}
