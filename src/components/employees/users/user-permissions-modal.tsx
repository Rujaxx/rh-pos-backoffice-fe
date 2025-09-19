'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  FormMessage,
} from '@/components/ui/form';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  X,
  Eye,
  Save,
  Edit,
  Users,
  Trash2,
  Shield,
  FileText,
  CreditCard,
  ShoppingCart,
} from 'lucide-react';
import { User } from '@/types/user.type';
import { toast } from 'sonner';
import {
  PermissionFormData,
  permissionSchema,
} from '@/lib/validations/user.validation';
import Image from 'next/image';
import { useIntl } from 'react-intl';

// Permission categories and their permissions
export const PERMISSION_CATEGORIES = {
  systemAccess: {
    icon: Shield,
    permissions: ['read', 'write', 'delete'],
  },
  userManagement: {
    icon: Users,
    permissions: ['manageUsers', 'manageRoles'],
  },
  orderManagement: {
    icon: ShoppingCart,
    permissions: ['viewOrders', 'processOrders', 'voidOrders'],
  },
  menuManagement: {
    icon: FileText,
    permissions: ['viewMenu', 'editMenu'],
  },
  financial: {
    icon: CreditCard,
    permissions: ['viewReports', 'managePayments'],
  },
} as const;

// All available permissions
export const ALL_PERMISSIONS = Object.values(PERMISSION_CATEGORIES).flatMap(
  (category) => category.permissions
);

interface UserPermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onPermissionsUpdate: (userId: string, permissions: string[]) => Promise<void>;
  loading?: boolean;
}

export function UserPermissionsModal({
  isOpen,
  onClose,
  user,
  onPermissionsUpdate,
  loading = false,
}: UserPermissionsModalProps) {
  const { t } = useTranslation();
  const locale = useIntl().locale as 'en' | 'ar';
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PermissionFormData>({
    resolver: zodResolver(permissionSchema),
    defaultValues: {
      permissions: [],
    },
  });

  // Reset form when user changes
  useEffect(() => {
    if (user) {
      form.reset({
        permissions: user.role.permissions || [],
      });
    } else {
      form.reset({
        permissions: [],
      });
    }
  }, [user, form]);

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
          <CardTitle className="text-lg flex items-center gap-2">
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
                            ? [...field.value, permission]
                            : field.value?.filter(
                                (value) => value !== permission
                              );
                          field.onChange(updatedPermissions);
                        }}
                        disabled={isSubmitting || loading}
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
              name: `${user.firstName} ${user.lastName}`,
            })}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6">
            {/* User Information */}
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {user.profileImage ? (
                      <Image
                        src={user.profileImage}
                        alt={`${user.firstName} ${user.lastName}`}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      @{user.username} • {user.email}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm font-medium">
                        {t('users.permissions.currentRole')}:
                      </span>
                      <Badge variant="outline">{user.role.name[locale]}</Badge>
                      <Badge variant={user.isActive ? 'default' : 'secondary'}>
                        {user.isActive
                          ? t('common.active')
                          : t('common.inactive')}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Available Permissions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {t('users.permissions.availablePermissions')}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(PERMISSION_CATEGORIES).map(
                  ([categoryKey, category]) =>
                    renderPermissionCategory(
                      categoryKey as keyof typeof PERMISSION_CATEGORIES,
                      category
                    )
                )}
              </div>
            </div>

            <DialogFooter className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting || loading}>
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
            <FormMessage />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// Hook for managing permissions modal state
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
