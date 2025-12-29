import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  type LoginFormData,
  type RegisterFormData,
  type ForgotPasswordFormData,
  type ResetPasswordFormData,
} from '../auth.validation';

describe('Auth Validation Schemas', () => {
  describe('loginSchema', () => {
    describe('Valid inputs', () => {
      it('should accept valid login credentials', () => {
        const validData: LoginFormData = {
          username: 'johndoe',
          password: 'password123',
          rememberMe: false,
        };
        const result = loginSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should accept login with rememberMe true', () => {
        const validData: LoginFormData = {
          username: 'admin',
          password: 'admin123',
          rememberMe: true,
        };
        const result = loginSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should accept login without rememberMe field', () => {
        const validData = {
          username: 'testuser',
          password: 'test1234',
        };
        const result = loginSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should accept minimum length username and password', () => {
        const validData: LoginFormData = {
          username: 'abc', // min 3 chars
          password: 'pass', // min 4 chars
        };
        const result = loginSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });

    describe('Invalid inputs', () => {
      it('should reject empty username', () => {
        const invalidData = {
          username: '',
          password: 'password123',
        };
        const result = loginSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toContain(
            'Username is required',
          );
        }
      });

      it('should reject username shorter than 3 characters', () => {
        const invalidData = {
          username: 'ab',
          password: 'password123',
        };
        const result = loginSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toContain(
            'at least 3 characters',
          );
        }
      });

      it('should reject empty password', () => {
        const invalidData = {
          username: 'johndoe',
          password: '',
        };
        const result = loginSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toContain(
            'Password is required',
          );
        }
      });

      it('should reject password shorter than 4 characters', () => {
        const invalidData = {
          username: 'johndoe',
          password: 'abc',
        };
        const result = loginSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toContain(
            'at least 4 characters',
          );
        }
      });
    });
  });

  describe('registerSchema', () => {
    const validRegisterData: RegisterFormData = {
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      company: 'Acme Corporation',
      password: 'password123',
      agreeToTerms: true,
    };

    describe('Valid inputs', () => {
      it('should accept valid registration data', () => {
        const result = registerSchema.safeParse(validRegisterData);
        expect(result.success).toBe(true);
      });

      it('should accept registration with optional phone fields', () => {
        const dataWithPhone: RegisterFormData = {
          ...validRegisterData,
          countryCode: 'US',
          phoneNumber: '2025551234',
        };
        const result = registerSchema.safeParse(dataWithPhone);
        expect(result.success).toBe(true);
      });

      it('should transform name by trimming whitespace', () => {
        const data = {
          ...validRegisterData,
          name: '  John Doe  ',
        };
        const result = registerSchema.safeParse(data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.name).toBe('John Doe');
        }
      });

      it('should transform username to lowercase', () => {
        const data = {
          ...validRegisterData,
          username: 'JohnDoe123',
        };
        const result = registerSchema.safeParse(data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.username).toBe('johndoe123');
        }
      });

      it('should transform email to lowercase', () => {
        const data = {
          ...validRegisterData,
          email: 'John@EXAMPLE.COM',
        };
        const result = registerSchema.safeParse(data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.email).toBe('john@example.com');
        }
      });

      it('should normalize company name spaces', () => {
        const data = {
          ...validRegisterData,
          company: 'Acme   Corporation   Inc',
        };
        const result = registerSchema.safeParse(data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.company).toBe('Acme Corporation Inc');
        }
      });

      it('should transform country code to uppercase', () => {
        const data = {
          ...validRegisterData,
          countryCode: 'us',
          phoneNumber: '2025551234',
        };
        const result = registerSchema.safeParse(data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.countryCode).toBe('US');
        }
      });

      it('should clean phone number formatting', () => {
        const data = {
          ...validRegisterData,
          countryCode: 'US',
          phoneNumber: '(202) 555-1234',
        };
        const result = registerSchema.safeParse(data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.phoneNumber).toBe('2025551234');
        }
      });
    });

    describe('Name validation', () => {
      it('should reject empty name', () => {
        const data = { ...validRegisterData, name: '' };
        const result = registerSchema.safeParse(data);
        expect(result.success).toBe(false);
      });

      it('should reject name shorter than 2 characters', () => {
        const data = { ...validRegisterData, name: 'J' };
        const result = registerSchema.safeParse(data);
        expect(result.success).toBe(false);
      });

      it('should reject name longer than 100 characters', () => {
        const data = { ...validRegisterData, name: 'a'.repeat(101) };
        const result = registerSchema.safeParse(data);
        expect(result.success).toBe(false);
      });

      it('should accept name at minimum length', () => {
        const data = { ...validRegisterData, name: 'Jo' };
        const result = registerSchema.safeParse(data);
        expect(result.success).toBe(true);
      });

      it('should accept name at maximum length', () => {
        const data = { ...validRegisterData, name: 'a'.repeat(100) };
        const result = registerSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });

    describe('Username validation', () => {
      it('should reject empty username', () => {
        const data = { ...validRegisterData, username: '' };
        const result = registerSchema.safeParse(data);
        expect(result.success).toBe(false);
      });

      it('should reject username shorter than 3 characters', () => {
        const data = { ...validRegisterData, username: 'ab' };
        const result = registerSchema.safeParse(data);
        expect(result.success).toBe(false);
      });

      it('should reject username longer than 30 characters', () => {
        const data = { ...validRegisterData, username: 'a'.repeat(31) };
        const result = registerSchema.safeParse(data);
        expect(result.success).toBe(false);
      });

      it('should accept valid username with underscores and hyphens', () => {
        const data = { ...validRegisterData, username: 'john_doe-123' };
        const result = registerSchema.safeParse(data);
        expect(result.success).toBe(true);
      });

      it('should reject username with spaces', () => {
        const data = { ...validRegisterData, username: 'john doe' };
        const result = registerSchema.safeParse(data);
        expect(result.success).toBe(false);
      });

      it('should reject username with special characters', () => {
        const data = { ...validRegisterData, username: 'john@doe' };
        const result = registerSchema.safeParse(data);
        expect(result.success).toBe(false);
      });
    });

    describe('Email validation', () => {
      it('should reject empty email', () => {
        const data = { ...validRegisterData, email: '' };
        const result = registerSchema.safeParse(data);
        expect(result.success).toBe(false);
      });

      it('should reject invalid email format', () => {
        const invalidEmails = [
          'notanemail',
          'missing@domain',
          '@nodomain.com',
          'no@domain',
          'spaces in@email.com',
        ];

        invalidEmails.forEach((email) => {
          const data = { ...validRegisterData, email };
          const result = registerSchema.safeParse(data);
          expect(result.success).toBe(false);
        });
      });

      it('should accept valid email formats', () => {
        const validEmails = [
          'simple@example.com',
          'user.name@example.com',
          'user+tag@example.co.uk',
          'user_name@example-domain.com',
        ];

        validEmails.forEach((email) => {
          const data = { ...validRegisterData, email };
          const result = registerSchema.safeParse(data);
          expect(result.success).toBe(true);
        });
      });
    });

    describe('Company validation', () => {
      it('should reject empty company', () => {
        const data = { ...validRegisterData, company: '' };
        const result = registerSchema.safeParse(data);
        expect(result.success).toBe(false);
      });

      it('should reject company shorter than 2 characters', () => {
        const data = { ...validRegisterData, company: 'A' };
        const result = registerSchema.safeParse(data);
        expect(result.success).toBe(false);
      });

      it('should reject company longer than 100 characters', () => {
        const data = { ...validRegisterData, company: 'a'.repeat(101) };
        const result = registerSchema.safeParse(data);
        expect(result.success).toBe(false);
      });
    });

    describe('Country code validation', () => {
      it('should accept valid 2-letter country codes', () => {
        const validCodes = ['US', 'UK', 'IN', 'AE', 'CA'];
        validCodes.forEach((code) => {
          const data = { ...validRegisterData, countryCode: code };
          const result = registerSchema.safeParse(data);
          expect(result.success).toBe(true);
        });
      });

      it('should reject country code not exactly 2 characters', () => {
        const invalidCodes = ['U', 'USA', ''];
        invalidCodes.forEach((code) => {
          const data = { ...validRegisterData, countryCode: code };
          const result = registerSchema.safeParse(data);
          expect(result.success).toBe(false);
        });
      });

      it('should reject country code with numbers', () => {
        const data = { ...validRegisterData, countryCode: '12' };
        const result = registerSchema.safeParse(data);
        expect(result.success).toBe(false);
      });

      it('should accept lowercase country code and transform to uppercase', () => {
        const data = { ...validRegisterData, countryCode: 'us' };
        const result = registerSchema.safeParse(data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.countryCode).toBe('US');
        }
      });
    });

    describe('Phone number validation', () => {
      it('should accept valid phone number formats', () => {
        const validPhones = [
          '2025551234',
          '(202) 555-1234',
          '202-555-1234',
          '202 555 1234',
        ];

        validPhones.forEach((phone) => {
          const data = {
            ...validRegisterData,
            phoneNumber: phone,
            countryCode: 'US',
          };
          const result = registerSchema.safeParse(data);
          expect(result.success).toBe(true);
        });
      });

      it('should reject phone with letters', () => {
        const data = {
          ...validRegisterData,
          phoneNumber: '202-ABC-1234',
          countryCode: 'US',
        };
        const result = registerSchema.safeParse(data);
        expect(result.success).toBe(false);
      });
    });

    describe('Password validation', () => {
      it('should reject empty password', () => {
        const data = { ...validRegisterData, password: '' };
        const result = registerSchema.safeParse(data);
        expect(result.success).toBe(false);
      });

      it('should reject password shorter than 4 characters', () => {
        const data = { ...validRegisterData, password: 'abc' };
        const result = registerSchema.safeParse(data);
        expect(result.success).toBe(false);
      });

      it('should reject password longer than 128 characters', () => {
        const data = { ...validRegisterData, password: 'a'.repeat(129) };
        const result = registerSchema.safeParse(data);
        expect(result.success).toBe(false);
      });

      it('should accept password at minimum length', () => {
        const data = { ...validRegisterData, password: 'pass' };
        const result = registerSchema.safeParse(data);
        expect(result.success).toBe(true);
      });

      it('should accept password at maximum length', () => {
        const data = { ...validRegisterData, password: 'a'.repeat(128) };
        const result = registerSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });

    describe('Terms agreement validation', () => {
      it('should reject when agreeToTerms is false', () => {
        const data = { ...validRegisterData, agreeToTerms: false };
        const result = registerSchema.safeParse(data);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toContain(
            'agree to the terms',
          );
        }
      });

      it('should accept when agreeToTerms is true', () => {
        const data = { ...validRegisterData, agreeToTerms: true };
        const result = registerSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('forgotPasswordSchema', () => {
    describe('Valid inputs', () => {
      it('should accept valid email', () => {
        const validData: ForgotPasswordFormData = {
          email: 'user@example.com',
        };
        const result = forgotPasswordSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should transform email to lowercase', () => {
        const data = { email: 'User@EXAMPLE.COM' };
        const result = forgotPasswordSchema.safeParse(data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.email).toBe('user@example.com');
        }
      });

      it('should trim email whitespace', () => {
        const data = { email: '  user@example.com  ' };
        const result = forgotPasswordSchema.safeParse(data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.email).toBe('user@example.com');
        }
      });
    });

    describe('Invalid inputs', () => {
      it('should reject empty email', () => {
        const data = { email: '' };
        const result = forgotPasswordSchema.safeParse(data);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('Email is required');
        }
      });

      it('should reject invalid email format', () => {
        const invalidEmails = [
          'notanemail',
          'missing@domain',
          '@nodomain.com',
          'no@domain',
        ];

        invalidEmails.forEach((email) => {
          const result = forgotPasswordSchema.safeParse({ email });
          expect(result.success).toBe(false);
        });
      });
    });
  });

  describe('resetPasswordSchema', () => {
    describe('Valid inputs', () => {
      it('should accept valid reset password data', () => {
        const validData: ResetPasswordFormData = {
          token: 'valid-reset-token-123',
          newPassword: 'newpassword123',
        };
        const result = resetPasswordSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should accept minimum length password', () => {
        const data = {
          token: 'token123',
          newPassword: 'pass', // min 4 chars
        };
        const result = resetPasswordSchema.safeParse(data);
        expect(result.success).toBe(true);
      });

      it('should accept maximum length password', () => {
        const data = {
          token: 'token123',
          newPassword: 'a'.repeat(128),
        };
        const result = resetPasswordSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });

    describe('Invalid inputs', () => {
      it('should reject empty token', () => {
        const data = {
          token: '',
          newPassword: 'password123',
        };
        const result = resetPasswordSchema.safeParse(data);
        expect(result.success).toBe(false);
      });

      it('should reject empty password', () => {
        const data = {
          token: 'token123',
          newPassword: '',
        };
        const result = resetPasswordSchema.safeParse(data);
        expect(result.success).toBe(false);
      });

      it('should reject password shorter than 4 characters', () => {
        const data = {
          token: 'token123',
          newPassword: 'abc',
        };
        const result = resetPasswordSchema.safeParse(data);
        expect(result.success).toBe(false);
      });

      it('should reject password longer than 128 characters', () => {
        const data = {
          token: 'token123',
          newPassword: 'a'.repeat(129),
        };
        const result = resetPasswordSchema.safeParse(data);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('Integration scenarios', () => {
    it('should handle complete registration flow', () => {
      // User fills out registration form
      const userInput = {
        name: '  John Doe  ',
        username: 'JohnDoe123',
        email: 'John@EXAMPLE.COM',
        company: 'Acme   Corp',
        countryCode: 'us',
        phoneNumber: '(202) 555-1234',
        password: 'SecurePass123',
        agreeToTerms: true,
      };

      const result = registerSchema.safeParse(userInput);
      expect(result.success).toBe(true);

      if (result.success) {
        // Verify transformations
        expect(result.data.name).toBe('John Doe');
        expect(result.data.username).toBe('johndoe123');
        expect(result.data.email).toBe('john@example.com');
        expect(result.data.company).toBe('Acme Corp');
        expect(result.data.countryCode).toBe('US');
        expect(result.data.phoneNumber).toBe('2025551234');
      }
    });

    it('should handle login with various username formats', () => {
      const usernames = ['admin', 'Admin', 'ADMIN', 'admin123', 'admin_user'];

      usernames.forEach((username) => {
        const result = loginSchema.safeParse({
          username,
          password: 'password',
        });
        expect(result.success).toBe(true);
      });
    });

    it('should handle forgot password with email variations', () => {
      const emails = [
        'user@example.com',
        'User@Example.Com',
        '  user@example.com  ',
      ];

      emails.forEach((email) => {
        const result = forgotPasswordSchema.safeParse({ email });
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.email).toBe('user@example.com');
        }
      });
    });
  });
});
