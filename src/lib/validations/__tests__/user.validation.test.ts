import { userSchema, type UserFormData } from '../user.validation';

describe('User Validation Schema', () => {
  const validUserData: UserFormData = {
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
    password: 'password123',
    role: '507f1f77bcf86cd799439011',
    restaurantIds: ['507f1f77bcf86cd799439012'],
    brandIds: ['507f1f77bcf86cd799439013'],
    isActive: true,
    agreeToTerms: true,
    webAccess: false,
    shiftStart: 480, // 8:00 AM
    shiftEnd: 1080, // 6:00 PM
    language: 'en',
    timeZone: 'Asia/Dubai',
  };

  describe('Shift Time Validation - shiftStart', () => {
    describe('Valid inputs', () => {
      it('should accept valid time at minimum (0 minutes = 12:00 AM)', () => {
        const data = { ...validUserData, shiftStart: 0 };
        const result = userSchema.safeParse(data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.shiftStart).toBe(0);
        }
      });

      it('should accept valid time at maximum (1439 minutes = 11:59 PM)', () => {
        const data = { ...validUserData, shiftStart: 1439 };
        const result = userSchema.safeParse(data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.shiftStart).toBe(1439);
        }
      });

      it('should accept valid time (480 = 8:00 AM)', () => {
        const data = { ...validUserData, shiftStart: 480 };
        const result = userSchema.safeParse(data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.shiftStart).toBe(480);
        }
      });

      it('should accept valid time (540 = 9:00 AM)', () => {
        const data = { ...validUserData, shiftStart: 540 };
        const result = userSchema.safeParse(data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.shiftStart).toBe(540);
        }
      });

      it('should accept valid time (720 = 12:00 PM)', () => {
        const data = { ...validUserData, shiftStart: 720 };
        const result = userSchema.safeParse(data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.shiftStart).toBe(720);
        }
      });
    });

    describe('Clamping behavior - values exceeding maximum', () => {
      it('should clamp value exceeding maximum (2359 → 1439)', () => {
        const data = { ...validUserData, shiftStart: 2359 };
        const result = userSchema.safeParse(data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.shiftStart).toBe(1439);
        }
      });

      it('should clamp large value (5000 → 1439)', () => {
        const data = { ...validUserData, shiftStart: 5000 };
        const result = userSchema.safeParse(data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.shiftStart).toBe(1439);
        }
      });

      it('should clamp slightly over maximum (1440 → 1439)', () => {
        const data = { ...validUserData, shiftStart: 1440 };
        const result = userSchema.safeParse(data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.shiftStart).toBe(1439);
        }
      });

      it('should clamp very large value (999999 → 1439)', () => {
        const data = { ...validUserData, shiftStart: 999999 };
        const result = userSchema.safeParse(data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.shiftStart).toBe(1439);
        }
      });
    });

    describe('Clamping behavior - negative values', () => {
      it('should clamp negative value (-1 → 0)', () => {
        const data = { ...validUserData, shiftStart: -1 };
        const result = userSchema.safeParse(data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.shiftStart).toBe(0);
        }
      });

      it('should clamp large negative value (-100 → 0)', () => {
        const data = { ...validUserData, shiftStart: -100 };
        const result = userSchema.safeParse(data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.shiftStart).toBe(0);
        }
      });

      it('should clamp very large negative value (-999999 → 0)', () => {
        const data = { ...validUserData, shiftStart: -999999 };
        const result = userSchema.safeParse(data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.shiftStart).toBe(0);
        }
      });
    });
  });

  describe('Shift Time Validation - shiftEnd', () => {
    describe('Valid inputs', () => {
      it('should accept valid time at minimum (0 minutes)', () => {
        const data = { ...validUserData, shiftEnd: 0 };
        const result = userSchema.safeParse(data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.shiftEnd).toBe(0);
        }
      });

      it('should accept valid time at maximum (1439 minutes = 11:59 PM)', () => {
        const data = { ...validUserData, shiftEnd: 1439 };
        const result = userSchema.safeParse(data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.shiftEnd).toBe(1439);
        }
      });

      it('should accept valid time (1080 = 6:00 PM)', () => {
        const data = { ...validUserData, shiftEnd: 1080 };
        const result = userSchema.safeParse(data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.shiftEnd).toBe(1080);
        }
      });

      it('should accept valid time (1020 = 5:00 PM)', () => {
        const data = { ...validUserData, shiftEnd: 1020 };
        const result = userSchema.safeParse(data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.shiftEnd).toBe(1020);
        }
      });
    });

    describe('Clamping behavior - values exceeding maximum', () => {
      it('should clamp value exceeding maximum (2359 → 1439)', () => {
        const data = { ...validUserData, shiftEnd: 2359 };
        const result = userSchema.safeParse(data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.shiftEnd).toBe(1439);
        }
      });

      it('should clamp large value (10000 → 1439)', () => {
        const data = { ...validUserData, shiftEnd: 10000 };
        const result = userSchema.safeParse(data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.shiftEnd).toBe(1439);
        }
      });

      it('should clamp slightly over maximum (1500 → 1439)', () => {
        const data = { ...validUserData, shiftEnd: 1500 };
        const result = userSchema.safeParse(data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.shiftEnd).toBe(1439);
        }
      });
    });

    describe('Clamping behavior - negative values', () => {
      it('should clamp negative value (-1 → 0)', () => {
        const data = { ...validUserData, shiftEnd: -1 };
        const result = userSchema.safeParse(data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.shiftEnd).toBe(0);
        }
      });

      it('should clamp large negative value (-500 → 0)', () => {
        const data = { ...validUserData, shiftEnd: -500 };
        const result = userSchema.safeParse(data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.shiftEnd).toBe(0);
        }
      });
    });
  });

  describe('Shift Time Edge Cases', () => {
    it('should handle both shift times with clamping simultaneously', () => {
      const data = {
        ...validUserData,
        shiftStart: -100, // Should clamp to 0
        shiftEnd: 5000, // Should clamp to 1439
      };
      const result = userSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.shiftStart).toBe(0);
        expect(result.data.shiftEnd).toBe(1439);
      }
    });

    it('should handle old format values (HHMM format)', () => {
      const data = {
        ...validUserData,
        shiftStart: 800, // 8:00 in old format, valid in new format
        shiftEnd: 1700, // 17:00 in old format, should clamp to 1439
      };
      const result = userSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.shiftStart).toBe(800);
        expect(result.data.shiftEnd).toBe(1439);
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
        const data = { ...validUserData, shiftStart: input };
        const result = userSchema.safeParse(data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.shiftStart).toBe(expected);
        }
      });
    });

    it('should handle typical shift scenarios', () => {
      const shifts = [
        { start: 480, end: 1080, desc: 'Morning shift (8 AM - 6 PM)' },
        { start: 540, end: 1020, desc: 'Day shift (9 AM - 5 PM)' },
        { start: 840, end: 1320, desc: 'Afternoon shift (2 PM - 10 PM)' },
        { start: 1200, end: 480, desc: 'Night shift (8 PM - 8 AM next day)' },
      ];

      shifts.forEach(({ start, end }) => {
        const data = { ...validUserData, shiftStart: start, shiftEnd: end };
        const result = userSchema.safeParse(data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.shiftStart).toBe(start);
          expect(result.data.shiftEnd).toBe(end);
        }
      });
    });
  });

  describe('User Name Validation', () => {
    it('should accept valid name', () => {
      const data = { ...validUserData, name: 'John Doe' };
      const result = userSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should reject name shorter than 3 characters', () => {
      const data = { ...validUserData, name: 'Jo' };
      const result = userSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should trim whitespace from name', () => {
      const data = { ...validUserData, name: '  John Doe  ' };
      const result = userSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe('John Doe');
      }
    });
  });

  describe('Username Validation', () => {
    it('should accept valid username', () => {
      const data = { ...validUserData, username: 'johndoe123' };
      const result = userSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should transform username to lowercase', () => {
      const data = { ...validUserData, username: 'JohnDoe123' };
      const result = userSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.username).toBe('johndoe123');
      }
    });

    it('should reject username shorter than 3 characters', () => {
      const data = { ...validUserData, username: 'ab' };
      const result = userSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject username longer than 30 characters', () => {
      const data = { ...validUserData, username: 'a'.repeat(31) };
      const result = userSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should accept username with underscores and hyphens', () => {
      const data = { ...validUserData, username: 'john_doe-123' };
      const result = userSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should reject username with spaces', () => {
      const data = { ...validUserData, username: 'john doe' };
      const result = userSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject username with special characters', () => {
      const data = { ...validUserData, username: 'john@doe' };
      const result = userSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('Email Validation', () => {
    it('should accept valid email', () => {
      const data = { ...validUserData, email: 'user@example.com' };
      const result = userSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should transform email to lowercase', () => {
      const data = { ...validUserData, email: 'User@EXAMPLE.COM' };
      const result = userSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('user@example.com');
      }
    });

    it('should reject invalid email format', () => {
      const invalidEmails = ['notanemail', 'missing@domain', '@nodomain.com'];
      invalidEmails.forEach((email) => {
        const data = { ...validUserData, email };
        const result = userSchema.safeParse(data);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('Phone Number Validation', () => {
    it('should accept valid phone with country code', () => {
      const data = {
        ...validUserData,
        countryCode: 'US',
        phoneNumber: '2025551234',
      };
      const result = userSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should reject phone without country code', () => {
      const data = {
        ...validUserData,
        phoneNumber: '2025551234',
        countryCode: undefined,
      };
      const result = userSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should transform country code to uppercase', () => {
      const data = {
        ...validUserData,
        countryCode: 'us',
        phoneNumber: '2025551234',
      };
      const result = userSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.countryCode).toBe('US');
      }
    });

    it('should clean phone number formatting', () => {
      const data = {
        ...validUserData,
        countryCode: 'US',
        phoneNumber: '(202) 555-1234',
      };
      const result = userSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.phoneNumber).toBe('2025551234');
      }
    });
  });

  describe('Role and Association Validation', () => {
    it('should reject missing role', () => {
      const data = { ...validUserData, role: '' };
      const result = userSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject empty restaurantIds array', () => {
      const data = { ...validUserData, restaurantIds: [] };
      const result = userSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject empty brandIds array', () => {
      const data = { ...validUserData, brandIds: [] };
      const result = userSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should accept multiple restaurant and brand IDs', () => {
      const data = {
        ...validUserData,
        restaurantIds: ['507f1f77bcf86cd799439012', '507f1f77bcf86cd799439013'],
        brandIds: ['507f1f77bcf86cd799439014', '507f1f77bcf86cd799439015'],
      };
      const result = userSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle complete user creation with shift time clamping', () => {
      const userInput = {
        name: '  Jane Smith  ',
        username: 'JaneSmith123',
        email: 'Jane@EXAMPLE.COM',
        password: 'SecurePass123',
        countryCode: 'ae',
        phoneNumber: '(50) 123-4567',
        role: '507f1f77bcf86cd799439011',
        restaurantIds: ['507f1f77bcf86cd799439012'],
        brandIds: ['507f1f77bcf86cd799439013'],
        isActive: true,
        agreeToTerms: true,
        webAccess: true,
        shiftStart: 2359, // Old format, should clamp to 1439
        shiftEnd: 5000, // Invalid, should clamp to 1439
        language: 'en',
        timeZone: 'Asia/Dubai',
        designation: 'Manager',
        address: '123 Main St',
      };

      const result = userSchema.safeParse(userInput);
      expect(result.success).toBe(true);

      if (result.success) {
        // Verify transformations
        expect(result.data.name).toBe('Jane Smith');
        expect(result.data.username).toBe('janesmith123');
        expect(result.data.email).toBe('jane@example.com');
        expect(result.data.countryCode).toBe('AE');
        expect(result.data.phoneNumber).toBe('501234567');
        // Verify shift time clamping
        expect(result.data.shiftStart).toBe(1439);
        expect(result.data.shiftEnd).toBe(1439);
      }
    });

    it('should handle user with minimal required fields', () => {
      const minimalData = {
        name: 'Min User',
        username: 'minuser',
        email: 'min@example.com',
        password: 'pass',
        role: '507f1f77bcf86cd799439011',
        restaurantIds: ['507f1f77bcf86cd799439012'],
        brandIds: ['507f1f77bcf86cd799439013'],
        isActive: true,
        agreeToTerms: true,
        webAccess: false,
        shiftStart: 0,
        shiftEnd: 1439,
        language: 'en',
        timeZone: 'UTC',
      };

      const result = userSchema.safeParse(minimalData);
      expect(result.success).toBe(true);
    });

    it('should handle various employee shift patterns', () => {
      const employees = [
        {
          ...validUserData,
          name: 'Morning Staff',
          shiftStart: 360, // 6 AM
          shiftEnd: 840, // 2 PM
        },
        {
          ...validUserData,
          name: 'Evening Staff',
          shiftStart: 840, // 2 PM
          shiftEnd: 1320, // 10 PM
        },
        {
          ...validUserData,
          name: 'Night Staff',
          shiftStart: 1320, // 10 PM
          shiftEnd: 360, // 6 AM (next day)
        },
      ];

      employees.forEach((employee) => {
        const result = userSchema.safeParse(employee);
        expect(result.success).toBe(true);
      });
    });
  });
});
