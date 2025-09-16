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
  RHFFileUpload,
} from '@/components/ui/form-components';
import { userSchema, UserFormData } from '@/lib/validations/user';
import { User, UserRole, Restaurant } from '@/types/user';
import { Checkbox } from '@/components/ui/checkbox';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';

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

  // Convert roles to select options
  const roleOptions = roles.map((role) => ({
    value: role._id,
    label: role.name,
  }));

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t('users.form.personalInfo')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
          </CardContent>
        </Card>

        {/* Profile Image */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t('users.form.profileInfo')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RHFFileUpload
              form={form}
              name="profileImage"
              label={t('users.form.profileImageLabel')}
              accept="image/*"
              description={t('users.form.profileImageDescription')}
            />

            <RHFSwitch
              form={form}
              name="isActive"
              label={t('users.form.activeStatusLabel')}
              description={t('users.form.activeStatusDescription')}
            />
          </CardContent>
        </Card>
      </div>

      {/* Role and Access Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('users.form.roleInfo')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RHFSelect
              form={form}
              name="role"
              label={t('users.form.roleLabel')}
              placeholder={t('users.form.rolePlaceholder')}
              options={roleOptions}
            />

            <RHFInput
              form={form}
              name="designation"
              label={t('users.form.designationLabel')}
              placeholder={t('users.form.designationPlaceholder')}
              description={t('users.form.designationDescription')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Restaurant Assignment */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {t('users.form.restaurantAccess')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="restaurants"
            render={() => (
              <FormItem>
                <FormLabel>{t('users.form.restaurantLabel')}</FormLabel>
                <FormControl>
                  <div className="space-y-3">
                    {restaurants.map((restaurant) => (
                      <FormField
                        key={restaurant._id}
                        control={form.control}
                        name="restaurants"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={restaurant._id}
                              className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(
                                    restaurant._id
                                  )}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          restaurant._id,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value: string) =>
                                              value !== restaurant._id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="text-sm font-normal">
                                  {restaurant.name}
                                </FormLabel>
                                {restaurant.location && (
                                  <Badge variant="outline" className="text-xs">
                                    {restaurant.location}
                                  </Badge>
                                )}
                              </div>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </>
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
