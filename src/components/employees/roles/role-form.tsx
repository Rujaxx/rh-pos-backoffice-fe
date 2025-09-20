'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RHFInput, RHFSwitch } from '@/components/ui/form-components';
import { Checkbox } from '@/components/ui/checkbox';
import {
  FormItem,
  FormLabel,
  FormField,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { roleSchema, RoleFormData } from '@/lib/validations/role.validation';
import { UserRole } from '@/types/user.type';
import {
  Eye,
  Edit,
  Users,
  Trash2,
  Shield,
  FileText,
  CreditCard,
} from 'lucide-react';
import { PERMISSION_CATEGORIES } from '../users/user-permissions-modal';


interface RoleFormContentProps {
  form: ReturnType<typeof useForm<RoleFormData>>;
}

export function RoleFormContent({ form }: RoleFormContentProps) {
  const { t } = useTranslation();

  const renderPermissionIcon = (permission: string) => {
    const iconMap: Record<
      string,
      React.ComponentType<{ className?: string }>
    > = {
      read: Eye,
      write: Edit,
      delete: Trash2,
      manageUsers: Users,
      manageRoles: Shield,
      viewOrders: Eye,
      processOrders: Edit,
      voidOrders: Trash2,
      viewMenu: Eye,
      editMenu: Edit,
      viewReports: FileText,
      managePayments: CreditCard,
    };

    const IconComponent = iconMap[permission] || Shield;
    return <IconComponent className="w-4 h-4" />;
  };

  const renderPermissionCategory = (
    categoryKey: keyof typeof PERMISSION_CATEGORIES,
    category: (typeof PERMISSION_CATEGORIES)[keyof typeof PERMISSION_CATEGORIES]
  ) => {
    const CategoryIcon = category.icon;

    return (
      <Card key={categoryKey} className="border-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <CategoryIcon className="w-5 h-5 text-primary" />
            {t(`users.permissions.${categoryKey}`)}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {category.permissions.map((permission) => (
            <FormField
              key={permission}
              control={form.control}
              name="permissions"
              render={({ field }) => {
                return (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(permission)}
                        onCheckedChange={(checked) => {
                          const updatedPermissions = checked
                            ? [...(field.value || []), permission]
                            : field.value?.filter(
                                (value) => value !== permission
                              ) || [];
                          field.onChange(updatedPermissions);
                        }}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none flex-1">
                      <FormLabel className="text-sm font-normal flex items-center gap-2">
                        {renderPermissionIcon(permission)}
                        {t(`users.permissions.${permission}`)}
                      </FormLabel>
                      <p className="text-xs text-muted-foreground">
                        {t(`users.permissions.${permission}Description`)}
                      </p>
                    </div>
                  </FormItem>
                );
              }}
            />
          ))}
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Role Name Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t('roles.form.basicInfo')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <RHFInput
                form={form}
                name="name.en"
                label={t('roles.form.nameLabel') + ' (English)'}
                placeholder={t('roles.form.nameEnglishPlaceholder')}
                description={t('roles.form.nameDescription')}
              />

              <RHFInput
                form={form}
                name="name.ar"
                label={t('roles.form.nameLabel') + ' (العربية)'}
                placeholder={t('roles.form.nameArabicPlaceholder')}
                description={t('roles.form.nameDescription')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Role Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t('roles.form.activeStatusLabel')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RHFSwitch
              form={form}
              name="isActive"
              label={t('roles.form.activeStatusLabel')}
              description={t('roles.form.activeStatusDescription')}
            />

            {/* Permission Summary */}
            <div className="pt-4 border-t">
              <FormField
                control={form.control}
                name="permissions"
                render={({ field }) => (
                  <div className="space-y-2">
                    <FormLabel className="text-sm font-medium">
                      {t('roles.form.permissionsLabel')}
                    </FormLabel>
                    {field.value && field.value.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {field.value.map((permission) => (
                          <Badge
                            key={permission}
                            variant="secondary"
                            className="text-xs">
                            {t(`users.permissions.${permission}`)}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        {t('roles.permissions.count', { count: 0 })}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role Permissions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5" />
            {t('roles.form.permissionsLabel')}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {t('roles.form.permissionsDescription')}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Object.entries(PERMISSION_CATEGORIES).map(
              ([categoryKey, category]) =>
                renderPermissionCategory(
                  categoryKey as keyof typeof PERMISSION_CATEGORIES,
                  category
                )
            )}
          </div>
          <FormField
            control={form.control}
            name="permissions"
            render={() => <FormMessage className="mt-4" />}
          />
        </CardContent>
      </Card>
    </>
  );
}

// Hook for role form logic
export function useRoleForm(editingRole?: UserRole | null) {
  const form = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: {
        en: '',
        ar: '',
      },
      permissions: [],
      isActive: true,
    },
  });

  // Reset form when editing role changes
  React.useEffect(() => {
    if (editingRole) {
      form.reset({
        _id: editingRole._id,
        name: editingRole.name,
        permissions: editingRole.permissions,
        isActive: editingRole.isActive ?? true,
      });
    } else {
      form.reset({
        name: {
          en: '',
          ar: '',
        },
        permissions: [],
        isActive: true,
      });
    }
  }, [editingRole, form]);

  return {
    form,
    isEditing: !!editingRole,
  };
}

export default RoleFormContent;
