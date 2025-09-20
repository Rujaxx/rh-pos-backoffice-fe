"use client"

import React from "react"
import Image from "next/image"
import { UseFormReturn, Controller, FieldPath, ControllerRenderProps } from "react-hook-form"
import { useI18n } from "@/providers/i18n-provider"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/hooks/useTranslation"
import { Languages, Globe, Upload } from "lucide-react"

interface FormFieldWrapperProps<TFormValues extends Record<string, unknown>> {
  form: UseFormReturn<TFormValues>
  name: FieldPath<TFormValues>
  label: string
  description?: string
  children: (field: ControllerRenderProps<TFormValues, FieldPath<TFormValues>>) => React.ReactNode
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
          <FormControl>
            {children(field)}
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

interface RHFInputProps<TFormValues extends Record<string, unknown>> {
  form: UseFormReturn<TFormValues>
  name: FieldPath<TFormValues>
  label: string
  description?: string
  placeholder?: string
  type?: string
  className?: string
  min?: string
  max?: string
  step?: string
  disabled?: boolean
}

export function RHFInput<TFormValues extends Record<string, unknown>>({
  form,
  name,
  label,
  description,
  placeholder,
  type = "text",
  className,
  min,
  max,
  step,
  disabled,
}: RHFInputProps<TFormValues>) {
  return (
    <FormFieldWrapper form={form} name={name} label={label} description={description}>
      {(field) => (
        <Input
          {...field}
          value={String(field.value || "")}
          onChange={(e) => {
            if (type === "number") {
              // Convert string to number for number inputs
              const numValue = e.target.value === '' ? 0 : parseFloat(e.target.value)
              field.onChange(isNaN(numValue) ? 0 : numValue)
            } else {
              field.onChange(e.target.value)
            }
          }}
          type={type}
          placeholder={placeholder}
          className={cn("w-full", className)}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
        />
      )}
    </FormFieldWrapper>
  )
}

interface RHFTextareaProps<TFormValues extends Record<string, unknown>> {
  form: UseFormReturn<TFormValues>
  name: FieldPath<TFormValues>
  label: string
  description?: string
  placeholder?: string
  rows?: number
  className?: string
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
    <FormFieldWrapper form={form} name={name} label={label} description={description}>
      {(field) => (
        <Textarea
          {...field}
          value={String(field.value || "")}
          placeholder={placeholder}
          rows={rows}
          className={cn("w-full resize-none", className)}
        />
      )}
    </FormFieldWrapper>
  )
}

interface RHFSelectProps<TFormValues extends Record<string, unknown>> {
  form: UseFormReturn<TFormValues>
  name: FieldPath<TFormValues>
  label: string
  description?: string
  placeholder?: string
  options: Array<{ value: string; label: string }>
  className?: string
}

export function RHFSelect<TFormValues extends Record<string, unknown>>({
  form,
  name,
  label,
  description,
  placeholder = "Select an option",
  options,
  className,
}: RHFSelectProps<TFormValues>) {
  return (
    <FormFieldWrapper form={form} name={name} label={label} description={description}>
      {(field) => (
        <Select onValueChange={field.onChange} defaultValue={String(field.value || "")}>
          <SelectTrigger className={cn("w-full", className)}>
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
      )}
    </FormFieldWrapper>
  )
}

interface RHFSwitchProps<TFormValues extends Record<string, unknown>> {
  form: UseFormReturn<TFormValues>
  name: FieldPath<TFormValues>
  label: string
  description?: string
  className?: string
}

export function RHFSwitch<TFormValues extends Record<string, unknown>>({
  form,
  name,
  label,
  description,
  className,
}: RHFSwitchProps<TFormValues>) {
  const { locale } = useI18n()
  const isRTL = locale === 'ar'
  
  return (
    <FormFieldWrapper form={form} name={name} label={label} description={description}>
      {(field) => (
        <Switch
          checked={Boolean(field.value)}
          onCheckedChange={field.onChange}
          className={className}
          rtl={isRTL}
        />
      )}
    </FormFieldWrapper>
  )
}

