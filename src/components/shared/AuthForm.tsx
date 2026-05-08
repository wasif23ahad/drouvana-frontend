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
import { Loader2, AlertCircle, Globe, Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, User, Briefcase } from 'lucide-react';
import api from '@/lib/api';

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
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

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
        await api.post('/api/auth/register', {
          name: values.name,
          email: values.email,
          password: values.password,
        });
        
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
    <div className="relative z-10 w-full max-w-[1000px] min-h-[600px] bg-surface/50 backdrop-blur-2xl rounded-[24px] border border-white/5 flex flex-col md:flex-row shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
      
      {/* Left Side: Branding / Abstract */}
      <div className="hidden md:flex w-1/2 relative p-12 flex-col justify-between overflow-hidden bg-surface-2/30">
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay bg-linear-to-br from-primary/20 via-transparent to-accent/20" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-8">
            <Briefcase className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold font-hanken text-text-main">Drouvana</span>
          </div>
          <h1 className="text-4xl font-bold font-hanken text-text-main mt-12 mb-6 tracking-tight">
            Accelerate your career <span className="text-primary italic">trajectory.</span>
          </h1>
          <p className="text-text-sub text-sm max-w-md leading-relaxed">
            Harness the power of AI to navigate the modern job market, optimize your resume, and land your dream role faster.
          </p>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 p-3 rounded-xl bg-surface/50 backdrop-blur-md border border-white/5 inline-flex">
            <Sparkles className="w-4 h-4 text-primary fill-primary/20" />
            <span className="font-jetbrains text-[10px] uppercase tracking-widest text-primary font-bold">Operational AI Ecosystem</span>
          </div>
        </div>
      </div>

      {/* Right Side: Auth Card */}
      <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-surface border-l border-white/5 relative z-10">
        {/* Mobile Logo */}
        <div className="flex md:hidden items-center justify-center gap-2 mb-8">
          <Briefcase className="h-6 w-6 text-primary" />
          <span className="text-2xl font-bold font-hanken text-text-main">Drouvana</span>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 p-1 bg-surface-2 rounded-xl mb-8">
          <button 
            onClick={() => router.push('/login')}
            className={`w-1/2 py-2.5 rounded-lg font-jetbrains text-[10px] uppercase tracking-widest transition-all ${
              mode === 'login' ? 'bg-surface text-text-main shadow-sm border border-white/5' : 'text-text-muted hover:text-text-main'
            }`}
          >
            Login
          </button>
          <button 
            onClick={() => router.push('/register')}
            className={`w-1/2 py-2.5 rounded-lg font-jetbrains text-[10px] uppercase tracking-widest transition-all ${
              mode === 'register' ? 'bg-surface text-text-main shadow-sm border border-white/5' : 'text-text-muted hover:text-text-main'
            }`}
          >
            Sign Up
          </button>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold font-hanken text-text-main mb-2">
            {mode === 'login' ? 'Welcome back' : 'Create Account'}
          </h2>
          <p className="text-text-sub text-sm">
            {mode === 'login' ? 'Enter your details to access your dashboard.' : 'Start your journey towards a smarter career search.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl flex items-center gap-3 text-error text-xs animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {mode === 'register' && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-jetbrains text-[10px] uppercase tracking-widest text-text-muted ml-1">Full Identity</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <Input placeholder="John Doe" className="bg-surface-2 border-none rounded-xl h-12 pl-12 pr-4 focus-visible:ring-primary transition-all" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-jetbrains text-[10px] uppercase tracking-widest text-text-muted ml-1">Communication Node</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                      <Input placeholder="name@company.com" className="bg-surface-2 border-none rounded-xl h-12 pl-12 pr-4 focus-visible:ring-primary transition-all" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-jetbrains text-[10px] uppercase tracking-widest text-text-muted ml-1">Security Key</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        className="bg-surface-2 border-none rounded-xl h-12 pl-12 pr-12 focus-visible:ring-primary transition-all" 
                        {...field} 
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full rounded-xl h-12 font-bold shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 border-none mt-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Initialize Session' : 'Create Profile'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-8 flex items-center justify-center gap-4">
          <div className="h-px bg-white/5 flex-1" />
          <span className="font-jetbrains text-[10px] uppercase tracking-widest text-text-muted">Vector Access</span>
          <div className="h-px bg-white/5 flex-1" />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            className="h-11 rounded-xl text-xs gap-2"
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            disabled={isLoading}
          >
            <Globe className="w-4 h-4 text-primary" />
            Google
          </Button>
          <Button 
            variant="outline" 
            className="h-11 rounded-xl text-xs gap-2"
            onClick={() => {
                form.setValue('email', 'demo@drouvana.com');
                form.setValue('password', 'Demo@1234');
            }}
            disabled={isLoading}
          >
            <Sparkles className="w-4 h-4 text-primary" />
            Demo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
