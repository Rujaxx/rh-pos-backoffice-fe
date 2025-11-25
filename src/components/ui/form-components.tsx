'use client';

import React from 'react';
import Image from 'next/image';
import {
  UseFormReturn,
  Controller,
  FieldPath,
  ControllerRenderProps,
  PathValue,
  Path,
} from 'react-hook-form';
import { useI18n } from '@/providers/i18n-provider';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import {
  timeStringToMinutes,
  minutesToTimeString,
} from '@/lib/utils/time.utils';
import { Languages, Globe, Upload } from 'lucide-react';

interface FormFieldWrapperProps<TFormValues extends Record<string, unknown>> {
  form: UseFormReturn<TFormValues>;
  name: FieldPath<TFormValues>;
  label: string;
  description?: string;
  children: (
    field: ControllerRenderProps<TFormValues, FieldPath<TFormValues>>,
  ) => React.ReactNode;
}

export function FormFieldWrapper<TFormValues extends Record<string, unknown>>({
  form,
  name,
  label,
  description,
  children,
}: FormFieldWrapperProps<TFormValues>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>{children(field)}</FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

interface RHFInputProps<TFormValues extends Record<string, unknown>> {
  form: UseFormReturn<TFormValues>;
  name: FieldPath<TFormValues>;
  label: string;
  description?: string;
  placeholder?: string;
  type?: string;
  className?: string;
  min?: string;
  max?: string;
  step?: string;
  disabled?: boolean;
  required?: boolean;
}

export function RHFInput<TFormValues extends Record<string, unknown>>({
  form,
  name,
  label,
  description,
  placeholder,
  type = 'text',
  className,
  min,
  max,
  step,
  disabled,
  required,
}: RHFInputProps<TFormValues>) {
  return (
    <FormFieldWrapper
      form={form}
      name={name}
      label={label}
      description={description}
    >
      {(field) => (
        <Input
          {...field}
          value={String(field.value || '')}
          onChange={(e) => {
            if (type === 'number') {
              // Convert string to number for number inputs
              const numValue =
                e.target.value === '' ? 0 : parseFloat(e.target.value);
              field.onChange(isNaN(numValue) ? 0 : numValue);
            } else {
              field.onChange(e.target.value);
            }
          }}
          type={type}
          placeholder={placeholder}
          className={cn('w-full', className)}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          required={required}
        />
      )}
    </FormFieldWrapper>
  );
}

interface RHFTimeInputProps<TFormValues extends Record<string, unknown>> {
  form: UseFormReturn<TFormValues>;
  name: FieldPath<TFormValues>;
  label: string;
  description?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

/**
 * Time input component that stores minutes from 00:00 in the form
 * but displays HH:mm format to the user
 */
export function RHFTimeInput<TFormValues extends Record<string, unknown>>({
  form,
  name,
  label,
  description,
  placeholder = '10:00',
  className,
  disabled,
}: RHFTimeInputProps<TFormValues>) {
  return (
    <FormFieldWrapper
      form={form}
      name={name}
      label={label}
      description={description}
    >
      {(field) => {
        // Convert minutes to time string for display
        const timeValue = field.value
          ? minutesToTimeString(field.value as number)
          : '';

        return (
          <Input
            type="time"
            value={timeValue}
            onChange={(e) => {
              // Convert time string to minutes for storage
              const minutes = timeStringToMinutes(e.target.value);
              field.onChange(minutes);
            }}
            onBlur={field.onBlur}
            placeholder={placeholder}
            className={cn('w-full', className)}
            disabled={disabled}
          />
        );
      }}
    </FormFieldWrapper>
  );
}

interface RHFTextareaProps<TFormValues extends Record<string, unknown>> {
  form: UseFormReturn<TFormValues>;
  name: FieldPath<TFormValues>;
  label: string;
  description?: string;
  placeholder?: string;
  rows?: number;
  className?: string;
}

export function RHFTextarea<TFormValues extends Record<string, unknown>>({
  form,
  name,
  label,
  description,
  placeholder,
  rows = 3,
  className,
}: RHFTextareaProps<TFormValues>) {
  return (
    <FormFieldWrapper
      form={form}
      name={name}
      label={label}
      description={description}
    >
      {(field) => (
        <Textarea
          {...field}
          value={String(field.value || '')}
          placeholder={placeholder}
          rows={rows}
          className={cn('w-full resize-none', className)}
        />
      )}
    </FormFieldWrapper>
  );
}

interface RHFSelectProps<TFormValues extends Record<string, unknown>> {
  form: UseFormReturn<TFormValues>;
  name: FieldPath<TFormValues>;
  label: string;
  description?: string;
  placeholder?: string;
  options: Array<{ value: string; label: string }>;
  className?: string;
  disabled?: boolean;
}
export function RHFSelect<TFormValues extends Record<string, unknown>>({
  form,
  name,
  label,
  description,
  placeholder = 'Select an option',
  options,
  className,
  disabled,
  defaultValue = null,
}: RHFSelectProps<TFormValues> & { defaultValue?: string | null }) {
  const currentValue = form.watch(name);

  // Set defaultValue only once when field is empty
  React.useEffect(() => {
    if (!currentValue && defaultValue) {
      form.setValue(
        name,
        defaultValue as unknown as PathValue<TFormValues, Path<TFormValues>>,
      );
    }
  }, [currentValue, defaultValue, form, name]);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const fieldValue = String(field.value || '');

        const valueExists =
          fieldValue && options.some((opt) => opt.value === fieldValue);

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Select
                onValueChange={field.onChange}
                value={valueExists ? fieldValue : ''}
                disabled={disabled}
              >
                <SelectTrigger className={cn('w-full', className)}>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>

                <SelectContent>
                  {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

interface RHFSwitchProps<TFormValues extends Record<string, unknown>> {
  form: UseFormReturn<TFormValues>;
  name: FieldPath<TFormValues>;
  label: string;
  description?: string;
  className?: string;
}

export function RHFSwitch<TFormValues extends Record<string, unknown>>({
  form,
  name,
  label,
  description,
  className,
}: RHFSwitchProps<TFormValues>) {
  const { locale } = useI18n();
  const isRTL = locale === 'ar';

  return (
    <FormFieldWrapper
      form={form}
      name={name}
      label={label}
      description={description}
    >
      {(field) => (
        <Switch
          checked={Boolean(field.value)}
          onCheckedChange={field.onChange}
          className={className}
          rtl={isRTL}
        />
      )}
    </FormFieldWrapper>
  );
}

interface RHFMultilingualInputProps<
  TFormValues extends Record<string, unknown>,
> {
  form: UseFormReturn<TFormValues>;
  name: FieldPath<TFormValues>;
  label: string;
  description?: string;
  placeholder?: { [key: string]: string };
  type?: 'input' | 'textarea';
  languages?: Array<{ code: string; name: string }>;
  className?: string;
}

export function RHFMultilingualInput<
  TFormValues extends Record<string, unknown>,
>({
  form,
  name,
  label,
  description,
  placeholder = {},
  type = 'input',
  languages = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'Arabic' },
  ],
  className,
}: RHFMultilingualInputProps<TFormValues>) {
  const Component = type === 'textarea' ? Textarea : Input;

  const [activeLang, setActiveLang] = React.useState('en');
  return (
    <FormField
      control={form.control}
      name={name}
      render={() => {
        return (
          <FormItem className={className}>
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-2">
              <FormLabel>{label}</FormLabel>

              {/* Language Switch - moved to top */}
              <div className="flex items-center gap-1">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setActiveLang(lang.code)}
                    className={`px-2 py-1 rounded-md text-xs border transition
                    ${
                      activeLang === lang.code
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-accent text-accent-foreground'
                    }
                  `}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Field */}
            <FormControl>
              <div className="space-y-1">
                {languages
                  .filter((l) => l.code === activeLang)
                  .map((lang) => (
                    <Controller
                      key={lang.code}
                      control={form.control}
                      name={`${name}.${lang.code}` as FieldPath<TFormValues>}
                      render={({ field: langField }) => (
                        <Component
                          {...langField}
                          value={String(langField.value || '')}
                          placeholder={
                            placeholder?.[lang.code] ||
                            `Enter ${label.toLowerCase()} in ${lang.name}`
                          }
                          className="w-full"
                          dir={lang.code === 'ar' ? 'rtl' : 'ltr'}
                        />
                      )}
                    />
                  ))}
              </div>
            </FormControl>

            {description && (
              <FormDescription className="mt-1">{description}</FormDescription>
            )}

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

interface RHFFileUploadProps<TFormValues extends Record<string, unknown>> {
  form: UseFormReturn<TFormValues>;
  name: FieldPath<TFormValues>;
  label: string;
  description?: string;
  accept?: string;
  className?: string;
}

export function RHFFileUpload<TFormValues extends Record<string, unknown>>({
  form,
  name,
  label,
  description,
  accept = 'image/*',
  className,
}: RHFFileUploadProps<TFormValues>) {
  const [preview, setPreview] = React.useState<string>('');

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        onChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  React.useEffect(() => {
    const currentValue = form.getValues(name);
    if (currentValue) {
      setPreview(currentValue as string);
    }
  }, [form, name]);

  return (
    <FormFieldWrapper
      form={form}
      name={name}
      label={label}
      description={description}
    >
      {(field) => (
        <div className={cn('space-y-2', className)}>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="file"
                  accept={accept}
                  onChange={(e) => handleFileChange(e, field.onChange)}
                  className="hidden"
                  id={`file-upload-${name}`}
                />
                <label
                  htmlFor={`file-upload-${name}`}
                  className={cn(
                    'flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors',
                    'hover:bg-muted/50 hover:border-primary',
                    preview
                      ? 'border-primary bg-primary/5'
                      : 'border-muted-foreground/25',
                  )}
                >
                  {preview ? (
                    <div className="flex flex-col items-center space-y-2">
                      <Image
                        src={preview}
                        alt="Preview"
                        width={64}
                        height={64}
                        className="object-contain rounded"
                      />
                      <span className="text-xs text-muted-foreground">
                        Click to change
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-2">
                      <Upload className="w-8 h-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Upload {label}
                      </span>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </FormFieldWrapper>
  );
}

interface RHFAddressFormProps<TFormValues extends Record<string, unknown>> {
  form: UseFormReturn<TFormValues>;
  name: FieldPath<TFormValues>;
  label?: string;
  className?: string;
}

export function RHFAddressForm<TFormValues extends Record<string, unknown>>({
  form,
  name,
  label,
  className,
}: RHFAddressFormProps<TFormValues>) {
  const { t } = useTranslation();

  return (
    <div className={className}>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">
            {label || t('form.address.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RHFInput
              form={form}
              name={`${name}.addressLine1` as FieldPath<TFormValues>}
              label={t('form.address.addressLine1')}
              placeholder={t('form.address.addressLine1Placeholder')}
            />
            <RHFInput
              form={form}
              name={`${name}.addressLine2` as FieldPath<TFormValues>}
              label={t('form.address.addressLine2')}
              placeholder={t('form.address.addressLine2Placeholder')}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <RHFInput
              form={form}
              name={`${name}.city` as FieldPath<TFormValues>}
              label={t('form.address.city')}
              placeholder={t('form.address.cityPlaceholder')}
            />
            <RHFInput
              form={form}
              name={`${name}.state` as FieldPath<TFormValues>}
              label={t('form.address.state')}
              placeholder={t('form.address.statePlaceholder')}
            />
            <RHFInput
              form={form}
              name={`${name}.country` as FieldPath<TFormValues>}
              label={t('form.address.country')}
              placeholder={t('form.address.countryPlaceholder')}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RHFInput
              form={form}
              name={`${name}.pincode` as FieldPath<TFormValues>}
              label={t('form.address.pincode')}
              placeholder={t('form.address.pincodePlaceholder')}
            />
            <RHFInput
              form={form}
              name={`${name}.location` as FieldPath<TFormValues>}
              label={t('form.address.location')}
              placeholder={t('form.address.locationPlaceholder')}
              description={t('form.address.locationDescription')}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
