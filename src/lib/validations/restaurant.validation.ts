import { z } from "zod"
import { multilingualTextSchema, addressSchema } from "../validations";

export interface SendReportsSettings {
    email: boolean;
    whatsapp: boolean;
    sms: boolean;
}

export interface PaymentLinkSettings {
    onWhatsapp: boolean;
    onSms: boolean;
}

export interface EBillSettings {
    onEmail: boolean;
    onWhatsapp: boolean;
    onSms: boolean;
}

export const eBillSettingsSchema = z.object({
    onEmail: z.boolean(),
    onWhatsapp: z.boolean(),
    onSms: z.boolean(),
})

export const paymentLinkSettingsSchema = z.object({
    onWhatsapp: z.boolean(),
    onSms: z.boolean(),
})

export const sendReportsSchema = z.object({
    email: z.boolean(),
    whatsapp: z.boolean(),
    sms: z.boolean(),
})

export const restaurantSchema = z.object({
    name: multilingualTextSchema,
    description: multilingualTextSchema,
    brandId: z.string().min(1, "Brand is required"),
    isActive: z.boolean(),
    address: addressSchema,
    logo: z.string().min(0),
    timezone: z.string().min(1, "Timezone is required"),
    startDayTime: z.number().min(0).max(23, "Start day time must be between 0-23"),
    endDayTime: z.number().min(0).max(23, "End day time must be between 0-23"),
    nextResetBillFreq: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
    nextResetBillDate: z.string().min(0),
    notificationPhone: z.array(z.string()),
    notificationEmails: z.array(z.string().email("Invalid email format")),
    restoCode: z.string().min(0),
    posLogoutOnClose: z.boolean(),
    isFeedBackActive: z.boolean(),
    trnOrGstNo: z.string().min(0),
    customQRcode: z.array(z.string()),
    deductFromInventory: z.boolean(),
    multiplePriceSetting: z.boolean(),
    tableReservation: z.boolean(),
    autoUpdatePos: z.boolean(),
    sendReports: sendReportsSchema,
    allowMultipleTax: z.boolean(),
    generateOrderTypeWiseOrderNo: z.boolean(),
    smsAndWhatsappSelection: z.enum(['sms', 'whatsapp', 'both', 'none']),
    whatsAppChannel: z.string().min(0),
    paymentLinkSettings: paymentLinkSettingsSchema,
    eBillSettings: eBillSettingsSchema,
})

export type RestaurantFormData = z.infer<typeof restaurantSchema>

