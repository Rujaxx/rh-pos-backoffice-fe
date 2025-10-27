/**
 * Enhanced Image Upload Component
 * Integrates with upload API for two-step upload process
 */

import React, { useState, useCallback } from 'react'
import Image from 'next/image'
import { UseFormReturn, FieldPath, PathValue } from 'react-hook-form'
import { Upload, X, Loader2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { FormFieldWrapper } from './form-components'
import { useUploadImage, useDeleteTemporaryUpload } from '@/services/api/upload/upload.mutations'
import { UploadFolderType, UPLOAD_CONSTRAINTS } from '@/types/upload'
import { getS3UrlFromKey } from '@/lib/upload-utils'

interface ImageUploadProps<TFormValues extends Record<string, unknown>> {
  form: UseFormReturn<TFormValues>
  name: FieldPath<TFormValues>
  label: string
  description?: string
  folderType: UploadFolderType
  quality?: number
  maxWidth?: number
  maxHeight?: number
  className?: string
  required?: boolean
}

export function ImageUpload<TFormValues extends Record<string, unknown>>({
  form,
  name,
  label,
  description,
  folderType,
  quality = UPLOAD_CONSTRAINTS.DEFAULT_QUALITY,
  maxWidth = UPLOAD_CONSTRAINTS.DEFAULT_MAX_WIDTH,
  maxHeight = UPLOAD_CONSTRAINTS.DEFAULT_MAX_HEIGHT,
  className,
  // required = false,
}: ImageUploadProps<TFormValues>) {
  const [preview, setPreview] = useState<string>('')
  const [currentUploadKey, setCurrentUploadKey] = useState<string>('')
  const [dragOver, setDragOver] = useState(false)

  const uploadMutation = useUploadImage()
  const deleteUploadMutation = useDeleteTemporaryUpload()

  const currentValue = form.getValues(name) as string
  // Convert upload key to full S3 URL if needed
  const displayUrl = preview || getS3UrlFromKey(currentValue) || ''

  // Validate file before upload
  const validateFile = useCallback((file: File): string | null => {
    if (file.size > UPLOAD_CONSTRAINTS.MAX_FILE_SIZE) {
      return `File size must be less than ${UPLOAD_CONSTRAINTS.MAX_FILE_SIZE / 1024 / 1024}MB`
    }

    if (!UPLOAD_CONSTRAINTS.SUPPORTED_MIME_TYPES.includes(file.type as typeof UPLOAD_CONSTRAINTS.SUPPORTED_MIME_TYPES[number])) {
      return 'File type not supported. Please use JPEG, PNG, WebP, GIF, BMP, or TIFF'
    }

    return null
  }, [])

  // Handle file selection and upload
  const handleFileSelect = useCallback(async (file: File) => {
    const validation = validateFile(file)
    if (validation) {
      form.setError(name, { message: validation })
      return
    }

    try {
      // Clear any existing errors
      form.clearErrors(name)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setPreview(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)

      // Upload to API
      const result = await uploadMutation.mutateAsync({
        file,
        options: {
          folderType,
          quality,
          maxWidth,
          maxHeight,
        },
      })

      if (result.data) {
        // Store the upload key in the form (this will be sent to backend on form submission)
        form.setValue(name, result.data.key as PathValue<TFormValues, typeof name>)
        setCurrentUploadKey(result.data.key)

        // Update preview with the full S3 URL
        setPreview(getS3UrlFromKey(result.data.key))
      }
    } catch (error) {
      console.error('Upload failed:', error)
      setPreview('')
      // Error is already handled by the mutation
    }
  }, [form, name, validateFile, uploadMutation, folderType, quality, maxWidth, maxHeight])

  // Handle file input change
  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
    // Reset input value to allow selecting the same file again
    event.target.value = ''
  }, [handleFileSelect])

  // Handle drag and drop
  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    setDragOver(false)

    const file = event.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }, [handleFileSelect])

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    setDragOver(false)
  }, [])

  // Remove uploaded image
  const handleRemove = useCallback(async () => {
    // Delete from API if there's a current upload
    if (currentUploadKey) {
      try {
        await deleteUploadMutation.mutateAsync(currentUploadKey)
      } catch (error) {
        console.error('Failed to delete temporary upload:', error)
      }
    }

    // Clear form value and preview
    form.setValue(name, '' as PathValue<TFormValues, typeof name>)
    setPreview('')
    setCurrentUploadKey('')
  }, [form, name, currentUploadKey, deleteUploadMutation])

  // Initialize preview from current form value
  React.useEffect(() => {
    if (currentValue && !preview) {
      // Convert upload key to full S3 URL for preview
      setPreview(getS3UrlFromKey(currentValue))
    }
  }, [currentValue, preview])

  const isLoading = uploadMutation.isPending
  const hasError = !!form.formState.errors[name]
  const hasImage = !!displayUrl

  return (
    <FormFieldWrapper form={form} name={name} label={label} description={description}>
      {() => (
        <div className={cn('space-y-2', className)}>
          <div
            className={cn(
              'relative border-2 border-dashed rounded-lg transition-all duration-200',
              'hover:border-primary hover:bg-primary/5',
              dragOver && 'border-primary bg-primary/10',
              hasError && 'border-destructive',
              hasImage ? 'p-2' : 'p-8',
              isLoading && 'cursor-not-allowed opacity-50'
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {isLoading && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10 rounded-lg">
                <div className="flex flex-col items-center space-y-2">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="text-sm text-muted-foreground">Uploading...</span>
                </div>
              </div>
            )}

            {hasImage ? (
              <div className="relative group">
                <Image
                  src={displayUrl}
                  alt="Preview"
                  width={200}
                  height={200}
                  className="w-full h-48 object-contain rounded"
                  onError={() => {
                    setPreview('')
                  }}
                />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={handleRemove}
                    disabled={isLoading || deleteUploadMutation.isPending}
                  >
                    {deleteUploadMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded flex items-center justify-center">
                  <label
                    htmlFor={`file-upload-${name}`}
                    className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Button type="button" variant="secondary" size="sm">
                      Change Image
                    </Button>
                  </label>
                </div>
              </div>
            ) : (
              <label
                htmlFor={`file-upload-${name}`}
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                {hasError ? (
                  <AlertCircle className="h-8 w-8 text-destructive mb-2" />
                ) : (
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                )}
                <span className="text-sm font-medium text-center">
                  {hasError ? 'Upload Error' : `Upload ${label}`}
                </span>
                <span className="text-xs text-muted-foreground mt-1 text-center">
                  Drag & drop or click to select
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  Max {UPLOAD_CONSTRAINTS.MAX_FILE_SIZE / 1024 / 1024}MB
                </span>
              </label>
            )}

            <input
              id={`file-upload-${name}`}
              type="file"
              accept={UPLOAD_CONSTRAINTS.SUPPORTED_MIME_TYPES.join(',')}
              onChange={handleInputChange}
              className="hidden"
              disabled={isLoading}
            />
          </div>
        </div>
      )}
    </FormFieldWrapper>
  )
}