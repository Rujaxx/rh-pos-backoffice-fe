"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { MultilingualText } from "@/types/brand"
import { Languages, Globe } from "lucide-react"

interface FormFieldProps {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
  className?: string
}

export function FormField({ 
  label, 
  required = false, 
  error, 
  children, 
  className 
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {children}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}

interface MultilingualInputProps {
  label: string
  value: MultilingualText
  onChange: (value: MultilingualText) => void
  required?: boolean
  error?: string
  placeholder?: { [key: string]: string }
  type?: "input" | "textarea"
  languages?: Array<{ code: string; name: string }>
}

export function MultilingualInput({
  label,
  value,
  onChange,
  required = false,
  error,
  placeholder = {},
  type = "input",
  languages = [
    { code: "en", name: "English" },
    { code: "ar", name: "Arabic" }
  ]
}: MultilingualInputProps) {
  const handleChange = (langCode: string, newValue: string) => {
    onChange({
      ...value,
      [langCode]: newValue
    })
  }

  const Component = type === "textarea" ? Textarea : Input

  return (
    <FormField label={label} required={required} error={error}>
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
              <Component
                value={value[lang.code] || ""}
                onChange={(e) => handleChange(lang.code, e.target.value)}
                placeholder={placeholder[lang.code] || `Enter ${label.toLowerCase()} in ${lang.name}`}
                className="w-full"
                dir={lang.code === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </FormField>
  )
}

interface FormInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  error?: string
  placeholder?: string
  type?: string
  className?: string
}

export function FormInput({
  label,
  value,
  onChange,
  required = false,
  error,
  placeholder,
  type = "text",
  className
}: FormInputProps) {
  return (
    <FormField label={label} required={required} error={error} className={className}>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full"
      />
    </FormField>
  )
}

interface FormTextareaProps {
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  error?: string
  placeholder?: string
  rows?: number
  className?: string
}

export function FormTextarea({
  label,
  value,
  onChange,
  required = false,
  error,
  placeholder,
  rows = 3,
  className
}: FormTextareaProps) {
  return (
    <FormField label={label} required={required} error={error} className={className}>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-none"
      />
    </FormField>
  )
}

interface FormSelectProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string }>
  required?: boolean
  error?: string
  placeholder?: string
  className?: string
}

export function FormSelect({
  label,
  value,
  onChange,
  options,
  required = false,
  error,
  placeholder = "Select an option",
  className
}: FormSelectProps) {
  return (
    <FormField label={label} required={required} error={error} className={className}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
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
    </FormField>
  )
}

interface FormSwitchProps {
  label: string
  value: boolean
  onChange: (value: boolean) => void
  description?: string
  required?: boolean
  error?: string
  className?: string
}

export function FormSwitch({
  label,
  value,
  onChange,
  description,
  required = false,
  error,
  className
}: FormSwitchProps) {
  return (
    <FormField label={label} required={required} error={error} className={className}>
      <div className="flex items-center space-x-2">
        <Switch
          checked={value}
          onCheckedChange={onChange}
          id={`switch-${label.toLowerCase().replace(/\s+/g, '-')}`}
        />
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </FormField>
  )
}

interface AddressFormProps {
  value: {
    street?: string
    city?: string
    state?: string
    country?: string
    zipCode?: string
    latitude?: number
    longitude?: number
  }
  onChange: (value: {
    street?: string
    city?: string
    state?: string
    country?: string
    zipCode?: string
    latitude?: number
    longitude?: number
  }) => void
  errors?: { [key: string]: string }
}

export function AddressForm({ value, onChange, errors = {} }: AddressFormProps) {
  const handleChange = (field: string, newValue: string | number | undefined) => {
    onChange({
      ...value,
      [field]: newValue
    })
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Address Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Street"
            value={value.street || ""}
            onChange={(val) => handleChange("street", val)}
            error={errors.street}
            placeholder="Enter street address"
          />
          <FormInput
            label="City"
            value={value.city || ""}
            onChange={(val) => handleChange("city", val)}
            error={errors.city}
            placeholder="Enter city"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="State"
            value={value.state || ""}
            onChange={(val) => handleChange("state", val)}
            error={errors.state}
            placeholder="Enter state/province"
          />
          <FormInput
            label="Country"
            value={value.country || ""}
            onChange={(val) => handleChange("country", val)}
            error={errors.country}
            placeholder="Enter country"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput
            label="ZIP Code"
            value={value.zipCode || ""}
            onChange={(val) => handleChange("zipCode", val)}
            error={errors.zipCode}
            placeholder="Enter ZIP code"
          />
          <FormInput
            label="Latitude"
            value={value.latitude?.toString() || ""}
            onChange={(val) => handleChange("latitude", val ? parseFloat(val) : undefined)}
            error={errors.latitude}
            placeholder="Enter latitude"
            type="number"
          />
          <FormInput
            label="Longitude"
            value={value.longitude?.toString() || ""}
            onChange={(val) => handleChange("longitude", val ? parseFloat(val) : undefined)}
            error={errors.longitude}
            placeholder="Enter longitude"
            type="number"
          />
        </div>
      </CardContent>
    </Card>
  )
}