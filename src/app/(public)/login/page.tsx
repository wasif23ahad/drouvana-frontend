import React from 'react';
import AuthForm from '@/components/shared/AuthForm';

export default function LoginPage() {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-[100px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-success/10 rounded-full blur-[100px] -z-10 animate-pulse delay-1000" />
      
      <AuthForm mode="login" />
    </div>
  );
}
