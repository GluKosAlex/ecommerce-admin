'use client';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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

  const registerUser = async (data: UserData) => {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const userInfo = await response.json();
  };

  const onSubmit = async (values: UserData) => {
    setIsLoading(true);

    try {
      await registerUser(values);
      form.reset();
    } catch (error) {
      console.error('ОШИБКА СЕРВЕРА:', error); //TODO: Add toaster with errors
      form.setFocus('email', { shouldSelect: true });
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
                      <Input type='email' placeholder='name@example.com' {...field} />
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
                      <Input type='password' placeholder='' {...field} />
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
