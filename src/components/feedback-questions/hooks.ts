import { useEffect } from 'react';
import { UseFormReturn, FieldValues, DefaultValues } from 'react-hook-form';

export function useFormValueChange<T extends FieldValues>(
  watch: UseFormReturn<T>['watch'],
  onValuesChange?: (data: Partial<T>) => void,
) {
  useEffect(() => {
    if (onValuesChange) {
      const subscription = watch((value) => {
        onValuesChange(value as Partial<T>);
      });
      return () => subscription.unsubscribe();
    }
  }, [watch, onValuesChange]);
}

export function useFormReset<T extends FieldValues>(
  initialData: Partial<T> | undefined,
  reset: UseFormReturn<T>['reset'],
) {
  useEffect(() => {
    if (initialData) {
      reset(initialData as DefaultValues<T>);
    }
  }, [initialData, reset]);
}
