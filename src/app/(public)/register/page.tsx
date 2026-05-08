import React from 'react';
import AuthForm from '@/components/shared/AuthForm';

export default function RegisterPage() {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12 relative overflow-hidden min-h-screen">
      {/* Abstract Background Elements from Design */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-secondary/10 blur-[150px]" />
      </div>
      
      <AuthForm mode="register" />
    </div>
  );
}
