"use client";

import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  RHFInput,
  RHFTimeInput,
  RHFMultilingualInput,
  RHFSelect,
  RHFSwitch,
  RHFAddressForm,
} from "@/components/ui/form-components";
import { ImageUpload } from "@/components/ui/image-upload";
import { UploadFolderType } from "@/types/upload";
import {
  restaurantSchema,
  RestaurantFormData,
} from "@/lib/validations/restaurant.validation";
import { Restaurant } from "@/types/restaurant";
import {
  timeStringToMinutes,
  DEFAULT_TIMES,
  backendTimeToMinutes,
} from "@/lib/utils/time.utils";
import {
  getTimezoneOptions,
  getDefaultTimezone,
} from "@/lib/utils/timezone.utils";
import { useActiveBrands } from "@/services/api/brands/brands.queries";
import { useI18n } from "@/providers/i18n-provider";

interface RestaurantFormContentProps {
  form: UseFormReturn<RestaurantFormData>;
}

export function RestaurantFormContent({ form }: RestaurantFormContentProps) {
  const { t } = useTranslation();
  const { locale } = useI18n();

  // Fetch active brands from API
  const { data: brandsResponse, isLoading: isLoadingBrands } =
    useActiveBrands();

  // Transform brands into dropdown options
  const brandOptions = (brandsResponse?.data || []).map((brand) => ({
    value: brand._id,
    label: brand.name[locale] || brand.name.en,
  }));

  // Get timezone options with user's current timezone prioritized
  const timezoneOptions = getTimezoneOptions(t);

  const resetBillOptions = [
    { value: "daily", label: t("restaurants.form.resetBill.daily") },
    { value: "weekly", label: t("restaurants.form.resetBill.weekly") },
    { value: "monthly", label: t("restaurants.form.resetBill.monthly") },
    { value: "yearly", label: t("restaurants.form.resetBill.yearly") },
  ];

  const smsWhatsappOptions = [
    { value: "none", label: t("restaurants.form.smsWhatsapp.none") },
    { value: "sms", label: t("restaurants.form.smsWhatsapp.sms") },
    { value: "whatsapp", label: t("restaurants.form.smsWhatsapp.whatsapp") },
    { value: "both", label: t("restaurants.form.smsWhatsapp.both") },
  ];

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t("restaurants.form.basicInfo")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RHFMultilingualInput
              form={form}
              name="name"
              label={t("restaurants.form.restaurantNameLabel")}
              placeholder={{
                en: t("restaurants.form.restaurantNamePlaceholderEn"),
                ar: t("restaurants.form.restaurantNamePlaceholderAr"),
              }}
            />

            <RHFMultilingualInput
              form={form}
              name="description"
              label={t("restaurants.form.descriptionLabel")}
              type="textarea"
              placeholder={{
                en: t("restaurants.form.descriptionPlaceholderEn"),
                ar: t("restaurants.form.descriptionPlaceholderAr"),
              }}
            />

            <RHFSelect
              form={form}
              name="brandId"
              label={t("restaurants.form.brandLabel")}
              placeholder={
                isLoadingBrands
                  ? t("common.loading")
                  : brandOptions.length === 0
                    ? t("restaurants.form.noBrandsAvailable")
                    : t("restaurants.form.brandPlaceholder")
              }
              options={brandOptions}
              disabled={isLoadingBrands}
            />

            <ImageUpload
              form={form}
              name="logo"
              label={t("restaurants.form.logoLabel")}
              description={t("restaurants.form.logoDescription")}
              folderType={UploadFolderType.RESTAURANT}
            />

            <RHFSwitch
              form={form}
              name="isActive"
              label={t("restaurants.form.activeStatusLabel")}
              description={t("restaurants.form.activeStatusDescription")}
            />
          </CardContent>
        </Card>

        {/* System Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t("restaurants.form.systemConfig")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RHFSelect
              form={form}
              name="timezone"
              label={t("restaurants.form.timezoneLabel")}
              placeholder={t("restaurants.form.timezonePlaceholder")}
              options={timezoneOptions}
            />

            <div className="grid grid-cols-2 gap-4">
              <RHFTimeInput
                form={form}
                name="startDayTime"
                label={t("restaurants.form.startDayTimeLabel")}
                placeholder="10:00"
                description={t("restaurants.form.startDayTimeDescription")}
              />

              <RHFTimeInput
                form={form}
                name="endDayTime"
                label={t("restaurants.form.endDayTimeLabel")}
                placeholder="23:00"
                description={t("restaurants.form.endDayTimeDescription")}
              />
            </div>

            <RHFSelect
              form={form}
              name="nextResetBillFreq"
              label={t("restaurants.form.nextResetBillLabel")}
              placeholder={t("restaurants.form.nextResetBillPlaceholder")}
              options={resetBillOptions}
            />

            <RHFInput
              form={form}
              name="restoCode"
              label={t("restaurants.form.restoCodeLabel")}
              placeholder={t("restaurants.form.restoCodePlaceholder")}
              description={t("restaurants.form.restoCodeDescription")}
            />

            <RHFInput
              form={form}
              name="trnOrGstNo"
              label={t("restaurants.form.trnOrGstNoLabel")}
              placeholder={t("restaurants.form.trnOrGstNoPlaceholder")}
              description={t("restaurants.form.trnOrGstNoDescription")}
            />
          </CardContent>
        </Card>
      </div>

      {/* Address Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {t("restaurants.form.addressLabel")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RHFAddressForm
            form={form}
            name="address"
            label={t("restaurants.form.addressLabel")}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* POS Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t("restaurants.form.posSettings")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RHFSwitch
              form={form}
              name="posLogoutOnClose"
              label={t("restaurants.form.posLogoutOnCloseLabel")}
              description={t("restaurants.form.posLogoutOnCloseDescription")}
            />

            <RHFSwitch
              form={form}
              name="autoUpdatePos"
              label={t("restaurants.form.autoUpdatePosLabel")}
              description={t("restaurants.form.autoUpdatePosDescription")}
            />

            <RHFSwitch
              form={form}
              name="generateOrderTypeWiseOrderNo"
              label={t("restaurants.form.generateOrderTypeWiseOrderNoLabel")}
              description={t(
                "restaurants.form.generateOrderTypeWiseOrderNoDescription",
              )}
            />

            <RHFSwitch
              form={form}
              name="isFeedBackActive"
              label={t("restaurants.form.isFeedBackActiveLabel")}
              description={t("restaurants.form.isFeedBackActiveDescription")}
            />
          </CardContent>
        </Card>

        {/* Business Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t("restaurants.form.businessSettings")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RHFSwitch
              form={form}
              name="deductFromInventory"
              label={t("restaurants.form.deductFromInventoryLabel")}
              description={t("restaurants.form.deductFromInventoryDescription")}
            />

            <RHFSwitch
              form={form}
              name="multiplePriceSetting"
              label={t("restaurants.form.multiplePriceSettingLabel")}
              description={t(
                "restaurants.form.multiplePriceSettingDescription",
              )}
            />

            <RHFSwitch
              form={form}
              name="tableReservation"
              label={t("restaurants.form.tableReservationLabel")}
              description={t("restaurants.form.tableReservationDescription")}
            />

            <RHFSwitch
              form={form}
              name="allowMultipleTax"
              label={t("restaurants.form.allowMultipleTaxLabel")}
              description={t("restaurants.form.allowMultipleTaxDescription")}
            />
          </CardContent>
        </Card>
      </div>

      {/* Communication Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {t("restaurants.form.communicationSettings")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <RHFSelect
            form={form}
            name="smsAndWhatsappSelection"
            label={t("restaurants.form.smsAndWhatsappSelectionLabel")}
            placeholder={t(
              "restaurants.form.smsAndWhatsappSelectionPlaceholder",
            )}
            options={smsWhatsappOptions}
          />

          <RHFInput
            form={form}
            name="whatsAppChannel"
            label={t("restaurants.form.whatsAppChannelLabel")}
            placeholder={t("restaurants.form.whatsAppChannelPlaceholder")}
            description={t("restaurants.form.whatsAppChannelDescription")}
          />

          {/* Send Reports Settings */}
          <div className="space-y-3">
            <h4 className="font-medium">
              {t("restaurants.form.sendReportsLabel")}
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <RHFSwitch
                form={form}
                name="sendReports.email"
                label={t("restaurants.form.sendReports.email")}
              />
              <RHFSwitch
                form={form}
                name="sendReports.whatsapp"
                label={t("restaurants.form.sendReports.whatsapp")}
              />
              <RHFSwitch
                form={form}
                name="sendReports.sms"
                label={t("restaurants.form.sendReports.sms")}
              />
            </div>
          </div>

          {/* Payment Link Settings */}
          <div className="space-y-3">
            <h4 className="font-medium">
              {t("restaurants.form.paymentLinkSettingsLabel")}
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <RHFSwitch
                form={form}
                name="paymentLinkSettings.onWhatsapp"
                label={t("restaurants.form.paymentLinkSettings.onWhatsapp")}
              />
              <RHFSwitch
                form={form}
                name="paymentLinkSettings.onSms"
                label={t("restaurants.form.paymentLinkSettings.onSms")}
              />
            </div>
          </div>

          {/* E-Bill Settings */}
          <div className="space-y-3">
            <h4 className="font-medium">
              {t("restaurants.form.eBillSettingsLabel")}
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <RHFSwitch
                form={form}
                name="eBillSettings.onEmail"
                label={t("restaurants.form.eBillSettings.onEmail")}
              />
              <RHFSwitch
                form={form}
                name="eBillSettings.onWhatsapp"
                label={t("restaurants.form.eBillSettings.onWhatsapp")}
              />
              <RHFSwitch
                form={form}
                name="eBillSettings.onSms"
                label={t("restaurants.form.eBillSettings.onSms")}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

// Hook for restaurant form logic
export function useRestaurantForm(editingRestaurant?: Restaurant | null): {
  form: UseFormReturn<RestaurantFormData, unknown>;
  isEditing: boolean;
} {
  const form = useForm<RestaurantFormData>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: {
      name: { en: "", ar: "" },
      description: { en: "", ar: "" },
      brandId: "",
      isActive: true, // Backend default: true
      logo: "",
      address: {
        addressLine1: "",
        addressLine2: "",
        city: "",
        location: "",
        state: "",
        country: "",
        pincode: "",
      },
      timezone: getDefaultTimezone(), // Auto-detect user's timezone
      startDayTime: timeStringToMinutes(DEFAULT_TIMES.START_TIME), // 10:00 -> 600 minutes
      endDayTime: timeStringToMinutes(DEFAULT_TIMES.END_TIME), // 23:00 -> 1380 minutes
      nextResetBillFreq: "daily",
      notificationPhone: [],
      notificationEmails: [],
      restoCode: "",
      posLogoutOnClose: true, // Backend default: true
      isFeedBackActive: false, // Backend default: false
      trnOrGstNo: "",
      customQRcode: [],
      inventoryWarehouse: "",
      deductFromInventory: true, // Backend default: true
      multiplePriceSetting: false, // Backend default: false
      tableReservation: false, // Backend default: false
      autoUpdatePos: true, // Backend default: true
      allowMultipleTax: false, // Backend default: false
      generateOrderTypeWiseOrderNo: false, // Backend default: false
      smsAndWhatsappSelection: "none", // Backend default: NONE
      whatsAppChannel: "",
      sendReports: {
        email: false, // Backend default: false
        whatsapp: false, // Backend default: false
        sms: false, // Backend default: false
      },
      paymentLinkSettings: {
        onWhatsapp: false, // Backend default: false
        onSms: false, // Backend default: false
      },
      eBillSettings: {
        onEmail: false, // Backend default: false
        onWhatsapp: false, // Backend default: false
        onSms: false, // Backend default: false
      },
    },
  });

  // Reset form when editing restaurant changes
  React.useEffect(() => {
    if (editingRestaurant) {
      const resetBillFreq =
        editingRestaurant.nextResetBillFreq === "daily" ||
        editingRestaurant.nextResetBillFreq === "weekly" ||
        editingRestaurant.nextResetBillFreq === "monthly" ||
        editingRestaurant.nextResetBillFreq === "yearly"
          ? editingRestaurant.nextResetBillFreq
          : "daily";

      form.reset({
        _id: editingRestaurant._id,
        name: editingRestaurant.name,
        description: editingRestaurant.description,
        brandId: editingRestaurant.brandId,
        isActive: editingRestaurant.isActive ?? true,
        logo: editingRestaurant.logo || "",
        address: editingRestaurant.address,
        timezone: editingRestaurant.timezone,
        startDayTime: backendTimeToMinutes(editingRestaurant.startDayTime),
        endDayTime: backendTimeToMinutes(editingRestaurant.endDayTime),
        nextResetBillFreq: resetBillFreq,
        notificationPhone: editingRestaurant.notificationPhone || [],
        notificationEmails: editingRestaurant.notificationEmails || [],
        restoCode: editingRestaurant.restoCode || "",
        posLogoutOnClose: editingRestaurant.posLogoutOnClose ?? true,
        isFeedBackActive: editingRestaurant.isFeedBackActive ?? false,
        trnOrGstNo: editingRestaurant.trnOrGstNo || "",
        customQRcode: editingRestaurant.customQRcode || [],
        deductFromInventory: editingRestaurant.deductFromInventory ?? true,
        multiplePriceSetting: editingRestaurant.multiplePriceSetting ?? false,
        tableReservation: editingRestaurant.tableReservation ?? false,
        autoUpdatePos: editingRestaurant.autoUpdatePos ?? true,
        sendReports: editingRestaurant.sendReports || {
          email: false,
          whatsapp: false,
          sms: false,
        },
        allowMultipleTax: editingRestaurant.allowMultipleTax ?? false,
        generateOrderTypeWiseOrderNo:
          editingRestaurant.generateOrderTypeWiseOrderNo ?? false,
        smsAndWhatsappSelection:
          editingRestaurant.smsAndWhatsappSelection || "none",
        whatsAppChannel: editingRestaurant.whatsAppChannel || "",
        paymentLinkSettings: editingRestaurant.paymentLinkSettings || {
          onWhatsapp: false,
          onSms: false,
        },
        eBillSettings: editingRestaurant.eBillSettings || {
          onEmail: false,
          onWhatsapp: false,
          onSms: false,
        },
      });
    } else {
      form.reset({
        name: { en: "", ar: "" },
        description: { en: "", ar: "" },
        brandId: "",
        isActive: true,
        logo: "",
        address: {
          addressLine1: "",
          addressLine2: "",
          city: "",
          location: "",
          state: "",
          country: "",
          pincode: "",
        },
        timezone: getDefaultTimezone(),
        startDayTime: timeStringToMinutes(DEFAULT_TIMES.START_TIME),
        endDayTime: timeStringToMinutes(DEFAULT_TIMES.END_TIME),
        nextResetBillFreq: "daily",
        notificationPhone: [],
        notificationEmails: [],
        restoCode: "",
        posLogoutOnClose: true,
        isFeedBackActive: false,
        trnOrGstNo: "",
        customQRcode: [],
        inventoryWarehouse: "",
        deductFromInventory: true,
        multiplePriceSetting: false,
        tableReservation: false,
        autoUpdatePos: true,
        sendReports: {
          email: false,
          whatsapp: false,
          sms: false,
        },
        allowMultipleTax: false,
        generateOrderTypeWiseOrderNo: false,
        smsAndWhatsappSelection: "none",
        whatsAppChannel: "",
        paymentLinkSettings: {
          onWhatsapp: false,
          onSms: false,
        },
        eBillSettings: {
          onEmail: false,
          onWhatsapp: false,
          onSms: false,
        },
      });
    }
  }, [editingRestaurant, form]);

  return {
    form,
    isEditing: !!editingRestaurant,
  };
}

export default RestaurantFormContent;
