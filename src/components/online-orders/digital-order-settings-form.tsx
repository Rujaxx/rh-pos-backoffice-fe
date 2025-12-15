'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  RHFInput,
  RHFSelect,
  RHFSwitch,
} from '@/components/ui/form-components';
import {
  restaurantSchema,
  RestaurantFormData,
} from '@/lib/validations/restaurant.validation';
import {
  DigitalOrdersNotificationChannel,
  Restaurant,
  DigitalOrderSettings,
  PaymentGatewayConfiguration,
} from '@/types/restaurant';
import {
  backendTimeToMinutes,
  timeStringToMinutes,
  DEFAULT_TIMES,
} from '@/lib/utils/time.utils';
import { getDefaultTimezone } from '@/lib/utils/timezone.utils';
import { COUNTRY_CODES } from '@/mock/dropdown-constants';

interface DigitalOrderSettingsFormContentProps {
  form: UseFormReturn<RestaurantFormData>;
  editingRestaurant?: Restaurant | null;
}

export function DigitalOrderSettingsFormContent({
  form,
  editingRestaurant,
}: DigitalOrderSettingsFormContentProps) {
  const { t } = useTranslation();

  // DEBUG: Log form errors
  React.useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      console.error('DigitalOrderSettingsForm Errors:', form.formState.errors);
    }
  }, [form.formState.errors]);

  const notificationChannels = [
    {
      value: DigitalOrdersNotificationChannel.ALL,
      label: t('digitalOrders.notification.all'),
    },
    {
      value: DigitalOrdersNotificationChannel.SMS,
      label: t('digitalOrders.notification.sms'),
    },
    {
      value: DigitalOrdersNotificationChannel.WHATSAPP,
      label: t('digitalOrders.notification.whatsapp'),
    },
  ];

  const otpMethods = [
    { value: 'SMS', label: 'SMS' },
    { value: 'WhatsApp', label: 'WhatsApp' },
  ];

  const languages = [
    { value: 'en', label: t('digitalOrders.language.en') },
    { value: 'ar', label: t('digitalOrders.language.ar') },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-muted/30 p-4 rounded-lg border mb-4">
        <h3 className="font-semibold text-lg flex items-center">
          {editingRestaurant?.name?.en}
          {editingRestaurant?.restoCode && (
            <span className="ml-2 text-sm text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
              {editingRestaurant.restoCode}
            </span>
          )}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t('digitalOrders.outletConfigDescription')}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('digitalOrders.globalIdentityBehavior')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RHFSwitch
            form={form}
            name="digitalOrderSettings.isDigitalOrderingEnabled"
            label={t('digitalOrders.enableDigitalOrdering')}
            description={t('digitalOrders.enableDigitalOrderingDesc')}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RHFSelect
              form={form}
              name="digitalOrderSettings.sendDigitalOrdersNotificationOn"
              label={t('digitalOrders.sendNotificationsOn')}
              options={notificationChannels}
            />
            <RHFSelect
              form={form}
              name="digitalOrderSettings.language"
              label={t('digitalOrders.defaultLanguage')}
              options={languages}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RHFInput
              form={form}
              name="digitalOrderSettings.whatsAppNumber"
              label={t('digitalOrders.whatsappNumber')}
              placeholder="919876543210"
            />
            <RHFSwitch
              form={form}
              name="digitalOrderSettings.reduceInventoryForDigitalOrderPlatform"
              label={t('digitalOrders.reduceInventory')}
              description={t('digitalOrders.reduceInventoryDesc')}
            />
          </div>

          <RHFInput
            form={form}
            name="digitalOrderSettings.customizedMessageForWhatsapp"
            label={t('digitalOrders.whatsappMessageBody')}
            placeholder={t('digitalOrders.whatsappMessagePlaceholder')}
            description={t('digitalOrders.whatsappMessageDesc')}
          />

          <RHFSwitch
            form={form}
            name="digitalOrderSettings.showCategoryFirst"
            label={t('digitalOrders.showCategoryFirst')}
            description={t('digitalOrders.showCategoryFirstDesc')}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('digitalOrders.displayOptions')}</CardTitle>
          <CardDescription>
            {t('digitalOrders.displayOptionsDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RHFSwitch
              form={form}
              name="digitalOrderSettings.showDescriptionOnDigitalPlatform"
              label={t('digitalOrders.showItemDescription')}
            />
            <RHFSwitch
              form={form}
              name="digitalOrderSettings.showPreparationTimeOnDigitalPlatform"
              label={t('digitalOrders.showPreparationTime')}
            />
            <RHFSwitch
              form={form}
              name="digitalOrderSettings.showNutritionInfo"
              label={t('digitalOrders.showNutritionInfo')}
            />
            <RHFSwitch
              form={form}
              name="digitalOrderSettings.enableForCategorySortingOnDigitalPlatform"
              label={t('digitalOrders.enableCategorySorting')}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <RHFSwitch
              form={form}
              name="digitalOrderSettings.showGridViewOnDigitalPlatform"
              label={t('digitalOrders.defaultGridView')}
            />
            <RHFSwitch
              form={form}
              name="digitalOrderSettings.showListViewOnDigitalPlatform"
              label={t('digitalOrders.enableListViewToggle')}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('digitalOrders.orderTypeAvailability')}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <RHFSwitch
            form={form}
            name="digitalOrderSettings.enableForDelivery"
            label={t('digitalOrders.enableDelivery')}
          />
          <RHFSwitch
            form={form}
            name="digitalOrderSettings.enableForPickup"
            label={t('digitalOrders.enablePickup')}
          />
          <RHFSwitch
            form={form}
            name="digitalOrderSettings.enableForDineIn"
            label={t('digitalOrders.enableDineIn')}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('digitalOrders.orderWorkflow')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RHFSwitch
              form={form}
              name="digitalOrderSettings.autoAcceptOrder"
              label={t('digitalOrders.autoAcceptOrders')}
            />
            <RHFSwitch
              form={form}
              name="digitalOrderSettings.autoAcceptOrderOnCashPayment"
              label={t('digitalOrders.autoAcceptCashOrders')}
            />
            <RHFSwitch
              form={form}
              name="digitalOrderSettings.autoCompleteOrderAfterAccept"
              label={t('digitalOrders.autoCompleteAfterAccept')}
            />
            <RHFSwitch
              form={form}
              name="digitalOrderSettings.askForOrderTypeBeforePlacingOrder"
              label={t('digitalOrders.askOrderTypeFirst')}
            />
            <RHFSwitch
              form={form}
              name="digitalOrderSettings.sendEbillAfterComplete"
              label={t('digitalOrders.sendEBillOnCompletion')}
            />
          </div>

          <div className="border-t pt-4 mt-4">
            <h4 className="mb-3 text-sm font-medium">
              {t('digitalOrders.otpVerification')}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RHFSelect
                form={form}
                name="digitalOrderSettings.sendOtpVia"
                label={t('digitalOrders.sendOtpVia')}
                options={otpMethods}
              />
              <RHFSwitch
                form={form}
                name="digitalOrderSettings.skipOtpVerification"
                label={t('digitalOrders.skipOtpVerification')}
                description={t('digitalOrders.skipOtpVerificationDesc')}
              />
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <h4 className="mb-3 text-sm font-medium">
              {t('digitalOrders.dineInConfiguration')}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RHFInput
                form={form}
                name="digitalOrderSettings.dineInTitle"
                label={t('digitalOrders.dineInTitlePrefix')}
                placeholder={t('digitalOrders.exampleTable')}
              />
              <RHFInput
                form={form}
                name="digitalOrderSettings.dineInTitlePlaceholder"
                label={t('digitalOrders.inputPlaceholder')}
                placeholder={t('digitalOrders.exampleEnterTableNo')}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('digitalOrders.paymentConfiguration')}</CardTitle>
          <CardDescription>
            {t('digitalOrders.paymentConfigurationDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="p-4 border rounded bg-muted/20">
              <h4 className="font-medium mb-4">
                {t('digitalOrders.dineInPaymentSettings')}
              </h4>
              <p className="text-xs text-muted-foreground mb-4">
                {t('digitalOrders.dineInPaymentSettingsDescription2')}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <RHFSwitch
                  form={form}
                  name="digitalOrderSettings.paymentSettingsForDineIn.cash"
                  label={t('digitalOrders.paymentMethods.cash')}
                />
                <RHFSwitch
                  form={form}
                  name="digitalOrderSettings.paymentSettingsForDineIn.cod"
                  label={t('digitalOrders.paymentMethods.cod')}
                />
                <RHFSwitch
                  form={form}
                  name="digitalOrderSettings.paymentSettingsForDineIn.payLater"
                  label={t('digitalOrders.paymentMethods.payLater')}
                />
                <RHFSwitch
                  form={form}
                  name="digitalOrderSettings.paymentSettingsForDineIn.razorPay"
                  label={t('digitalOrders.paymentMethods.razorPay')}
                />
                <RHFSwitch
                  form={form}
                  name="digitalOrderSettings.paymentSettingsForDineIn.upi"
                  label={t('digitalOrders.paymentMethods.upi')}
                />
              </div>
            </div>

            <div className="p-4 border rounded bg-muted/20">
              <h4 className="font-medium mb-4">
                {t('digitalOrders.pickupPaymentSettings')}
              </h4>
              <p className="text-xs text-muted-foreground mb-4">
                {t('digitalOrders.pickupPaymentSettingsDescription')}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <RHFSwitch
                  form={form}
                  name="digitalOrderSettings.paymentSettingsForPickUp.cash"
                  label={t('digitalOrders.paymentMethods.cash')}
                />
                <RHFSwitch
                  form={form}
                  name="digitalOrderSettings.paymentSettingsForPickUp.cod"
                  label={t('digitalOrders.paymentMethods.cod')}
                />
                <RHFSwitch
                  form={form}
                  name="digitalOrderSettings.paymentSettingsForPickUp.payLater"
                  label={t('digitalOrders.paymentMethods.payLater')}
                />
                <RHFSwitch
                  form={form}
                  name="digitalOrderSettings.paymentSettingsForPickUp.razorPay"
                  label={t('digitalOrders.paymentMethods.razorPay')}
                />
                <RHFSwitch
                  form={form}
                  name="digitalOrderSettings.paymentSettingsForPickUp.upi"
                  label={t('digitalOrders.paymentMethods.upi')}
                />
              </div>
            </div>

            <div className="p-4 border rounded bg-muted/20">
              <h4 className="font-medium mb-4">
                {t('digitalOrders.deliveryPaymentSettings')}
              </h4>
              <p className="text-xs text-muted-foreground mb-4">
                {t('digitalOrders.deliveryPaymentSettingsDescription')}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <RHFSwitch
                  form={form}
                  name="digitalOrderSettings.paymentSettingsForDelivery.cash"
                  label={t('digitalOrders.paymentMethods.cash')}
                />
                <RHFSwitch
                  form={form}
                  name="digitalOrderSettings.paymentSettingsForDelivery.cod"
                  label={t('digitalOrders.paymentMethods.cod')}
                />
                <RHFSwitch
                  form={form}
                  name="digitalOrderSettings.paymentSettingsForDelivery.payLater"
                  label={t('digitalOrders.paymentMethods.payLater')}
                />
                <RHFSwitch
                  form={form}
                  name="digitalOrderSettings.paymentSettingsForDelivery.razorPay"
                  label={t('digitalOrders.paymentMethods.razorPay')}
                />
                <RHFSwitch
                  form={form}
                  name="digitalOrderSettings.paymentSettingsForDelivery.upi"
                  label={t('digitalOrders.paymentMethods.upi')}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('digitalOrders.socialLinksContact')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-end">
            <RHFSwitch
              form={form}
              name="digitalOrderSettings.showContactNo"
              label=""
              className="mb-2"
            />
            <div className="flex-1">
              <RHFInput
                form={form}
                name="digitalOrderSettings.contactNo"
                label={t('digitalOrders.contactNumber')}
                placeholder={t('digitalOrders.displayContactNumber')}
              />
            </div>
          </div>

          <div className="flex gap-4 items-end">
            <RHFSwitch
              form={form}
              name="digitalOrderSettings.showWhatsappLinkOnDigitalPlatform"
              label=""
              className="mb-2"
            />

            <div className="flex-1">
              <RHFInput
                form={form}
                name="digitalOrderSettings.whatsappLink"
                label={t('digitalOrders.showWhatsappLink')}
                placeholder="https://wa.me/..."
              />
            </div>
          </div>

          <div className="flex gap-4 items-end">
            <RHFSwitch
              form={form}
              name="digitalOrderSettings.showFacebookLink"
              label=""
              className="mb-2"
            />
            <div className="flex-1">
              <RHFInput
                form={form}
                name="digitalOrderSettings.facebookLink"
                label={t('digitalOrders.facebookUrl')}
                placeholder="https://facebook.com/..."
              />
            </div>
          </div>

          <div className="flex gap-4 items-end">
            <RHFSwitch
              form={form}
              name="digitalOrderSettings.showInstagramLink"
              label=""
              className="mb-2"
            />
            <div className="flex-1">
              <RHFInput
                form={form}
                name="digitalOrderSettings.instagramLink"
                label={t('digitalOrders.instagramUrl')}
                placeholder="https://instagram.com/..."
              />
            </div>
          </div>

          <div className="flex gap-4 items-end">
            <RHFSwitch
              form={form}
              name="digitalOrderSettings.showWebsiteLink"
              label=""
              className="mb-2"
            />
            <div className="flex-1">
              <RHFInput
                form={form}
                name="digitalOrderSettings.websiteLink"
                label={t('digitalOrders.websiteUrl')}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="flex gap-4 items-end">
            <RHFSwitch
              form={form}
              name="digitalOrderSettings.showPinterestLink"
              label=""
              className="mb-2"
            />
            <div className="flex-1">
              <RHFInput
                form={form}
                name="digitalOrderSettings.pinterestLink"
                label={t('digitalOrders.pinterestUrl')}
                placeholder="https://pinterest.com/..."
              />
            </div>
          </div>

          <div className="flex gap-4 items-end">
            <RHFSwitch
              form={form}
              name="digitalOrderSettings.showLinkedInLink"
              label=""
              className="mb-2"
            />
            <div className="flex-1">
              <RHFInput
                form={form}
                name="digitalOrderSettings.linkedInLink"
                label={t('digitalOrders.linkedinUrl')}
                placeholder="https://linkedin.com/..."
              />
            </div>
          </div>

          <div className="flex gap-4 items-end">
            <RHFSwitch
              form={form}
              name="digitalOrderSettings.showYouTubeLink"
              label=""
              className="mb-2"
            />
            <div className="flex-1">
              <RHFInput
                form={form}
                name="digitalOrderSettings.youTubeLink"
                label={t('digitalOrders.youtubeUrl')}
                placeholder="https://youtube.com/..."
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const PAYMENT_GATEWAY_DEFAULTS: PaymentGatewayConfiguration = {
  cash: true,
  cod: true,
  payLater: false,
  razorPay: false,
  upi: false, // Include UPI as per the latest schema update
};

const DIGITAL_ORDER_SETTINGS_DEFAULTS: DigitalOrderSettings = {
  isDigitalOrderingEnabled: true,
  sendDigitalOrdersNotificationOn: DigitalOrdersNotificationChannel.ALL,
  reduceInventoryForDigitalOrderPlatform: false,
  whatsAppNumber: '0',
  customizedMessageForWhatsapp: 'WhatsApp Message',
  showCategoryFirst: false,
  showDescriptionOnDigitalPlatform: true,
  showPreparationTimeOnDigitalPlatform: true,
  showNutritionInfo: true,
  enableForDelivery: false,
  autoAcceptOrder: false,
  autoAcceptOrderOnCashPayment: false,
  sendOtpVia: 'SMS',
  enableForPickup: false,
  enableForDineIn: false,
  dineInTitle: 'dinein',
  dineInTitlePlaceholder: '',
  askForOrderTypeBeforePlacingOrder: true,
  showWhatsappLinkOnDigitalPlatform: true,
  showGridViewOnDigitalPlatform: false,
  showListViewOnDigitalPlatform: true,
  language: 'All',
  skipOtpVerification: false,
  enableForCategorySortingOnDigitalPlatform: false,
  autoCompleteOrderAfterAccept: false,
  sendEbillAfterComplete: false,
  // Using explicit defaults for nested payment objects
  paymentSettingsForDineIn: PAYMENT_GATEWAY_DEFAULTS,
  paymentSettingsForPickUp: PAYMENT_GATEWAY_DEFAULTS,
  paymentSettingsForDelivery: PAYMENT_GATEWAY_DEFAULTS,
  showContactNo: false,
  contactNo: '',
  whatsappLink: '',
  showFacebookLink: false,
  facebookLink: '',
  showInstagramLink: false,
  instagramLink: '',
  showWebsiteLink: false,
  websiteLink: '',
  showPinterestLink: false,
  pinterestLink: '',
  showLinkedInLink: false,
  linkedInLink: '',
  showYouTubeLink: false,
  youTubeLink: '',
};

// Hook for restaurant form logic (extended with digital settings defaults)
export function useDigitalOrderSettingsForm(
  editingRestaurant?: Restaurant | null,
): {
  form: UseFormReturn<RestaurantFormData, unknown>;
} {
  // Use the exact same validation schema as the main restaurant form
  const form = useForm<RestaurantFormData>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: {
      digitalOrderSettings: DIGITAL_ORDER_SETTINGS_DEFAULTS,
    },
  });

  // Reset form when editing restaurant changes
  React.useEffect(() => {
    if (editingRestaurant) {
      const resetFreq =
        editingRestaurant.nextResetBillFreq === 'daily' ||
        editingRestaurant.nextResetBillFreq === 'weekly' ||
        editingRestaurant.nextResetBillFreq === 'monthly' ||
        editingRestaurant.nextResetBillFreq === 'yearly'
          ? editingRestaurant.nextResetBillFreq
          : 'daily';

      const digitalOrderSettingsValues = {
        ...DIGITAL_ORDER_SETTINGS_DEFAULTS,
        ...(editingRestaurant.digitalOrderSettings || {}),
        paymentSettingsForDineIn: {
          ...PAYMENT_GATEWAY_DEFAULTS,
          ...(editingRestaurant.digitalOrderSettings
            ?.paymentSettingsForDineIn || {}),
        },
        paymentSettingsForPickUp: {
          ...PAYMENT_GATEWAY_DEFAULTS,
          ...(editingRestaurant.digitalOrderSettings
            ?.paymentSettingsForPickUp || {}),
        },
        paymentSettingsForDelivery: {
          ...PAYMENT_GATEWAY_DEFAULTS,
          ...(editingRestaurant.digitalOrderSettings
            ?.paymentSettingsForDelivery || {}),
        },
        showContactNo:
          editingRestaurant.digitalOrderSettings?.showContactNo ??
          DIGITAL_ORDER_SETTINGS_DEFAULTS.showContactNo,
        contactNo:
          editingRestaurant.digitalOrderSettings?.contactNo ||
          DIGITAL_ORDER_SETTINGS_DEFAULTS.contactNo,
        showFacebookLink:
          editingRestaurant.digitalOrderSettings?.showFacebookLink ??
          DIGITAL_ORDER_SETTINGS_DEFAULTS.showFacebookLink,
        facebookLink:
          editingRestaurant.digitalOrderSettings?.facebookLink ||
          DIGITAL_ORDER_SETTINGS_DEFAULTS.facebookLink,
        showInstagramLink:
          editingRestaurant.digitalOrderSettings?.showInstagramLink ??
          DIGITAL_ORDER_SETTINGS_DEFAULTS.showInstagramLink,
        instagramLink:
          editingRestaurant.digitalOrderSettings?.instagramLink ||
          DIGITAL_ORDER_SETTINGS_DEFAULTS.instagramLink,
        showWebsiteLink:
          editingRestaurant.digitalOrderSettings?.showWebsiteLink ??
          DIGITAL_ORDER_SETTINGS_DEFAULTS.showWebsiteLink,
        websiteLink:
          editingRestaurant.digitalOrderSettings?.websiteLink ||
          DIGITAL_ORDER_SETTINGS_DEFAULTS.websiteLink,
        showPinterestLink:
          editingRestaurant.digitalOrderSettings?.showPinterestLink ??
          DIGITAL_ORDER_SETTINGS_DEFAULTS.showPinterestLink,
        pinterestLink:
          editingRestaurant.digitalOrderSettings?.pinterestLink ||
          DIGITAL_ORDER_SETTINGS_DEFAULTS.pinterestLink,
        showLinkedInLink:
          editingRestaurant.digitalOrderSettings?.showLinkedInLink ??
          DIGITAL_ORDER_SETTINGS_DEFAULTS.showLinkedInLink,
        linkedInLink:
          editingRestaurant.digitalOrderSettings?.linkedInLink ||
          DIGITAL_ORDER_SETTINGS_DEFAULTS.linkedInLink,
        showYouTubeLink:
          editingRestaurant.digitalOrderSettings?.showYouTubeLink ??
          DIGITAL_ORDER_SETTINGS_DEFAULTS.showYouTubeLink,
        youTubeLink:
          editingRestaurant.digitalOrderSettings?.youTubeLink ||
          DIGITAL_ORDER_SETTINGS_DEFAULTS.youTubeLink,
        showWhatsappLinkOnDigitalPlatform:
          editingRestaurant.digitalOrderSettings
            ?.showWhatsappLinkOnDigitalPlatform ??
          DIGITAL_ORDER_SETTINGS_DEFAULTS.showWhatsappLinkOnDigitalPlatform,
        whatsappLink:
          editingRestaurant.digitalOrderSettings?.whatsappLink ||
          DIGITAL_ORDER_SETTINGS_DEFAULTS.whatsappLink,
      };
      form.reset({
        _id: editingRestaurant._id,
        name: editingRestaurant.name,
        description: editingRestaurant.description,
        brandId: editingRestaurant.brandId,
        isActive: editingRestaurant.isActive ?? true,
        logo: editingRestaurant.logo || '',
        address: editingRestaurant.address,
        timezone: editingRestaurant.timezone,
        startDayTime: backendTimeToMinutes(editingRestaurant.startDayTime),
        endDayTime: backendTimeToMinutes(editingRestaurant.endDayTime),
        nextResetBillFreq: resetFreq,
        nextResetBillDate: editingRestaurant.nextResetBillDate
          ? new Date(editingRestaurant.nextResetBillDate)
              .toISOString()
              .slice(0, 10)
          : undefined,
        nextResetKotFreq: resetFreq,
        phoneNumber: editingRestaurant.phoneNumber || null,
        contactEmail: editingRestaurant.contactEmail || null,
        countryCode: editingRestaurant.countryCode || COUNTRY_CODES[0].value,
        notificationPhone: editingRestaurant.notificationPhone || [],
        notificationEmails: editingRestaurant.notificationEmails || [],
        restoCode: editingRestaurant.restoCode || '',
        posLogoutOnClose: editingRestaurant.posLogoutOnClose ?? true,
        isFeedBackActive: editingRestaurant.isFeedBackActive ?? false,
        trnOrGstNo: editingRestaurant.trnOrGstNo || '',
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
          editingRestaurant.smsAndWhatsappSelection || 'none',
        whatsAppChannel: editingRestaurant.whatsAppChannel || '',
        paymentLinkSettings: editingRestaurant.paymentLinkSettings || {
          onWhatsapp: false,
          onSms: false,
        },
        eBillSettings: editingRestaurant.eBillSettings || {
          onEmail: false,
          onWhatsapp: false,
          onSms: false,
        },
        billPrefix: editingRestaurant.billPrefix,
        kotPrefix: editingRestaurant.kotPrefix,

        digitalOrderSettings: digitalOrderSettingsValues,
      });
    } else {
      form.reset({
        name: { en: '', ar: '' },
        description: { en: '', ar: '' },
        brandId: '',
        isActive: true,
        logo: '',
        address: {
          addressLine1: '',
          addressLine2: '',
          city: '',
          location: '',
          state: '',
          country: '',
          pincode: '',
        },
        timezone: getDefaultTimezone(),
        startDayTime: timeStringToMinutes(DEFAULT_TIMES.START_TIME),
        endDayTime: timeStringToMinutes(DEFAULT_TIMES.END_TIME),
        nextResetBillFreq: 'daily',
        nextResetBillDate: undefined,
        nextResetKotFreq: 'daily',
        phoneNumber: null,
        contactEmail: null,
        countryCode: '',
        notificationPhone: [],
        notificationEmails: [],
        restoCode: '',
        posLogoutOnClose: true,
        isFeedBackActive: false,
        trnOrGstNo: '',
        customQRcode: [],
        inventoryWarehouse: '',
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
        smsAndWhatsappSelection: 'none',
        whatsAppChannel: '',
        paymentLinkSettings: {
          onWhatsapp: false,
          onSms: false,
        },
        eBillSettings: {
          onEmail: false,
          onWhatsapp: false,
          onSms: false,
        },
        billPrefix: '',
        kotPrefix: '',
        digitalOrderSettings: DIGITAL_ORDER_SETTINGS_DEFAULTS,
      });
    }
  }, [editingRestaurant, form]);

  // DEBUG: Log incoming data to troubleshoot persistence issues
  console.log('DigitalSettingsForm Resetting with:', {
    editingRestaurant,
    digitalSettings: editingRestaurant?.digitalOrderSettings,
  });

  return { form };
}
