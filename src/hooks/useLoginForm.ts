'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/lib/validations/auth.validation';

// Hook for login form logic
export function useLoginForm() {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false,
    },
  });

  // Reset form to defaults
  const resetForm = React.useCallback(() => {
    form.reset({
      username: '',
      password: '',
      rememberMe: false,
    });
  }, [form]);

  return {
    form,
    resetForm,
  };
}

export default useLoginForm;