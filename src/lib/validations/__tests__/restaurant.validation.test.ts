import {
  restaurantSchema,
  type RestaurantFormData,
} from '../restaurant.validation';

describe('Restaurant Validation Schema', () => {
  const validRestaurantData: Partial<RestaurantFormData> = {
    name: { en: 'Test Restaurant', ar: 'مطعم الاختبار' },
    brandId: '507f1f77bcf86cd799439011',
    timezone: 'Asia/Dubai',
    startDayTime: 360, // 6:00 AM
    endDayTime: 1380, // 11:00 PM
    nextResetBillFreq: 'daily',
    nextResetKotFreq: 'daily',
    notificationPhone: [],
    notificationEmails: [],
    isActive: true,
    posLogoutOnClose: true,
    isFeedBackActive: false,
    customQRcode: [],
    deductFromInventory: true,
    multiplePriceSetting: false,
    tableReservation: false,
    autoUpdatePos: true,
    sendReports: { email: false, whatsapp: false, sms: false },
    allowMultipleTax: false,
    generateOrderTypeWiseOrderNo: false,
    smsAndWhatsappSelection: 'none',
    paymentLinkSettings: { onWhatsapp: false, onSms: false },
    eBillSettings: { onEmail: false, onWhatsapp: false, onSms: false },
    currency: 'AED',
  };

  describe('Time Field Validation - startDayTime', () => {
    describe('Valid inputs', () => {
      it('should accept valid time at minimum (0 minutes = 12:00 AM)', () => {
        const data = { ...validRestaurantData, startDayTime: 0 };
        const result = restaurantSchema.safeParse(data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.startDayTime).toBe(0);
        }
      });

      it('should accept valid time at maximum (1439 minutes = 11:59 PM)', () => {
        const data = { ...validRestaurantData, startDayTime: 1439 };
        const result = restaurantSchema.safeParse(data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.startDayTime).toBe(1439);
        }
      });

      it('should accept valid time in middle range (360 = 6:00 AM)', () => {
        const data = { ...validRestaurantData, startDayTime: 360 };
        const result = restaurantSchema.safeParse(data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.startDayTime).toBe(360);
        }
      });

      it('should accept valid time (480 = 8:00 AM)', () => {
        const data = { ...validRestaurantData, startDayTime: 480 };
        const result = restaurantSchema.safeParse(data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.startDayTime).toBe(480);
        }
      });

      it('should accept valid time (720 = 12:00 PM)', () => {
        const data = { ...validRestaurantData, startDayTime: 720 };
        const result = restaurantSchema.safeParse(data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.startDayTime).toBe(720);
        }
      });
    });

    describe('Clamping behavior - values exceeding maximum', () => {
      it('should clamp value exceeding maximum (2359 → 1439)', () => {
        const data = { ...validRestaurantData, startDayTime: 2359 };
        const result = restaurantSchema.safeParse(data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.startDayTime).toBe(1439);
        }
      });

      it('should clamp large value (5000 → 1439)', () => {
        const data = { ...validRestaurantData, startDayTime: 5000 };
        const result = restaurantSchema.safeParse(data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.startDayTime).toBe(1439);
        }
      });

      it('should clamp slightly over maximum (1440 → 1439)', () => {
        const data = { ...validRestaurantData, startDayTime: 1440 };
        const result = restaurantSchema.safeParse(data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.startDayTime).toBe(1439);
        }
      });

      it('should clamp very large value (999999 → 1439)', () => {
        const data = { ...validRestaurantData, startDayTime: 999999 };
        const result = restaurantSchema.safeParse(data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.startDayTime).toBe(1439);
        }
      });
    });

    describe('Clamping behavior - negative values', () => {
      it('should clamp negative value (-1 → 0)', () => {
        const data = { ...validRestaurantData, startDayTime: -1 };
        const result = restaurantSchema.safeParse(data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.startDayTime).toBe(0);
        }
      });

      it('should clamp large negative value (-100 → 0)', () => {
        const data = { ...validRestaurantData, startDayTime: -100 };
        const result = restaurantSchema.safeParse(data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.startDayTime).toBe(0);
        }
      });

      it('should clamp very large negative value (-999999 → 0)', () => {
        const data = { ...validRestaurantData, startDayTime: -999999 };
        const result = restaurantSchema.safeParse(data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.startDayTime).toBe(0);
        }
      });
    });
  });

  describe('Time Field Validation - endDayTime', () => {
    describe('Valid inputs', () => {
      it('should accept valid time at minimum (0 minutes)', () => {
        const data = { ...validRestaurantData, endDayTime: 0 };
        const result = restaurantSchema.safeParse(data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.endDayTime).toBe(0);
        }
      });

      it('should accept valid time at maximum (1439 minutes = 11:59 PM)', () => {
        const data = { ...validRestaurantData, endDayTime: 1439 };
        const result = restaurantSchema.safeParse(data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.endDayTime).toBe(1439);
        }
      });

      it('should accept valid time (1380 = 11:00 PM)', () => {
        const data = { ...validRestaurantData, endDayTime: 1380 };
        const result = restaurantSchema.safeParse(data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.endDayTime).toBe(1380);
        }
      });

      it('should accept valid time (1320 = 10:00 PM)', () => {
        const data = { ...validRestaurantData, endDayTime: 1320 };
        const result = restaurantSchema.safeParse(data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.endDayTime).toBe(1320);
        }
      });
    });

    describe('Clamping behavior - values exceeding maximum', () => {
      it('should clamp value exceeding maximum (2359 → 1439)', () => {
        const data = { ...validRestaurantData, endDayTime: 2359 };
        const result = restaurantSchema.safeParse(data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.endDayTime).toBe(1439);
        }
      });

      it('should clamp large value (10000 → 1439)', () => {
        const data = { ...validRestaurantData, endDayTime: 10000 };
        const result = restaurantSchema.safeParse(data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.endDayTime).toBe(1439);
        }
      });

      it('should clamp slightly over maximum (1500 → 1439)', () => {
        const data = { ...validRestaurantData, endDayTime: 1500 };
        const result = restaurantSchema.safeParse(data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.endDayTime).toBe(1439);
        }
      });
    });

    describe('Clamping behavior - negative values', () => {
      it('should clamp negative value (-1 → 0)', () => {
        const data = { ...validRestaurantData, endDayTime: -1 };
        const result = restaurantSchema.safeParse(data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.endDayTime).toBe(0);
        }
      });

      it('should clamp large negative value (-500 → 0)', () => {
        const data = { ...validRestaurantData, endDayTime: -500 };
        const result = restaurantSchema.safeParse(data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.endDayTime).toBe(0);
        }
      });
    });
  });

  describe('Time Field Edge Cases', () => {
    it('should handle both time fields with clamping simultaneously', () => {
      const data = {
        ...validRestaurantData,
        startDayTime: -100, // Should clamp to 0
        endDayTime: 5000, // Should clamp to 1439
      };
      const result = restaurantSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.startDayTime).toBe(0);
        expect(result.data.endDayTime).toBe(1439);
      }
    });

    it('should handle old format values (HHMM format)', () => {
      const data = {
        ...validRestaurantData,
        startDayTime: 600, // 6:00 in old format, valid in new format
        endDayTime: 2300, // 23:00 in old format, should clamp to 1439
      };
      const result = restaurantSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.startDayTime).toBe(600);
        expect(result.data.endDayTime).toBe(1439);
      }
    });

    it('should handle boundary values correctly', () => {
      const testCases = [
        { input: -1, expected: 0 },
        { input: 0, expected: 0 },
        { input: 1, expected: 1 },
        { input: 1438, expected: 1438 },
        { input: 1439, expected: 1439 },
        { input: 1440, expected: 1439 },
      ];

      testCases.forEach(({ input, expected }) => {
        const data = { ...validRestaurantData, startDayTime: input };
        const result = restaurantSchema.safeParse(data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.startDayTime).toBe(expected);
        }
      });
    });
  });

  describe('Other Required Fields', () => {
    it('should reject missing name', () => {
      const data = { ...validRestaurantData, name: undefined };
      const result = restaurantSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject missing brandId', () => {
      const data = { ...validRestaurantData, brandId: '' };
      const result = restaurantSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject missing timezone', () => {
      const data = { ...validRestaurantData, timezone: '' };
      const result = restaurantSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject invalid reset frequency', () => {
      const data = {
        ...validRestaurantData,
        nextResetBillFreq: 'invalid' as any,
      };
      const result = restaurantSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('Phone Number Validation', () => {
    it('should accept valid phone with country code', () => {
      const data = {
        ...validRestaurantData,
        countryCode: 'US',
        phoneNumber: '2025551234',
      };
      const result = restaurantSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should reject phone without country code', () => {
      const data = {
        ...validRestaurantData,
        phoneNumber: '2025551234',
        countryCode: undefined,
      };
      const result = restaurantSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('Email Validation', () => {
    it('should accept valid email', () => {
      const data = {
        ...validRestaurantData,
        contactEmail: 'contact@restaurant.com',
      };
      const result = restaurantSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const data = {
        ...validRestaurantData,
        contactEmail: 'invalid-email',
      };
      const result = restaurantSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should accept valid notification emails array', () => {
      const data = {
        ...validRestaurantData,
        notificationEmails: ['admin@restaurant.com', 'manager@restaurant.com'],
      };
      const result = restaurantSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email in notification emails array', () => {
      const data = {
        ...validRestaurantData,
        notificationEmails: ['valid@email.com', 'invalid-email'],
      };
      const result = restaurantSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle complete restaurant creation with time clamping', () => {
      const userInput = {
        name: { en: 'New Restaurant', ar: 'مطعم جديد' },
        brandId: '507f1f77bcf86cd799439011',
        timezone: 'Asia/Dubai',
        startDayTime: 2359, // Old format, should clamp to 1439
        endDayTime: 5000, // Invalid, should clamp to 1439
        nextResetBillFreq: 'daily' as const,
        nextResetKotFreq: 'daily' as const,
        notificationPhone: ['971501234567'],
        notificationEmails: ['admin@restaurant.com'],
        countryCode: 'AE',
        phoneNumber: '501234567',
        contactEmail: 'contact@restaurant.com',
        isActive: true,
        posLogoutOnClose: true,
        isFeedBackActive: false,
        customQRcode: [],
        deductFromInventory: true,
        multiplePriceSetting: false,
        tableReservation: false,
        autoUpdatePos: true,
        sendReports: { email: true, whatsapp: false, sms: false },
        allowMultipleTax: false,
        generateOrderTypeWiseOrderNo: false,
        smsAndWhatsappSelection: 'none' as const,
        paymentLinkSettings: { onWhatsapp: false, onSms: false },
        eBillSettings: { onEmail: true, onWhatsapp: false, onSms: false },
        currency: 'AED',
      };

      const result = restaurantSchema.safeParse(userInput);
      if (!result.success) {
        console.log(
          'Validation errors:',
          JSON.stringify(result.error.issues, null, 2),
        );
      }
      expect(result.success).toBe(true);

      if (result.success) {
        // Verify time clamping
        expect(result.data.startDayTime).toBe(1439);
        expect(result.data.endDayTime).toBe(1439);
        // Verify other fields
        expect(result.data.name).toEqual({
          en: 'New Restaurant',
          ar: 'مطعم جديد',
        });
        expect(result.data.timezone).toBe('Asia/Dubai');
      }
    });

    it('should handle restaurant with minimal required fields', () => {
      const minimalData = {
        name: { en: 'Minimal Restaurant', ar: 'مطعم بسيط' },
        brandId: '507f1f77bcf86cd799439011',
        timezone: 'Asia/Dubai',
        startDayTime: 0,
        endDayTime: 1439,
        nextResetBillFreq: 'daily' as const,
        nextResetKotFreq: 'daily' as const,
        notificationPhone: [],
        notificationEmails: [],
        isActive: true,
        posLogoutOnClose: true,
        isFeedBackActive: false,
        customQRcode: [],
        deductFromInventory: true,
        multiplePriceSetting: false,
        tableReservation: false,
        autoUpdatePos: true,
        sendReports: { email: false, whatsapp: false, sms: false },
        allowMultipleTax: false,
        generateOrderTypeWiseOrderNo: false,
        smsAndWhatsappSelection: 'none' as const,
        paymentLinkSettings: { onWhatsapp: false, onSms: false },
        eBillSettings: { onEmail: false, onWhatsapp: false, onSms: false },
        currency: 'AED',
      };

      const result = restaurantSchema.safeParse(minimalData);
      expect(result.success).toBe(true);
    });
  });
});
