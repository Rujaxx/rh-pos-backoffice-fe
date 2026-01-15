'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Shield } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { Permission } from '@/types/permission.type';
import {
  resolvePermissionDependencies,
  toggleModulePermissions,
} from '@/lib/utils/permission.utils';

// Icon mapping can be passed or internal
import {
  Calculator,
  ChefHat,
  FileText,
  LayoutDashboard,
  Settings,
  Users,
  Utensils,
  CreditCard,
  Building2,
  Receipt,
  Image,
} from 'lucide-react';

interface PermissionSelectorProps {
  moduleName: string;
  permissions: Permission[];
  selectedPermissions: string[];
  onChange: (updatedPermissions: string[]) => void;
  disabled?: boolean;
}

export const getModuleIcon = (module: string) => {
  const map: Record<
    string,
    React.ComponentType<React.SVGProps<SVGSVGElement>>
  > = {
    BRAND: Building2,
    KITCHEN: ChefHat,
    MENU: Utensils,
    ORDER: Receipt,
    PAYMENT: CreditCard,
    REPORT: FileText,
    RESTAURANT: Building2,
    SYSTEM: Settings,
    TAX: Calculator,
    USER: Users,
    DASHBOARD: LayoutDashboard,
    IMAGE: Image,
  };

  // Try to match partial if exact not found
  if (map[module]) return map[module];
  const key = Object.keys(map).find((k) => module.includes(k));
  return key ? map[key] : Shield;
};

export function PermissionSelector({
  moduleName,
  permissions,
  selectedPermissions,
  onChange,
  disabled = false,
}: PermissionSelectorProps) {
  const { t } = useTranslation();
  const ModuleIcon = getModuleIcon(moduleName);

  const permissionNames = permissions.map((p) => p.name);
  const allSelected = permissionNames.every((name) =>
    selectedPermissions.includes(name),
  );
  const partiallySelected =
    !allSelected &&
    permissionNames.some((name) => selectedPermissions.includes(name));

  const handleToggleModule = (checked: boolean) => {
    const updated = toggleModulePermissions(
      selectedPermissions,
      permissionNames,
      checked,
    );
    onChange(updated);
  };

  const handleTogglePermission = (permissionName: string, checked: boolean) => {
    // Basic toggle logic
    // const updated = checked
    //   ? [...selectedPermissions, permissionName]
    //   : selectedPermissions.filter((p) => p !== permissionName);

    // Enhanced dependency logic
    const updated = resolvePermissionDependencies(
      selectedPermissions,
      permissionName,
      checked,
    );

    onChange(updated);
  };

  return (
    <Card className="border-2 h-full flex flex-col">
      <CardHeader className="pb-3 bg-muted/20 border-b mb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Checkbox
            checked={allSelected}
            onCheckedChange={(checked) => handleToggleModule(Boolean(checked))}
            disabled={disabled}
            data-indeterminate={partiallySelected ? 'true' : undefined}
          />
          <ModuleIcon className="w-5 h-5 text-primary ml-1" />
          <span className="truncate" title={moduleName}>
            {moduleName}
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 flex-1">
        {permissions.map((permission) => (
          <FormItem
            key={permission._id}
            className="flex flex-row items-start space-x-3 space-y-0"
          >
            <FormControl>
              <Checkbox
                checked={selectedPermissions.includes(permission.name)}
                onCheckedChange={(checked) =>
                  handleTogglePermission(permission.name, Boolean(checked))
                }
                disabled={disabled}
              />
            </FormControl>

            <div className="space-y-1 leading-none flex-1 pt-0.5">
              <FormLabel className="text-sm font-normal flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                {/* Try to translate using multiple possible keys or fallback to name */}
                {t(`users.permissions.${permission.name}`) !==
                `users.permissions.${permission.name}`
                  ? t(`users.permissions.${permission.name}`)
                  : permission.name}
              </FormLabel>
            </div>
          </FormItem>
        ))}
      </CardContent>
    </Card>
  );
}
