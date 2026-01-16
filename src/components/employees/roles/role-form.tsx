'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RHFInput, RHFSelect } from '@/components/ui/form-components';
import { FormField, FormMessage } from '@/components/ui/form';
import { roleSchema, RoleFormData } from '@/lib/validations/role.validation';
import { Shield } from 'lucide-react';
import { Role } from '@/types/role.type';

import { PermissionModuleGroup } from '@/types/permission.type';
import { usePermissions } from '@/services/api/roles/permission.queries';
import { useBrands } from '@/services/api/brands/brands.queries';
import { useIntl } from 'react-intl';
import { PermissionSelector } from '@/components/common/permissions/permission-selector';

interface RoleFormContentProps {
  form: ReturnType<typeof useForm<RoleFormData>>;
}

export function RoleFormContent({ form }: RoleFormContentProps) {
  const { t } = useTranslation();
  const locale = useIntl().locale as 'en' | 'ar';

  const { data, isLoading } = usePermissions();
  const permissionModules: PermissionModuleGroup[] = data?.data || [];
  const { data: brandsResponse } = useBrands();
  const brands = brandsResponse?.data || [];
  const brandOptions = brands.map((brand) => ({
    value: brand._id,
    label: brand.name[locale] || brand.name.en,
  }));

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t('roles.form.basicInfo')}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
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
          </CardContent>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RHFSelect
              form={form}
              name="brandId"
              label={t('users.form.brandLabel')}
              placeholder={t('users.form.brandDescription')}
              options={brandOptions}
            />
            <CardContent />
          </CardContent>
        </Card>
      </div>

      {/* Permissions */}
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
          {isLoading ? (
            <p className="text-sm text-muted-foreground">
              {t('common.loading')}
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {permissionModules.map((group) => (
                <FormField
                  key={group.module}
                  control={form.control}
                  name="permissions"
                  render={({ field }) => (
                    <PermissionSelector
                      moduleName={group.module}
                      permissions={group.permissions}
                      selectedPermissions={field.value}
                      onChange={(updated) => field.onChange(updated)}
                    />
                  )}
                />
              ))}
            </div>
          )}

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

export function useRoleForm(editingRole?: Role | null) {
  const form = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: { en: '', ar: '' },
      permissions: [],
      brandId: '',
    },
  });

  React.useEffect(() => {
    if (editingRole) {
      form.reset({
        _id: editingRole._id,
        name: editingRole.name,
        permissions: editingRole.permissions.map((p) => p.name),
        brandId: editingRole.brandId,
      });
    } else {
      form.reset({
        name: { en: '', ar: '' },
        permissions: [],
        brandId: '',
      });
    }
  }, [editingRole, form]);

  return { form, isEditing: !!editingRole };
}

export default RoleFormContent;
