'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  FormItem,
  FormLabel,
  FormField,
  FormControl,
} from '@/components/ui/form';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Shield, X, Save } from 'lucide-react';

import { User } from '@/types/user.type';
import { Permission } from '@/types/permission.type';
import { usePermissions } from '@/services/api/roles/permission.queries';

interface PermissionFormData {
  permissions: string[];
}

export function UserPermissionsModal({
  isOpen,
  onClose,
  user,
  onPermissionsUpdate,
  loading = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onPermissionsUpdate: (userId: string, permissions: string[]) => Promise<void>;
  loading?: boolean;
}) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🟢 FETCH PERMISSION MODULES FROM API
  const { data, isLoading: isPermissionsLoading } = usePermissions();
  const permissionModules = data?.data || [];

  const form = useForm<PermissionFormData>({
    defaultValues: {
      permissions: [],
    },
  });

  useEffect(() => {
    if (user && isOpen) {
      // User has effectivePermissions as string[]
      const userPermissions = Array.isArray(user.effectivePermissions)
        ? user.effectivePermissions
        : [];
      form.reset({
        permissions: userPermissions,
      });
    }
  }, [user, isOpen, form]);

  const handleClose = () => {
    if (!isSubmitting && !loading) {
      form.reset();
      onClose();
    }
  };

  const handleSubmit = async (data: PermissionFormData) => {
    if (!user?._id) return;

    setIsSubmitting(true);
    try {
      await onPermissionsUpdate(user._id, data.permissions);
      toast.success(t('users.permissions.success'));
      handleClose();
    } catch (error) {
      console.error('Update permissions error:', error);
      toast.error(t('users.permissions.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Dynamic icon picker based on module name
  const getModuleIcon = (module: string) => {
    const map: Record<
      string,
      React.ComponentType<React.SVGProps<SVGSVGElement>>
    > = {
      BRAND: Shield,
      KITCHEN: Shield,
      MENU: Shield,
      ORDER: Shield,
      PAYMENT: Shield,
      REPORT: Shield,
      RESTAURANT: Shield,
      SYSTEM: Shield,
      TAX: Shield,
      USER: Shield,
    };
    return map[module] ?? Shield;
  };

  const renderPermissionModule = (
    moduleName: string,
    permissions: Permission[],
    existingPermissions: string[],
  ) => {
    const ModuleIcon = getModuleIcon(moduleName);
    return (
      <Card key={moduleName} className="border-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <ModuleIcon className="w-5 h-5 text-primary" />
            {moduleName}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {permissions.map((permission) => (
            <FormField
              key={permission._id}
              control={form.control}
              name="permissions"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={
                        field.value.includes(permission.name)
                        // field.value.includes(permission._id) ||
                        // existingPermissions.includes(permission._id)
                      }
                      onCheckedChange={(checked) => {
                        const updated = checked
                          ? [...field.value, permission._id]
                          : field.value.filter((p) => p !== permission._id);

                        field.onChange(updated);
                      }}
                      disabled={isSubmitting || loading}
                    />
                  </FormControl>

                  <div className="space-y-1 leading-none flex-1">
                    <FormLabel className="text-sm font-normal flex items-center gap-2">
                      {t(`users.permissions.${permission.name}`)}
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
          ))}
        </CardContent>
      </Card>
    );
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            {t('users.permissions.title')}
          </DialogTitle>
          <DialogDescription>
            {t('users.permissions.description', {
              name: `${user.name}`,
            })}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* User Info */}
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      @{user.username} • {user.email}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Permissions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {t('users.permissions.availablePermissions')}
              </h3>

              {isPermissionsLoading ? (
                <p>{t('common.loading')}</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {permissionModules.map((group) =>
                    renderPermissionModule(
                      group.module,
                      group.permissions,
                      user.permissions as string[],
                    ),
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <DialogFooter className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting || loading}
              >
                <X className="w-4 h-4 mr-2" />
                {t('common.cancel')}
              </Button>

              <Button type="submit" disabled={isSubmitting || loading}>
                {isSubmitting || loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    {t('common.saving')}
                  </div>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {t('common.save')}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// Hook
export function usePermissionsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const openPermissionsModal = (user: User) => {
    setSelectedUser(user);
    setIsOpen(true);
  };

  const closePermissionsModal = () => {
    setIsOpen(false);
    setSelectedUser(null);
  };

  return {
    isPermissionsModalOpen: isOpen,
    selectedUser,
    openPermissionsModal,
    closePermissionsModal,
  };
}

export default UserPermissionsModal;
