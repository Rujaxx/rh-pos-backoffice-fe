import { useState, useCallback, useMemo } from "react";
import {
  MenuItem,
  MenuItemFormData,
  MenuItemUpdateArray,
} from "@/types/menu-item.type";

export const useMenuItemChanges = (originalItems: MenuItem[]) => {
  const [modifiedItems, setModifiedItems] = useState<
    Map<string, Partial<MenuItem>>
  >(new Map());

  // Track which fields have been modified for each item
  const updateField = useCallback(
    (itemId: string, field: keyof MenuItem, value: unknown) => {
      setModifiedItems((prev) => {
        const newMap = new Map(prev);
        const existingChanges = newMap.get(itemId) || {};

        // Find original item
        const originalItem = originalItems.find((item) => item._id === itemId);

        // If value is same as original, remove from changes
        if (originalItem && originalItem[field] === value) {
          const { [field]: _removed, ...rest } = existingChanges as Record<
            string,
            unknown
          >;
          if (Object.keys(rest).length === 0) {
            newMap.delete(itemId);
          } else {
            newMap.set(itemId, rest);
          }
        } else {
          newMap.set(itemId, { ...existingChanges, [field]: value });
        }

        return newMap;
      });
    },
    [originalItems]
  );

  // Get modified value or original value
  const getFieldValue = useCallback(
    (itemId: string, field: keyof MenuItem) => {
      const changes = modifiedItems.get(itemId);
      if (changes && field in changes) {
        return changes[field];
      }
      const originalItem = originalItems.find((item) => item._id === itemId);
      return originalItem?.[field];
    },
    [modifiedItems, originalItems]
  );

  // Check if a field has been modified
  const isFieldModified = useCallback(
    (itemId: string, field: keyof MenuItem) => {
      const changes = modifiedItems.get(itemId);
      return changes ? field in changes : false;
    },
    [modifiedItems]
  );

  // Check if an item has any modifications
  const isItemModified = useCallback(
    (itemId: string) => {
      return modifiedItems.has(itemId);
    },
    [modifiedItems]
  );

  // Get all modified items for bulk update (complete objects)
  const getModifiedItemsForUpdate = useCallback((): MenuItemFormData[] => {
    const res = Array.from(modifiedItems.entries()).map(([_id, changes]) => {
      // Find original item
      const originalItem = originalItems.find((item) => item._id === _id);

      if (!originalItem) {
        throw new Error(`Original item with id ${_id} not found`);
      }

      const {
        menuName,
        brandName,
        categoryName,
        restaurantName,
        subCategoryName,
        taxProductGroupName,
        kitchenDepartmentName,
        createdAt,
        updatedAt,
        createdBy,
        updatedBy,
        ...rest
      } = originalItem;

      return {
        ...rest,
        ...changes,
      } as MenuItemUpdateArray;
    });
    return res;
  }, [modifiedItems, originalItems]);

  // Clear all changes
  const clearChanges = useCallback(() => {
    setModifiedItems(new Map());
  }, []);

  // Discard changes for a specific item
  const discardItemChanges = useCallback((itemId: string) => {
    setModifiedItems((prev) => {
      const newMap = new Map(prev);
      newMap.delete(itemId);
      return newMap;
    });
  }, []);

  // Count of modified items
  const modifiedCount = useMemo(() => modifiedItems.size, [modifiedItems]);

  // Check if there are any changes
  const hasChanges = useMemo(() => modifiedItems.size > 0, [modifiedItems]);

  return {
    updateField,
    getFieldValue,
    isFieldModified,
    isItemModified,
    getModifiedItemsForUpdate, // Returns MenuItem[] (complete objects)
    clearChanges,
    discardItemChanges,
    modifiedCount,
    hasChanges,
  };
};
