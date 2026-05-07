"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, AlertCircle, Globe } from 'lucide-react';
import axios from 'axios';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

interface AuthFormProps {
  mode: 'login' | 'register';
}

const AuthForm = ({ mode }: AuthFormProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Use a type union for the form values
  type FormValues = z.infer<typeof registerSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(mode === 'login' ? loginSchema : registerSchema) as any,
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      if (mode === 'register') {
        // Register logic via backend
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
          name: values.name,
          email: values.email,
          password: values.password,
        });
        
        // Auto sign in after registration
        const result = await signIn('credentials', {
          email: values.email,
          password: values.password,
          redirect: false,
        });

        if (result?.error) {
          setError('Registration successful, but login failed. Please login manually.');
        } else {
          router.push('/dashboard');
        }
      } else {
        // Login logic via NextAuth
        const result = await signIn('credentials', {
          email: values.email,
          password: values.password,
          redirect: false,
        });

        if (result?.error) {
          setError('Invalid email or password');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="glass rounded-3xl p-8 shadow-2xl shadow-primary/5">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-muted-foreground text-sm">
            {mode === 'login' 
              ? 'Enter your credentials to access your workspace' 
              : 'Join Drouvana and elevate your career search'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-center gap-3 text-destructive text-sm animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {mode === 'register' && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" className="bg-background/50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" className="bg-background/50" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" className="bg-background/50" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 h-11 text-lg font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </Button>
          </form>
        </Form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-transparent px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            className="h-11 border-border/50 hover:bg-primary/5 hover:border-primary/50 transition-all"
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            disabled={isLoading}
          >
            <Globe className="mr-2 h-4 w-4 text-blue-500" />
            Google
          </Button>
          <Button 
            variant="outline" 
            className="h-11 border-border/50 hover:bg-primary/5 hover:border-primary/50 transition-all"
            disabled={true}
          >
            <Globe className="mr-2 h-4 w-4" />
            Other
          </Button>
        </div>

        <div className="mt-8 text-center text-sm">
          <p className="text-muted-foreground">
            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
            <button 
              onClick={() => router.push(mode === 'login' ? '/register' : '/login')}
              className="text-primary font-semibold hover:underline"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
