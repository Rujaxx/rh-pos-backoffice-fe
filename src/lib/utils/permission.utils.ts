export const resolvePermissionDependencies = (
  currentPermissions: string[],
  toggledPermission: string,
  isChecked: boolean,
): string[] => {
  // Simple toggle logic without dependencies
  const updatedPermissions = isChecked
    ? [...currentPermissions, toggledPermission]
    : currentPermissions.filter((p) => p !== toggledPermission);

  return [...new Set(updatedPermissions)];
};

export const toggleModulePermissions = (
  currentPermissions: string[],
  modulePermissions: string[],
  shouldSelectAll: boolean,
): string[] => {
  if (shouldSelectAll) {
    return [...new Set([...currentPermissions, ...modulePermissions])];
  } else {
    return currentPermissions.filter((p) => !modulePermissions.includes(p));
  }
};
