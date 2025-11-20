"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  RHFInput,
  RHFSelect,
  RHFSwitch,
  RHFMultilingualInput,
} from "@/components/ui/form-components";
import { useTranslation } from "@/hooks/useTranslation";
import { menuSchema, MenuFormData } from "@/lib/validations/menu.validation";
import { Menu } from "@/types/menu.type";
import { useActiveBrands } from "@/services/api/brands/brands.queries";
import { useI18n } from "@/providers/i18n-provider";
import { useActiveRestaurants } from "@/services/api/restaurants/restaurants.queries";

interface MenuFormContentProps {
  form: ReturnType<typeof useForm<MenuFormData>>;
}

export function MenuFormContent({ form }: MenuFormContentProps) {
  const { t } = useTranslation();
  const { locale } = useI18n();

  const { data: brandsResponse, isLoading: isLoadingBrands } =
    useActiveBrands();

  // Fetch active restaurants from API
  const { data: restaurantsResponse, isLoading: isLoadingRestaurants } =
    useActiveRestaurants();

  // Transform brands into dropdown options
  const brandOptions = (brandsResponse?.data || []).map((brand) => ({
    value: brand._id,
    label: brand.name[locale] || brand.name.en,
  }));

  // Transform restaurants into dropdown options
  const restaurantOptions = (restaurantsResponse?.data || []).map(
    (restaurant) => ({
      value: restaurant._id,
      label: restaurant.name[locale] || restaurant.name.en,
    })
  );

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t("menus.form.basicInfo")}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Multilingual Name */}
            <RHFMultilingualInput
              form={form}
              name="name"
              label={t("menus.form.nameLabel")}
              placeholder={{
                en: t("menus.form.nameEnPlaceholder"),
                ar: t("menus.form.nameArPlaceholder"),
              }}
            />

            {/* Short Code */}
            <RHFInput
              form={form}
              name="shortCode"
              label={t("menus.form.shortCode")}
              placeholder={t("menus.form.shortCodePlaceholder")}
            />

            {/* Short Name */}
            <RHFInput
              form={form}
              name="shortName"
              label={t("menus.form.shortName")}
              placeholder={t("menus.form.shortNamePlaceholder")}
            />

            {/* Brand */}
            <RHFSelect
              form={form}
              name="brandId"
              label={t("categories.form.brandLabel")}
              placeholder={
                isLoadingBrands
                  ? t("common.loading")
                  : brandOptions.length === 0
                    ? t("common.noBrandsAvailable")
                    : t("common.brandPlaceholder")
              }
              options={brandOptions}
            />

            {/* Status */}
            <RHFSwitch
              form={form}
              name="isActive"
              label={t("menus.form.activeStatusLabel")}
              description={t("menus.form.activeStatusDescription")}
            />
          </CardContent>
        </Card>

        {/* Additional Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t("menus.form.additionalSettings")}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Restaurant */}
            <RHFSelect
              form={form}
              name="restaurantId"
              label={t("categories.form.restaurantLabel")}
              placeholder={
                isLoadingRestaurants
                  ? t("common.loading")
                  : brandOptions.length === 0
                    ? t("categories.form.noRestaurantsAvailable")
                    : t("categories.form.restaurantPlaceholder")
              }
              options={restaurantOptions}
            />

            {/* POS Default */}
            <RHFSwitch
              form={form}
              name="isPosDefault"
              label={t("menus.form.posDefaultLabel")}
              description={t("menus.form.posDefaultDescription")}
            />

            {/* Digital Default */}
            <RHFSwitch
              form={form}
              name="isDigitalDefault"
              label={t("menus.form.digitalDefaultLabel")}
              description={t("menus.form.digitalDefaultDescription")}
            />

            {/* Digital Menu */}
            <RHFSwitch
              form={form}
              name="isDigitalMenu"
              label={t("menus.form.digitalMenuLabel")}
              description={t("menus.form.digitalMenuDescription")}
            />

            {/* Mobile App */}
            <RHFSwitch
              form={form}
              name="isMobileApp"
              label={t("menus.form.mobileAppLabel")}
              description={t("menus.form.mobileAppDescription")}
            />

            {/* ONDC */}
            <RHFSwitch
              form={form}
              name="isONDC"
              label={t("menus.form.ondcLabel")}
              description={t("menus.form.ondcDescription")}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

// Hook for menu form logic
export function useMenuForm(editingMenu?: Menu | null) {
  const form = useForm<MenuFormData>({
    resolver: zodResolver(menuSchema),
    defaultValues: {
      name: { en: "", ar: "" },
      shortCode: "",
      shortName: "",
      isActive: true,
      isPosDefault: false,
      isDigitalDefault: false,
      isDigitalMenu: false,
      isMobileApp: false,
      isONDC: false,
      brandId: "",
      restaurantId: "",
    },
  });

  React.useEffect(() => {
    if (editingMenu) {
      form.reset({
        _id: editingMenu._id,
        name: editingMenu.name,
        shortCode: editingMenu.shortCode,
        shortName: editingMenu.shortName,
        isActive: editingMenu.isActive,
        isPosDefault: editingMenu.isPosDefault,
        isDigitalDefault: editingMenu.isDigitalDefault,
        isDigitalMenu: editingMenu.isDigitalMenu,
        isMobileApp: editingMenu.isMobileApp,
        isONDC: editingMenu.isONDC,
        brandId: editingMenu.brandId,
        restaurantId: editingMenu.restaurantId,
      });
    } else {
      form.reset({
        name: { en: "", ar: "" },
        shortCode: "",
        shortName: "",
        isActive: true,
        isPosDefault: false,
        isDigitalDefault: false,
        isDigitalMenu: false,
        isMobileApp: false,
        isONDC: false,
        brandId: "",
        restaurantId: "",
      });
    }
  }, [editingMenu, form]);

  return {
    form,
    isEditing: !!editingMenu,
  };
}

export default MenuFormContent;