interface RHFMultilingualInputProps<TFormValues extends Record<string, unknown>> {
  form: UseFormReturn<TFormValues>
  name: FieldPath<TFormValues>
  label: string
  description?: string
  placeholder?: { [key: string]: string }
  type?: "input" | "textarea"
  languages?: Array<{ code: string; name: string }>
  className?: string
}

export function RHFMultilingualInput<TFormValues extends Record<string, unknown>>({
  form,
  name,
  label,
  description,
  placeholder = {},
  type = "input",
  languages = [
    { code: "en", name: "English" },
    { code: "ar", name: "Arabic" }
  ],
  className,
}: RHFMultilingualInputProps<TFormValues>) {
  const Component = type === "textarea" ? Textarea : Input

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Languages className="h-4 w-4" />
                  Multilingual Content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {languages.map((lang) => (
                  <div key={lang.code} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {lang.name}
                      </Badge>
                      <Globe className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <Controller
                      control={form.control}
                      name={`${name}.${lang.code}` as FieldPath<TFormValues>}
                      render={({ field: langField }) => (
                        <Component
                          {...langField}
                          value={String(langField.value || "")}
                          placeholder={placeholder[lang.code] || `Enter ${label.toLowerCase()} in ${lang.name}`}
                          className="w-full"
                          dir={lang.code === 'ar' ? 'rtl' : 'ltr'}
                        />
                      )}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

interface RHFFileUploadProps<TFormValues extends Record<string, unknown>> {
  form: UseFormReturn<TFormValues>
  name: FieldPath<TFormValues>
  label: string
  description?: string
  accept?: string
  className?: string
}

export function RHFFileUpload<TFormValues extends Record<string, unknown>>({
  form,
  name,
  label,
  description,
  accept = "image/*",
  className,
}: RHFFileUploadProps<TFormValues>) {
  const [preview, setPreview] = React.useState<string>("")

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setPreview(result)
        onChange(result)
      }
      reader.readAsDataURL(file)
    }
  }

  React.useEffect(() => {
    const currentValue = form.getValues(name)
    if (currentValue) {
      setPreview(currentValue as string)
    }
  }, [form, name])

  return (
    <FormFieldWrapper form={form} name={name} label={label} description={description}>
      {(field) => (
        <div className={cn("space-y-2", className)}>
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
                    "flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
                    "hover:bg-muted/50 hover:border-primary",
                    preview ? "border-primary bg-primary/5" : "border-muted-foreground/25"
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
                      <span className="text-xs text-muted-foreground">Click to change</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-2">
                      <Upload className="w-8 h-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Upload {label}</span>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </FormFieldWrapper>
  )
}

interface RHFAddressFormProps<TFormValues extends Record<string, unknown>> {
  form: UseFormReturn<TFormValues>
  name: FieldPath<TFormValues>
  label?: string
  className?: string
}

export function RHFAddressForm<TFormValues extends Record<string, unknown>>({
  form,
  name,
  label,
  className,
}: RHFAddressFormProps<TFormValues>) {
  const { t } = useTranslation()
  
  return (
    <div className={className}>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">{label || t('form.address.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RHFInput
              form={form}
              name={`${name}.street` as FieldPath<TFormValues>}
              label={t('form.address.street')}
              placeholder={t('form.address.streetPlaceholder')}
            />
            <RHFInput
              form={form}
              name={`${name}.city` as FieldPath<TFormValues>}
              label={t('form.address.city')}
              placeholder={t('form.address.cityPlaceholder')}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <RHFInput
              form={form}
              name={`${name}.zipCode` as FieldPath<TFormValues>}
              label={t('form.address.zipCode')}
              placeholder={t('form.address.zipCodePlaceholder')}
            />
            <RHFInput
              form={form}
              name={`${name}.latitude` as FieldPath<TFormValues>}
              label={t('form.address.latitude')}
              placeholder={t('form.address.latitudePlaceholder')}
              type="number"
            />
            <RHFInput
              form={form}
              name={`${name}.longitude` as FieldPath<TFormValues>}
              label={t('form.address.longitude')}
              placeholder={t('form.address.longitudePlaceholder')}
              type="number"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}