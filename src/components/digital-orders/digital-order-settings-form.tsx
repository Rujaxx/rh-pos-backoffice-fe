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
  OrderTypesWithPayments,
} from '@/types/restaurant';
import {
  backendTimeToMinutes,
  timeStringToMinutes,
  DEFAULT_TIMES,
} from '@/lib/utils/time.utils';
import { getDefaultTimezone } from '@/lib/utils/timezone.utils';
import { COUNTRY_CODES } from '@/mock/dropdown-constants';
import { useOrderTypes } from '@/services/api/order-types/order-types.queries';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { MultilingualText } from '@/types';
import { useI18n } from '@/providers/i18n-provider';

interface DigitalOrderSettingsFormContentProps {
  form: UseFormReturn<RestaurantFormData>;
  editingRestaurant?: Restaurant | null;
}

export function DigitalOrderSettingsFormContent({
  form,
  editingRestaurant,
}: DigitalOrderSettingsFormContentProps) {
  const { t } = useTranslation();
  const { locale } = useI18n();

  // Fetch available order types
  const { data: orderTypesResponse, isLoading: isLoadingOrderTypes } =
    useOrderTypes();
  const availableOrderTypes = orderTypesResponse?.data || [];

  const currentOrderTypes = form.watch('digitalOrderSettings.orderTypes') || [];

  // Helper to get allowed payments for a specific order type
  const getAllowedPayments = (orderTypeId: string): string[] => {
    const setting = currentOrderTypes.find(
      (ot) => ot.orderTypeId === orderTypeId,
    );
    return setting?.allowedPaymentMethods || [];
  };

  // Helper to toggle order type enable/disable
  const handleOrderTypeToggle = (orderTypeId: string, checked: boolean) => {
    let newOrderTypes = [...currentOrderTypes];
    if (checked) {
      if (!newOrderTypes.some((ot) => ot.orderTypeId === orderTypeId)) {
        // When enabling, default to CASH enabled (Uppercase)
        newOrderTypes.push({
          orderTypeId,
          allowedPaymentMethods: ['CASH'],
        });
      }
    } else {
      newOrderTypes = newOrderTypes.filter(
        (ot) => ot.orderTypeId !== orderTypeId,
      );
    }
    form.setValue('digitalOrderSettings.orderTypes', newOrderTypes, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  // Helper to toggle a specific payment method for an order type
  const handlePaymentMethodToggle = (
    orderTypeId: string,
    paymentKey: string,
    checked: boolean,
  ) => {
    // Convert to uppercase for storage
    const paymentValue = paymentKey.toUpperCase();

    const newOrderTypes = currentOrderTypes.map((ot) => {
      if (ot.orderTypeId === orderTypeId) {
        let newMethods = [...ot.allowedPaymentMethods];
        if (checked) {
          if (!newMethods.includes(paymentValue)) {
            newMethods.push(paymentValue);
          }
        } else {
          newMethods = newMethods.filter((m) => m !== paymentValue);
        }
        return { ...ot, allowedPaymentMethods: newMethods };
      }
      return ot;
    });

    form.setValue('digitalOrderSettings.orderTypes', newOrderTypes, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

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

  // Define payment options list for iteration
  const paymentMethodOptions = [
    { key: 'cash', label: t('digitalOrders.paymentMethods.cash') },
    { key: 'card', label: t('digitalOrders.paymentMethods.card') },
    { key: 'cod', label: t('digitalOrders.paymentMethods.cod') },
    { key: 'payLater', label: t('digitalOrders.paymentMethods.payLater') },
    { key: 'razorPay', label: t('digitalOrders.paymentMethods.razorPay') },
    { key: 'upi', label: t('digitalOrders.paymentMethods.upi') },
    { key: 'paytm', label: t('digitalOrders.paymentMethods.paytm') },
    { key: 'phonePe', label: t('digitalOrders.paymentMethods.phonePe') },
    { key: 'googlePay', label: t('digitalOrders.paymentMethods.googlePay') },
    { key: 'stripe', label: t('digitalOrders.paymentMethods.stripe') },
    { key: 'applePay', label: t('digitalOrders.paymentMethods.applePay') },
    { key: 'careemPay', label: t('digitalOrders.paymentMethods.careemPay') },
    { key: 'wallet', label: t('digitalOrders.paymentMethods.wallet') },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-muted/30 p-4 rounded-lg border mb-4">
        <h3 className="font-semibold text-lg flex items-center">
          {editingRestaurant?.name[locale] || editingRestaurant?.name.en}
          {editingRestaurant?.restoCode && (
            <span className="ml-2 text-sm text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
              {editingRestaurant?.restoCode}
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
          <CardDescription>
            {t('digitalOrders.orderTypeAvailabilityDesc') ||
              'Select available order types and configure their payment methods.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoadingOrderTypes ? (
            <div className="text-sm text-muted-foreground">
              {t('digitalOrders.loadingOrderTypes')}
            </div>
          ) : (
            availableOrderTypes.map((orderType) => {
              const isEnabled = currentOrderTypes.some(
                (ot) => ot.orderTypeId === orderType._id,
              );
              const allowedPayments = getAllowedPayments(orderType._id);

              return (
                <div
                  key={orderType._id}
                  className="rounded-lg border p-4 space-y-4"
                >
                  <div className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">
                        {orderType.name[locale as keyof MultilingualText] ||
                          'Unknown Order Type'}
                      </Label>
                    </div>
                    <Switch
                      checked={isEnabled}
                      onCheckedChange={(checked) =>
                        handleOrderTypeToggle(orderType._id, checked)
                      }
                    />
                  </div>

                  {isEnabled && (
                    <div className="pl-4 border-l-2 border-muted mt-2">
                      <Label className="text-sm font-medium mb-2 block">
                        {t('digitalOrders.paymentMethods.title') ||
                          'Payment Methods'}
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {paymentMethodOptions.map((payment) => (
                          <div
                            key={payment.key}
                            className="flex items-center space-x-2"
                          >
                            <Switch
                              id={`${orderType._id}-${payment.key}`}
                              checked={allowedPayments.includes(
                                payment.key.toUpperCase(),
                              )}
                              onCheckedChange={(checked) =>
                                handlePaymentMethodToggle(
                                  orderType._id,
                                  payment.key,
                                  checked,
                                )
                              }
                            />
                            <Label
                              htmlFor={`${orderType._id}-${payment.key}`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {payment.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
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
  orderTypes: [], // Defaults to empty array
  autoAcceptOrder: false,
  autoAcceptOrderOnCashPayment: false,
  sendOtpVia: 'SMS',

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
} as DigitalOrderSettings;

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
        orderTypes:
          (editingRestaurant.digitalOrderSettings
            ?.orderTypes as OrderTypesWithPayments[]) || [],
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

  return { form };
}
