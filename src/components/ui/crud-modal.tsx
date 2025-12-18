'use client';

import React from 'react';
import { UseFormReturn, SubmitHandler } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Save, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';

export interface CrudModalProps<
  TFormData extends Record<string, unknown> = Record<string, unknown>,
> {
  // Modal state
  isOpen: boolean;
  onClose: () => void;

  // Modal content
  title: string;
  description?: string;

  // Form handling
  form: UseFormReturn<TFormData, unknown>;
  onSubmit: (data: TFormData) => Promise<void>;
  loading?: boolean;

  // Form content
  children: React.ReactNode;

  // Customization
  size?: 'sm' | 'md' | 'lg' | 'ml' | 'xl' | 'full';
  className?: string;

  // Action buttons
  submitButtonText?: string;
  cancelButtonText?: string;
  showCancelButton?: boolean;
  showSubmitButton?: boolean;

  // Footer customization
  footer?: React.ReactNode;
}

export const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  ml: 'max-w-4xl',
  xl: 'max-w-4xl',
  full: 'max-w-[95vw] w-full',
};

export function CrudModal<
  TFormData extends Record<string, unknown> = Record<string, unknown>,
>({
  isOpen,
  onClose,
  title,
  description,
  form,
  onSubmit,
  loading = false,
  children,
  size = 'lg',
  className,
  submitButtonText,
  cancelButtonText,
  showCancelButton = true,
  showSubmitButton = true,
  footer,
}: CrudModalProps<TFormData>) {
  const { t } = useTranslation();
  const handleSubmit: SubmitHandler<TFormData> = async (data: TFormData) => {
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      // Error handling is done in the parent component
      console.error('Form submission error:', error);
    }
  };

  const handleClose = () => {
    if (!loading) {
      form.reset();
      onClose();
    }
  };

  // Determine submit button text based on context
  const getSubmitButtonText = () => {
    if (submitButtonText) return submitButtonText;
    const formValues = form.getValues() as Record<string, unknown>;
    const hasId = formValues?._id || formValues?.id;
    return hasId ? t('common.update') : t('common.create');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className={cn(
          sizeClasses[size],
          'max-h-[90vh] overflow-y-auto',
          className,
        )}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="space-y-4">{children}</div>

            {footer || (
              <DialogFooter className="flex justify-end space-x-2">
                {showCancelButton && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={loading}
                  >
                    <X className="w-4 h-4 mr-2" />
                    {cancelButtonText || t('common.cancel')}
                  </Button>
                )}
                {showSubmitButton && (
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                        {t('common.saving')}
                      </div>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        {getSubmitButtonText()}
                      </>
                    )}
                  </Button>
                )}
              </DialogFooter>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// Specialized modal components for different use cases

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  description: string;
  loading?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  variant?: 'default' | 'destructive';
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  loading = false,
  confirmButtonText,
  cancelButtonText,
  variant = 'default',
}: ConfirmationModalProps) {
  const { t } = useTranslation();
  const handleConfirm = async () => {
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Confirmation action error:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            {cancelButtonText || t('common.cancel')}
          </Button>
          <Button
            type="button"
            variant={variant === 'destructive' ? 'destructive' : 'default'}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                {t('common.processing')}
              </div>
            ) : (
              confirmButtonText || t('common.confirm')
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Hook for managing modal state
export function useModal<T = unknown>() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<T | null>(null);

  const openModal = (item?: T) => {
    setEditingItem(item || null);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setEditingItem(null);
  };

  return {
    isOpen,
    editingItem,
    openModal,
    closeModal,
  };
}

// Hook for confirmation modals
export function useConfirmationModal() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [onConfirm, setOnConfirm] = React.useState<
    (() => Promise<void>) | null
  >(null);
  const [config, setConfig] = React.useState<{
    title: string;
    description: string;
    confirmButtonText?: string;
    variant?: 'default' | 'destructive';
  }>({
    title: '',
    description: '',
  });

  const openConfirmationModal = (
    confirmAction: () => Promise<void>,
    modalConfig: {
      title: string;
      description: string;
      confirmButtonText?: string;
      variant?: 'default' | 'destructive';
    },
  ) => {
    setOnConfirm(() => confirmAction);
    setConfig(modalConfig);
    setIsOpen(true);
  };

  const closeConfirmationModal = () => {
    setIsOpen(false);
    setOnConfirm(null);
    setConfig({ title: '', description: '' });
  };

  return {
    isConfirmationOpen: isOpen,
    confirmationConfig: config,
    openConfirmationModal,
    closeConfirmationModal,
    executeConfirmation: onConfirm,
  };
}
