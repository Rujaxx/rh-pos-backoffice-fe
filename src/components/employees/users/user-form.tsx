"use client";

import React, { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  RHFInput,
  RHFSelect,
  RHFSwitch,
} from "@/components/ui/form-components";
import { userSchema, UserFormData } from "@/lib/validations/user.validation";
import { User } from "@/types/user.type";
import {
  FormItem,
  FormLabel,
  FormField,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useIntl } from "react-intl";
import { MultiSelectDropdown } from "@/components/ui/multi-select-dropdown";
import {
  backendTimeToMinutes,
  DEFAULT_TIMES,
  timeStringToMinutes,
} from "@/lib/utils/time.utils";
import { LANGUAGES, COUNTRY_CODES } from "@/mock/dropdown-constants";
import {
  getTimezoneOptions,
  getDefaultTimezone,
} from "@/lib/utils/timezone.utils";
import { useRestaurants } from "@/services/api/restaurants/restaurants.queries";
import { useRoles } from "@/services/api/roles/roles.queries";
import { useBrands } from "@/services/api/brands/brands.queries";
import { Lock } from "lucide-react";

interface UserFormContentProps {
  form: ReturnType<typeof useForm<UserFormData>>;
}

export function UserFormContent({ form }: UserFormContentProps) {
  const { t } = useTranslation();
  const locale = useIntl().locale as "en" | "ar";
  const [showPassword, setShowPassword] = useState(false);
  const { data: restaurantsResponse } = useRestaurants();
  const { data: brandsResponse } = useBrands();
  const { data: rolesResponse } = useRoles();
  const restaurants = restaurantsResponse?.data || [];
  const brands = brandsResponse?.data || [];
  const roles = rolesResponse?.data || [];
  const timezoneOptions = getTimezoneOptions(t);

  const roleOptions = roles.map((role) => ({
    value: role._id,
    label: role.name[locale],
  }));

  const brandOptions = brands.map((brand) => ({
    value: brand._id,
    label: brand.name[locale],
  }));

  const restaurantOptions = restaurants.map((restaurant) => ({
    value: restaurant._id,
    label: restaurant.name[locale],
  }));

  const isPending = form.formState.isSubmitting;

  return (
    <div className="space-y-6">
      {/* Group 1: Personal & Contact Info (Side-by-side) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">
              {t("users.form.personalInfo")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <RHFInput
              form={form}
              name="name"
              label={t("users.form.nameLabel")}
              placeholder={t("users.form.namePlaceholder")}
              description={t("users.form.nameDescription")}
            />
            <RHFInput
              form={form}
              name="username"
              label={t("users.form.usernameLabel")}
              placeholder={t("users.form.usernamePlaceholder")}
              description={t("users.form.usernameDescription")}
            />
            <RHFInput
              form={form}
              name="designation"
              label={t("users.form.designationLabel")}
              placeholder={t("users.form.designationPlaceholder")}
              description={t("users.form.designationDescription")}
            />
          </CardContent>
        </Card>

        {/* Contact & Address */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">
              {t("users.form.contactInfo") || "Contact & Address"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <RHFInput
              form={form}
              name="email"
              label={t("users.form.emailLabel")}
              placeholder={t("users.form.emailPlaceholder")}
              type="email"
            />

            <CardContent className="flex gap-10 items-center">
              <RHFSelect
                form={form}
                name="countryCode"
                label={t("common.form.countryCode") || "Code"}
                placeholder="+91"
                options={COUNTRY_CODES}
              />
              <RHFInput
                form={form}
                name="phoneNumber"
                label={t("common.form.phoneLabel")}
                placeholder={t("common.form.phonePlaceholder")}
                type="tel"
                className="col-span-2"
              />
            </CardContent>

            <RHFInput
              form={form}
              name="address"
              label={t("users.form.addressLabel") || "Address"}
              placeholder={
                t("users.form.addressPlaceholder") || "Enter address"
              }
            />
          </CardContent>
        </Card>
      </div>

      {/* Group 2: Access Control (Full-width card with internal grid) */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">
            {t("users.form.accessControl") || "Access Control"}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="brandIds"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-sm font-medium">
                  {t("users.form.brandLabel") || "Assigned Brands"}
                </FormLabel>
                <FormControl>
                  <MultiSelectDropdown
                    options={brandOptions}
                    value={field.value || []}
                    onChange={(val) => field.onChange(val)}
                    placeholder={
                      t("users.form.brandDescription") ||
                      "Select which brands this user can access"
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="restaurantIds"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-sm font-medium">
                  {t("users.form.restaurantLabel")}
                </FormLabel>
                <FormControl>
                  <MultiSelectDropdown
                    options={restaurantOptions}
                    value={field.value || []}
                    onChange={(val) => field.onChange(val)}
                    placeholder={t("users.form.restaurantDescription")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Group 3: Security & Status (Side-by-side) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account & Security */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">
              {t("users.form.securityInfo") || "Account & Security"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("users.form.passwordLabel")}</FormLabel>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 rtl:left-auto rtl:right-3" />
                    <FormControl>
                      <input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rtl:pl-10 rtl:pr-10"
                        placeholder={t("users.form.passwordPlaceholder")}
                        disabled={isPending}
                      />
                    </FormControl>
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 rtl:right-auto rtl:left-3"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isPending}
                    >
                      {showPassword ? (
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L12 12m-2.122-2.122L7.76 7.76M12 12l2.122 2.122L16.24 16.24M7.76 7.76l-1.415-1.415M16.24 16.24l1.415 1.415"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <RHFSelect
              form={form}
              name="role"
              label={t("users.form.roleLabel")}
              placeholder={t("users.form.rolePlaceholder")}
              options={roleOptions}
            />
          </CardContent>
        </Card>

        {/* Status & Permissions */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">
              {t("users.form.statusInfo") || "Status & Permissions"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <RHFSwitch
              form={form}
              name="isActive"
              label={t("users.form.activeStatusLabel")}
              description={t("users.form.activeStatusDescription")}
            />
            <RHFSwitch
              form={form}
              name="webAccess"
              label={t("users.form.webAccessLabel") || "Web Access"}
            />
            <RHFSwitch
              form={form}
              name="agreeToTerms"
              label={t("users.form.termsLabel") || "Agree to Terms"}
            />
          </CardContent>
        </Card>
      </div>

      {/* Group 4: System & Preferences (Full-width card with internal grid) */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">
            {t("users.form.systemInfo") || "System & Preferences"}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <RHFSelect
            form={form}
            name="language"
            label={t("users.form.languageLabel") || "Language"}
            placeholder={
              t("users.form.languagePlaceholder") || "Select Language"
            }
            options={LANGUAGES}
          />
          <RHFSelect
            form={form}
            name="timeZone"
            label={t("users.form.timeZoneLabel") || "Time Zone"}
            placeholder={
              t("users.form.timeZonePlaceholder") || "Select Time Zone"
            }
            options={timezoneOptions}
          />
          <RHFInput
            form={form}
            name="macAddress"
            label={t("users.form.macAddressLabel") || "MAC Address"}
            placeholder={
              t("users.form.macAddressPlaceholder") || "AA:BB:CC:DD:EE:FF"
            }
          />
          <RHFInput
            form={form}
            name="shiftStart"
            label={t("users.form.shiftStartLabel") || "Shift Start"}
            type="number"
          />
          <RHFInput
            form={form}
            name="shiftEnd"
            label={t("users.form.shiftEndLabel") || "Shift End"}
            type="number"
          />
        </CardContent>
      </Card>
    </div>
  );
}

// Hook for user form logic
export function useUserForm(editingUser?: User | null) {
  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      username: "",
      password: "",
      email: "",
      phoneNumber: null,
      countryCode: "",
      address: "",
      role: "",
      designation: "",
      restaurantIds: [],
      brandIds: [],
      isActive: true,
      agreeToTerms: true,
      shiftStart: timeStringToMinutes(DEFAULT_TIMES.START_TIME),
      shiftEnd: timeStringToMinutes(DEFAULT_TIMES.END_TIME),
      webAccess: false,
      macAddress: "",
      language: "en",
      timeZone: getDefaultTimezone(),
    },
  });

  React.useEffect(() => {
    if (editingUser) {
      form.reset({
        _id: editingUser._id,
        name: editingUser.name || "",
        username: editingUser.username,
        email: editingUser.email,
        phoneNumber: editingUser.phoneNumber || null,
        countryCode: editingUser.countryCode || null,
        address: editingUser.address || "",
        role: editingUser.role._id,
        designation: editingUser.designation || "",
        restaurantIds: editingUser.restaurantIds.map((r) => r._id),
        brandIds: editingUser.brandIds.map((b) => b._id),
        isActive: editingUser.isActive ?? true,
        agreeToTerms: editingUser.agreeToTerms ?? true,
        shiftStart: backendTimeToMinutes(editingUser.shiftStart || 0),
        shiftEnd: backendTimeToMinutes(editingUser.shiftEnd || 0),
        webAccess: editingUser.webAccess ?? false,
        macAddress: editingUser.macAddress || "",
        language: editingUser.language || "en",
        timeZone: editingUser.timeZone || getDefaultTimezone(),
      });
    }
  }, [editingUser, form]);

  return {
    form,
    isEditing: !!editingUser,
  };
}

export default UserFormContent;
