'use client';

import React from 'react';
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
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import {
  timeStringToMinutes,
  minutesToTimeString,
} from '@/lib/utils/time.utils';
import { Country, State, City } from 'country-state-city';
import type { ICountry, IState, ICity } from 'country-state-city';

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

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Select
                onValueChange={field.onChange}
                value={fieldValue}
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

interface RHFAddressFormProps<TFormValues extends Record<string, unknown>> {
  form: UseFormReturn<TFormValues>;
  name: FieldPath<TFormValues>;
  label?: string;
  className?: string;
}

export function RHFAddressForm<TFormValues extends Record<string, unknown>>({
  form,
  name,
  className,
}: RHFAddressFormProps<TFormValues>) {
  const { t } = useTranslation();

  // Watch country and state to update dependent dropdowns
  const selectedCountry = form.watch(
    `${name}.country` as FieldPath<TFormValues>,
  ) as string;
  const selectedState = form.watch(
    `${name}.state` as FieldPath<TFormValues>,
  ) as string;

  // Get country options
  const countryOptions = React.useMemo(() => {
    return Country.getAllCountries().map((country: ICountry) => ({
      value: country.isoCode,
      label: country.name,
    }));
  }, []);

  // Get state options based on selected country
  const stateOptions = React.useMemo(() => {
    if (!selectedCountry) return [];
    return State.getStatesOfCountry(selectedCountry).map((state: IState) => ({
      value: state.isoCode,
      label: state.name,
    }));
  }, [selectedCountry]);

  // Get city options based on selected country and state
  const cityOptions = React.useMemo(() => {
    if (!selectedCountry || !selectedState) return [];
    return City.getCitiesOfState(selectedCountry, selectedState).map(
      (city: ICity) => ({
        value: city.name,
        label: city.name,
      }),
    );
  }, [selectedCountry, selectedState]);

  // Clear dependent fields when parent changes
  React.useEffect(() => {
    if (selectedCountry) {
      // Check if current state is valid for the new country
      const validStates = State.getStatesOfCountry(selectedCountry);
      const isStateValid = validStates.some(
        (s: IState) => s.isoCode === selectedState,
      );
      if (!isStateValid && selectedState) {
        form.setValue(
          `${name}.state` as Path<TFormValues>,
          '' as PathValue<TFormValues, Path<TFormValues>>,
        );
        form.setValue(
          `${name}.city` as Path<TFormValues>,
          '' as PathValue<TFormValues, Path<TFormValues>>,
        );
      }
    }
  }, [selectedCountry, selectedState, form, name]);

  React.useEffect(() => {
    if (selectedState && selectedCountry) {
      // Check if current city is valid for the new state
      const validCities = City.getCitiesOfState(selectedCountry, selectedState);
      const currentCity = form.getValues(
        `${name}.city` as FieldPath<TFormValues>,
      ) as string;
      const isCityValid = validCities.some(
        (c: ICity) => c.name === currentCity,
      );
      if (!isCityValid && currentCity) {
        form.setValue(
          `${name}.city` as Path<TFormValues>,
          '' as PathValue<TFormValues, Path<TFormValues>>,
        );
      }
    }
  }, [selectedState, selectedCountry, form, name]);

  return (
    <div className={cn('space-y-4', className)}>
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
        <RHFSelect
          form={form}
          name={`${name}.country` as FieldPath<TFormValues>}
          label={t('form.address.country')}
          placeholder={t('form.address.countryPlaceholder')}
          options={countryOptions}
        />
        <RHFSelect
          form={form}
          name={`${name}.state` as FieldPath<TFormValues>}
          label={t('form.address.state')}
          placeholder={
            stateOptions.length === 0 ? 'Select country first' : 'Select state'
          }
          options={stateOptions}
          disabled={!selectedCountry}
        />
        <RHFSelect
          form={form}
          name={`${name}.city` as FieldPath<TFormValues>}
          label={t('form.address.city')}
          placeholder={
            cityOptions.length === 0 ? 'Select state first' : 'Select city'
          }
          options={cityOptions}
          disabled={!selectedState}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        <RHFInput
          form={form}
          name={`${name}.pincode` as FieldPath<TFormValues>}
          label={t('form.address.pincode')}
          placeholder={t('form.address.pincodePlaceholder')}
        />
        <div className="md:col-span-2">
          <RHFInput
            form={form}
            name={`${name}.location` as FieldPath<TFormValues>}
            label={t('form.address.location')}
            placeholder={t('form.address.locationPlaceholder')}
          />
        </div>
      </div>
    </div>
  );
}
