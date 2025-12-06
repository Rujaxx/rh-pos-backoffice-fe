'use client';

import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

function ErrorBoundaryContent({
  error,
  onReset,
}: {
  error: Error | undefined;
  onReset: () => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center min-h-[400px] p-6">
      <Alert variant="destructive" className="max-w-lg">
        <AlertTitle className="mb-2">{t('error.boundary.title')}</AlertTitle>
        <AlertDescription className="mb-4">
          {error?.message || t('error.boundary.description')}
        </AlertDescription>
        <Button variant="secondary" onClick={onReset}>
          {t('error.boundary.tryAgain')}
        </Button>
      </Alert>
    </div>
  );
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <ErrorBoundaryContent
          error={this.state.error}
          onReset={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}
