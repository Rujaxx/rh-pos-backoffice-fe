"use client"

import React from "react"
import { useTranslation } from "@/hooks/useTranslation"
import { useForm, UseFormReturn } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  RHFInput,
  RHFMultilingualInput,
  RHFSwitch,
  RHFAddressForm,
  RHFSelect,
  RHFFileUpload,
} from "@/components/ui/form-components"
import { restaurantSchema, RestaurantFormData } from "@/lib/validations/restaurant.validation"
import { Restaurant } from "@/types/restaurant"

interface RestaurantFormContentProps {
  form: UseFormReturn<RestaurantFormData>
}

export function RestaurantFormContent({ form }: RestaurantFormContentProps) {
  const { t } = useTranslation()


  const brandOptions = [
    { value: "1", label: t("restaurants.form.brands.pizzaPalace") },
    { value: "2", label: t("restaurants.form.brands.burgerHouse") }
  ]

  const timezoneOptions = [
    { value: "UTC", label: t("restaurants.form.timezon.utc") },
    { value: "America/New_York", label: t("restaurants.form.timezon.eastern") },
    { value: "America/Chicago", label: t("restaurants.form.timezon.central") },
    { value: "America/Denver", label: t("restaurants.form.timezon.mountain") },
    { value: "America/Los_Angeles", label: t("restaurants.form.timezon.pacific") },
    { value: "Asia/Dubai", label: t("restaurants.form.timezon.dubai") },
    { value: "Asia/Riyadh", label: t("restaurants.form.timezon.saudiArabia") },
  ]

  const resetBillOptions = [
    { value: "daily", label: t('restaurants.form.resetBill.daily') },
    { value: "weekly", label: t('restaurants.form.resetBill.weekly') },
    { value: "monthly", label: t('restaurants.form.resetBill.monthly') },
    { value: "yearly", label: t('restaurants.form.resetBill.yearly') },
  ]

  const smsWhatsappOptions = [
    { value: "none", label: t('restaurants.form.smsWhatsapp.none') },
    { value: "sms", label: t('restaurants.form.smsWhatsapp.sms') },
    { value: "whatsapp", label: t('restaurants.form.smsWhatsapp.whatsapp') },
    { value: "both", label: t('restaurants.form.smsWhatsapp.both') },
  ]

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t('restaurants.form.basicInfo')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RHFMultilingualInput
              form={form}
              name="name"
              label={t('restaurants.form.restaurantNameLabel')}
              placeholder={{
                en: t('restaurants.form.restaurantNamePlaceholderEn'),
                ar: t('restaurants.form.restaurantNamePlaceholderAr')
              }}
            />

            <RHFMultilingualInput
              form={form}
              name="description"
              label={t('restaurants.form.descriptionLabel')}
              type="textarea"
              placeholder={{
                en: t('restaurants.form.descriptionPlaceholderEn'),
                ar: t('restaurants.form.descriptionPlaceholderAr')
              }}
            />

            <RHFSelect
              form={form}
              name="brandId"
              label={t('restaurants.form.brandLabel')}
              placeholder={t('restaurants.form.brandPlaceholder')}
              options={brandOptions}
            />

            <RHFFileUpload
              form={form}
              name="logo"
              label={t('restaurants.form.logoLabel')}
              accept="image/*"
              description={t('restaurants.form.logoDescription')}
            />

            <RHFSwitch
              form={form}
              name="isActive"
              label={t('restaurants.form.activeStatusLabel')}
              description={t('restaurants.form.activeStatusDescription')}
            />
          </CardContent>
        </Card>

        {/* System Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t('restaurants.form.systemConfig')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RHFSelect
              form={form}
              name="timezone"
              label={t('restaurants.form.timezoneLabel')}
              placeholder={t('restaurants.form.timezonePlaceholder')}
              options={timezoneOptions}
            />

            <div className="grid grid-cols-2 gap-4">
              <RHFInput
                form={form}
                name="startDayTime"
                label={t('restaurants.form.startDayTimeLabel')}
                placeholder="9"
                type="number"
                min="0"
                max="23"
                description={t('restaurants.form.startDayTimeDescription')}
              />

              <RHFInput
                form={form}
                name="endDayTime"
                label={t('restaurants.form.endDayTimeLabel')}
                placeholder="23"
                type="number"
                min="0"
                max="23"
                description={t('restaurants.form.endDayTimeDescription')}
              />
            </div>

            <RHFSelect
              form={form}
              name="nextResetBillFreq"
              label={t('restaurants.form.nextResetBillLabel')}
              placeholder={t('restaurants.form.nextResetBillPlaceholder')}
              options={resetBillOptions}
            />

            <RHFInput
              form={form}
              name="nextResetBillDate"
              label={t('restaurants.form.resetBillDateLabel')}
              disabled
            />


            <RHFInput
              form={form}
              name="restoCode"
              label={t('restaurants.form.restoCodeLabel')}
              placeholder={t('restaurants.form.restoCodePlaceholder')}
              description={t('restaurants.form.restoCodeDescription')}
            />

            <RHFInput
              form={form}
              name="trnOrGstNo"
              label={t('restaurants.form.trnOrGstNoLabel')}
              placeholder={t('restaurants.form.trnOrGstNoPlaceholder')}
              description={t('restaurants.form.trnOrGstNoDescription')}
            />
          </CardContent>
        </Card>
      </div>

      {/* Address Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {t('restaurants.form.addressLabel')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RHFAddressForm
            form={form}
            name="address"
            label={t('restaurants.form.addressLabel')}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* POS Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t('restaurants.form.posSettings')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RHFSwitch
              form={form}
              name="posLogoutOnClose"
              label={t('restaurants.form.posLogoutOnCloseLabel')}
              description={t('restaurants.form.posLogoutOnCloseDescription')}
            />

            <RHFSwitch
              form={form}
              name="autoUpdatePos"
              label={t('restaurants.form.autoUpdatePosLabel')}
              description={t('restaurants.form.autoUpdatePosDescription')}
            />

            <RHFSwitch
              form={form}
              name="generateOrderTypeWiseOrderNo"
              label={t('restaurants.form.generateOrderTypeWiseOrderNoLabel')}
              description={t('restaurants.form.generateOrderTypeWiseOrderNoDescription')}
            />

            <RHFSwitch
              form={form}
              name="isFeedBackActive"
              label={t('restaurants.form.isFeedBackActiveLabel')}
              description={t('restaurants.form.isFeedBackActiveDescription')}
            />
          </CardContent>
        </Card>

        {/* Business Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t('restaurants.form.businessSettings')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RHFSwitch
              form={form}
              name="deductFromInventory"
              label={t('restaurants.form.deductFromInventoryLabel')}
              description={t('restaurants.form.deductFromInventoryDescription')}
            />

            <RHFSwitch
              form={form}
              name="multiplePriceSetting"
              label={t('restaurants.form.multiplePriceSettingLabel')}
              description={t('restaurants.form.multiplePriceSettingDescription')}
            />

            <RHFSwitch
              form={form}
              name="tableReservation"
              label={t('restaurants.form.tableReservationLabel')}
              description={t('restaurants.form.tableReservationDescription')}
            />

            <RHFSwitch
              form={form}
              name="allowMultipleTax"
              label={t('restaurants.form.allowMultipleTaxLabel')}
              description={t('restaurants.form.allowMultipleTaxDescription')}
            />
          </CardContent>
        </Card>
      </div>

      {/* Communication Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {t('restaurants.form.communicationSettings')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <RHFSelect
            form={form}
            name="smsAndWhatsappSelection"
            label={t('restaurants.form.smsAndWhatsappSelectionLabel')}
            placeholder={t('restaurants.form.smsAndWhatsappSelectionPlaceholder')}
            options={smsWhatsappOptions}
          />

          <RHFInput
            form={form}
            name="whatsAppChannel"
            label={t('restaurants.form.whatsAppChannelLabel')}
            placeholder={t('restaurants.form.whatsAppChannelPlaceholder')}
            description={t('restaurants.form.whatsAppChannelDescription')}
          />

          {/* Send Reports Settings */}
          <div className="space-y-3">
            <h4 className="font-medium">{t('restaurants.form.sendReportsLabel')}</h4>
            <div className="grid grid-cols-3 gap-4">
              <RHFSwitch
                form={form}
                name="sendReports.email"
                label={t('restaurants.form.sendReports.email')}
              />
              <RHFSwitch
                form={form}
                name="sendReports.whatsapp"
                label={t('restaurants.form.sendReports.whatsapp')}
              />
              <RHFSwitch
                form={form}
                name="sendReports.sms"
                label={t('restaurants.form.sendReports.sms')}
              />
            </div>
          </div>

          {/* Payment Link Settings */}
          <div className="space-y-3">
            <h4 className="font-medium">{t('restaurants.form.paymentLinkSettingsLabel')}</h4>
            <div className="grid grid-cols-2 gap-4">
              <RHFSwitch
                form={form}
                name="paymentLinkSettings.onWhatsapp"
                label={t('restaurants.form.paymentLinkSettings.onWhatsapp')}
              />
              <RHFSwitch
                form={form}
                name="paymentLinkSettings.onSms"
                label={t('restaurants.form.paymentLinkSettings.onSms')}
              />
            </div>
          </div>

          {/* E-Bill Settings */}
          <div className="space-y-3">
            <h4 className="font-medium">{t('restaurants.form.eBillSettingsLabel')}</h4>
            <div className="grid grid-cols-3 gap-4">
              <RHFSwitch
                form={form}
                name="eBillSettings.onEmail"
                label={t('restaurants.form.eBillSettings.onEmail')}
              />
              <RHFSwitch
                form={form}
                name="eBillSettings.onWhatsapp"
                label={t('restaurants.form.eBillSettings.onWhatsapp')}
              />
              <RHFSwitch
                form={form}
                name="eBillSettings.onSms"
                label={t('restaurants.form.eBillSettings.onSms')}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

// Hook for restaurant form logic
export function useRestaurantForm(editingRestaurant?: Restaurant | null) {
  const form = useForm<RestaurantFormData>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: {
      name: { en: "", ar: "" },
      description: { en: "", ar: "" },
      brandId: "",
      isActive: true,
      logo: "",
      address: {
        street: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
        latitude: undefined,
        longitude: undefined,
      },
      timezone: "",
      startDayTime: 9,
      endDayTime: 23,
      nextResetBillFreq: "daily",
      nextResetBillDate: "",
      notificationPhone: [],
      notificationEmails: [],
      restoCode: "",
      posLogoutOnClose: false,
      isFeedBackActive: false,
      trnOrGstNo: "",
      customQRcode: [],
      deductFromInventory: false,
      multiplePriceSetting: false,
      tableReservation: false,
      autoUpdatePos: false,
      sendReports: {
        email: false,
        whatsapp: false,
        sms: false,
      },
      allowMultipleTax: false,
      generateOrderTypeWiseOrderNo: false,
      smsAndWhatsappSelection: "both",
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
    },
  })

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
        name: editingRestaurant.name,
        description: editingRestaurant.description,
        brandId: editingRestaurant.brandId,
        isActive: editingRestaurant.isActive ?? true,
        logo: editingRestaurant.logo || "",
        address: editingRestaurant.address,
        timezone: editingRestaurant.timezone,
        startDayTime: editingRestaurant.startDayTime,
        endDayTime: editingRestaurant.endDayTime,
        nextResetBillFreq: resetBillFreq,
        nextResetBillDate: editingRestaurant.nextResetBillDate,
        notificationPhone: editingRestaurant.notificationPhone || [],
        notificationEmails: editingRestaurant.notificationEmails || [],
        restoCode: editingRestaurant.restoCode || "",
        posLogoutOnClose: editingRestaurant.posLogoutOnClose,
        isFeedBackActive: editingRestaurant.isFeedBackActive,
        trnOrGstNo: editingRestaurant.trnOrGstNo || "",
        customQRcode: editingRestaurant.customQRcode || [],
        deductFromInventory: editingRestaurant.deductFromInventory,
        multiplePriceSetting: editingRestaurant.multiplePriceSetting,
        tableReservation: editingRestaurant.tableReservation,
        autoUpdatePos: editingRestaurant.autoUpdatePos,
        sendReports: editingRestaurant.sendReports,
        allowMultipleTax: editingRestaurant.allowMultipleTax,
        generateOrderTypeWiseOrderNo: editingRestaurant.generateOrderTypeWiseOrderNo,
        smsAndWhatsappSelection: editingRestaurant.smsAndWhatsappSelection,
        whatsAppChannel: editingRestaurant.whatsAppChannel || "",
        paymentLinkSettings: editingRestaurant.paymentLinkSettings,
        eBillSettings: editingRestaurant.eBillSettings,
      })
    } else {
      form.reset({
        name: { en: "", ar: "" },
        description: { en: "", ar: "" },
        brandId: "",
        isActive: true,
        logo: "",
        address: {
          street: "",
          city: "",
          state: "",
          country: "",
          zipCode: "",
          latitude: undefined,
          longitude: undefined,
        },
        timezone: "",
        startDayTime: 9,
        endDayTime: 23,
        nextResetBillFreq: "daily",
        nextResetBillDate: "",
        notificationPhone: [],
        notificationEmails: [],
        restoCode: "",
        posLogoutOnClose: false,
        isFeedBackActive: false,
        trnOrGstNo: "",
        customQRcode: [],
        deductFromInventory: false,
        multiplePriceSetting: false,
        tableReservation: false,
        autoUpdatePos: false,
        sendReports: {
          email: false,
          whatsapp: false,
          sms: false,
        },
        allowMultipleTax: false,
        generateOrderTypeWiseOrderNo: false,
        smsAndWhatsappSelection: "both",
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
      })
    }
  }, [editingRestaurant, form])

  return {
    form,
    isEditing: !!editingRestaurant,
  }
}

export default RestaurantFormContent