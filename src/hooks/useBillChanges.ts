import { Bill } from '@/types/bill.type';
import { useState, useCallback, useMemo } from 'react';

export const useBillChanges = (originalBills: Bill[]) => {
  const [modifiedBills, setModifiedBills] = useState<
    Map<string, Partial<Bill>>
  >(new Map());

  // Track which fields have been modified for each bill
  const updateField = useCallback(
    (billId: string, field: keyof Bill, value: unknown) => {
      setModifiedBills((prev) => {
        const newMap = new Map(prev);
        const existingChanges = newMap.get(billId) || {};

        // Find original bill
        const originalBill = originalBills.find((bill) => bill._id === billId);

        // If value is same as original, remove from changes
        if (originalBill && originalBill[field] === value) {
          const { [field]: _removed, ...rest } = existingChanges as Record<
            string,
            unknown
          >;
          if (Object.keys(rest).length === 0) {
            newMap.delete(billId);
          } else {
            newMap.set(billId, rest);
          }
        } else {
          newMap.set(billId, { ...existingChanges, [field]: value });
        }

        return newMap;
      });
    },
    [originalBills],
  );

  // Get modified value or original value
  const getFieldValue = useCallback(
    (billId: string, field: keyof Bill) => {
      const changes = modifiedBills.get(billId);
      if (changes && field in changes) {
        return changes[field];
      }
      const originalBill = originalBills.find((bill) => bill._id === billId);
      return originalBill?.[field];
    },
    [modifiedBills, originalBills],
  );

  // Check if a field has been modified
  const isFieldModified = useCallback(
    (billId: string, field: keyof Bill) => {
      const changes = modifiedBills.get(billId);
      return changes ? field in changes : false;
    },
    [modifiedBills],
  );

  // Check if a bill has any modifications
  const isBillModified = useCallback(
    (billId: string) => {
      return modifiedBills.has(billId);
    },
    [modifiedBills],
  );

  // Get all modified bills for bulk update
  const getModifiedBillsForUpdate = useCallback(() => {
    return Array.from(modifiedBills.entries()).map(([billId, changes]) => ({
      billId,
      changes,
    }));
  }, [modifiedBills]);

  // Clear all changes
  const clearChanges = useCallback(() => {
    setModifiedBills(new Map());
  }, []);

  // Discard changes for a specific bill
  const discardBillChanges = useCallback((billId: string) => {
    setModifiedBills((prev) => {
      const newMap = new Map(prev);
      newMap.delete(billId);
      return newMap;
    });
  }, []);

  // Count of modified bills
  const modifiedCount = useMemo(() => modifiedBills.size, [modifiedBills]);

  // Check if there are any changes
  const hasChanges = useMemo(() => modifiedBills.size > 0, [modifiedBills]);

  return {
    updateField,
    getFieldValue,
    isFieldModified,
    isBillModified,
    getModifiedBillsForUpdate,
    clearChanges,
    discardBillChanges,
    modifiedCount,
    hasChanges,
  };
};
