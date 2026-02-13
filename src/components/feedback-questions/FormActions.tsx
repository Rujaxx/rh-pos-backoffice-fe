import React from 'react';
import { Button } from '@/components/ui/button';

interface FormActionsProps {
  isLoading?: boolean;
  onCancel?: () => void;
  submitLabel?: string;
  loadingLabel?: string;
}

/**
 * Shared form action buttons component
 * Used consistently across all question forms
 */
export const FormActions: React.FC<FormActionsProps> = ({
  isLoading,
  onCancel,
  submitLabel = 'Save Question',
  loadingLabel = 'Saving...',
}) => {
  return (
    <div className="flex justify-end gap-2 pt-4">
      {onCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
      )}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? loadingLabel : submitLabel}
      </Button>
    </div>
  );
};
