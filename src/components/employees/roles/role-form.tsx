"use client";

import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RHFInput, RHFSelect } from "@/components/ui/form-components";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormItem,
  FormLabel,
  FormField,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { roleSchema, RoleFormData } from "@/lib/validations/role.validation";
import { Shield } from "lucide-react";
import { Role } from "@/types/role.type";

import { Permission, PermissionModuleGroup } from "@/types/permission.type";
import { usePermissions } from "@/services/api/roles/permission.queries";
import { useBrands } from "@/services/api/brands/brands.queries";
import { useIntl } from "react-intl";

interface RoleFormContentProps {
  form: ReturnType<typeof useForm<RoleFormData>>;
}

export const renderPermissionModule = (
  t: ReturnType<typeof useTranslation>["t"],
  form: ReturnType<typeof useForm<RoleFormData>>,
  moduleName: string,
  permissions: Permission[],
) => {
  const watched = form.watch("permissions") || [];

  const permissionNames = permissions.map((p) => p.name);

  const allSelected = permissionNames.every((name) => watched.includes(name));
  const partiallySelected =
    !allSelected && permissionNames.some((name) => watched.includes(name));

  const toggleModule = (checked: boolean) => {
    const current = form.getValues("permissions") || [];

    const updated = checked
      ? Array.from(new Set([...current, ...permissionNames]))
      : current.filter((p) => !permissionNames.includes(p));

    form.setValue("permissions", updated, { shouldValidate: true });
  };

  return (
    <Card key={moduleName} className="border-2">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Checkbox
            checked={allSelected}
            onCheckedChange={(checked) => toggleModule(Boolean(checked))}
            data-indeterminate={partiallySelected ? "true" : undefined}
          />
          <Shield className="w-5 h-5 text-primary" />
          {moduleName}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {permissions.map((permission) => (
          <FormField
            key={permission._id}
            control={form.control}
            name="permissions"
            render={({ field }) => {
              const value = field.value || [];
              const isChecked = value.includes(permission.name);

              return (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={(checked) => {
                        const updated = checked
                          ? [...value, permission.name]
                          : value.filter((v) => v !== permission.name);

                        field.onChange(updated);
                      }}
                    />
                  </FormControl>

                  <div className="space-y-1 leading-none flex-1">
                    <FormLabel className="text-sm font-normal flex items-center gap-2">
                      {permission.name}
                    </FormLabel>
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

export function RoleFormContent({ form }: RoleFormContentProps) {
  const { t } = useTranslation();
  const locale = useIntl().locale as "en" | "ar";

  const { data, isLoading } = usePermissions();
  const permissionModules: PermissionModuleGroup[] = data?.data || [];
  const { data: brandsResponse } = useBrands();
  const brands = brandsResponse?.data || [];
  const brandOptions = brands.map((brand) => ({
    value: brand._id,
    label: brand.name[locale],
  }));

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t("roles.form.basicInfo")}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <RHFInput
              form={form}
              name="name.en"
              label={t("roles.form.nameLabel") + " (English)"}
              placeholder={t("roles.form.nameEnglishPlaceholder")}
              description={t("roles.form.nameDescription")}
            />

            <RHFInput
              form={form}
              name="name.ar"
              label={t("roles.form.nameLabel") + " (العربية)"}
              placeholder={t("roles.form.nameArabicPlaceholder")}
              description={t("roles.form.nameDescription")}
            />
          </CardContent>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RHFSelect
              form={form}
              name="brandId"
              label={t("users.form.brandLabel")}
              placeholder={t("users.form.brandDescription")}
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
            {t("roles.form.permissionsLabel")}
          </CardTitle>

          <p className="text-sm text-muted-foreground">
            {t("roles.form.permissionsDescription")}
          </p>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">
              {t("common.loading")}
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {permissionModules.map((group) =>
                renderPermissionModule(
                  t,
                  form,
                  group.module,
                  group.permissions,
                ),
              )}
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
      name: { en: "", ar: "" },
      permissions: [],
      brandId: "",
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
        name: { en: "", ar: "" },
        permissions: [],
        brandId: "",
      });
    }
  }, [editingRole, form]);

  return { form, isEditing: !!editingRole };
}

export default RoleFormContent;
