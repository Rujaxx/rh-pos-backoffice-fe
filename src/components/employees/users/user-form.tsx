'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  RHFInput,
  RHFSelect,
  RHFSwitch,
} from '@/components/ui/form-components';
import { userSchema, UserFormData } from '@/lib/validations/user.validation';
import { User, UserRole, Restaurant } from '@/types/user.type';
import {
  FormItem,
  FormLabel,
  FormField,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { useIntl } from 'react-intl';
import { MultiSelectDropdown } from '@/components/ui/multiSelectDropdown';

interface UserFormContentProps {
  form: ReturnType<typeof useForm<UserFormData>>;
  roles: UserRole[];
  restaurants: Restaurant[];
}

export function UserFormContent({
  form,
  roles,
  restaurants,
}: UserFormContentProps) {
  const { t } = useTranslation();
  const locale = useIntl().locale as 'en' | 'ar';

  // Convert roles to select options
  const roleOptions = roles
    .filter((role) => role.isActive)
    .map((role) => ({
      value: role._id,
      label: role.name[locale],
    }));

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">
            {t('users.form.personalInfo')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RHFInput
              form={form}
              name="firstName"
              label={t('users.form.firstNameLabel')}
              placeholder={t('users.form.firstNamePlaceholder')}
            />

            <RHFInput
              form={form}
              name="lastName"
              label={t('users.form.lastNameLabel')}
              placeholder={t('users.form.lastNamePlaceholder')}
            />
          </div>

          <RHFInput
            form={form}
            name="username"
            label={t('users.form.usernameLabel')}
            placeholder={t('users.form.usernamePlaceholder')}
            description={t('users.form.usernameDescription')}
          />

          <RHFInput
            form={form}
            name="email"
            label={t('users.form.emailLabel')}
            placeholder={t('users.form.emailPlaceholder')}
            type="email"
          />

          <RHFInput
            form={form}
            name="phone"
            label={t('users.form.phoneLabel')}
            placeholder={t('users.form.phonePlaceholder')}
            type="tel"
          />

          <RHFSwitch
            form={form}
            name="isActive"
            label={t('users.form.activeStatusLabel')}
            description={t('users.form.activeStatusDescription')}
          />
        </CardContent>
      </Card>

      {/* Role and Access Information */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">
            {t('users.form.roleInfo')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RHFSelect
              form={form}
              name="role"
              label={t('users.form.roleLabel')}
              placeholder={t('users.form.rolePlaceholder')}
              options={roleOptions}
            />
          </div>
        </CardContent>
      </Card>

      {/* Restaurant Assignment */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">
            {t('users.form.restaurantAccess')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="restaurants"
            render={({ field }) => {
              const restaurantOptions = restaurants.map((restaurant) => ({
                value: restaurant._id,
                label: restaurant.name[locale],
              }));

              return (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-medium">
                    {t('users.form.restaurantLabel')}
                  </FormLabel>
                  <FormControl>
                    <MultiSelectDropdown
                      options={restaurantOptions}
                      value={field.value || []}
                      onChange={(val) => field.onChange(val)}
                      placeholder={t('users.form.restaurantDescription')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

// Hook for user form logic
export function useUserForm(
  editingUser?: User | null,
  roles: UserRole[] = [],
  restaurants: Restaurant[] = []
) {
  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      phone: '',
      role: '',
      designation: '',
      restaurants: [],
      isActive: true,
      profileImage: '',
    },
  });

  // Reset form when editing user changes
  React.useEffect(() => {
    if (editingUser) {
      form.reset({
        firstName: editingUser.firstName,
        lastName: editingUser.lastName,
        username: editingUser.username,
        email: editingUser.email,
        phone: editingUser.phone || '',
        role: editingUser.role._id,
        designation: editingUser.designation,
        restaurants: editingUser.restaurants,
        isActive: editingUser.isActive ?? true,
        profileImage: editingUser.profileImage || '',
      });
    } else {
      form.reset({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        phone: '',
        role: '',
        designation: '',
        restaurants: [],
        isActive: true,
        profileImage: '',
      });
    }
  }, [editingUser, form]);

  return {
    form,
    isEditing: !!editingUser,
  };
}

export default UserFormContent;
