'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  imageLibrarySchema,
  ImageLibraryFormValues,
} from '@/validation/imageLibrary.validation';
import { ImageLibraryItem } from '@/types/imageLibrary.type';
import { Button } from '@/components/ui/button';
import { CrudModal } from '@/components/ui/crud-modal';
import { RHFMultilingualInput } from '@/components/ui/form-components';
import { TagEditor } from '@/components/image-library/TagEditor';
import { useUploadImage } from '@/services/api/upload/upload.mutations';
import {
  Upload,
  X,
  Pencil,
  Trash2,
  Search as SearchIcon,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { UploadFolderType } from '@/types/upload';
import { useImageLibraryItems } from '@/services/api/image-library/image-library.queries';
import {
  useCreateImageLibraryItem,
  useUpdateImageLibraryItem,
  useDeleteImageLibraryItem,
} from '@/services/api/image-library/image-library.mutations';
import { getS3UploadBaseUrl } from '@/config/api';

export default function ImageLibraryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<ImageLibraryItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const queryParams = useMemo(
    () => ({
      page,
      limit: 20,
      ...(debouncedSearch ? { term: debouncedSearch } : {}),
    }),
    [debouncedSearch, page],
  );

  const { data, isLoading, isFetching, error } =
    useImageLibraryItems(queryParams);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ImageLibraryItem | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  const [uploadedImageKey, setUploadedImageKey] = useState<string>('');

  const uploadMutation = useUploadImage();
  const createMutation = useCreateImageLibraryItem();
  const updateMutation = useUpdateImageLibraryItem();
  const deleteMutation = useDeleteImageLibraryItem();

  const form = useForm<ImageLibraryFormValues>({
    resolver: zodResolver(imageLibrarySchema),
    defaultValues: {
      dishName: { en: '', ar: '' },
      url: '',
      tags: [],
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = form;

  const refreshItems = useCallback(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    setTotalItems(0);
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadMutation.mutateAsync({
        file,
        options: {
          folderType: UploadFolderType.IMAGE_LIBRARY,
        },
      });

      setUploadedImageUrl(result.data.url);
      setUploadedImageKey(result.data.key);
      setValue('url', result.data.key, { shouldValidate: true });
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const clearUploadedImage = () => {
    setUploadedImageUrl('');
    setUploadedImageKey('');
    setValue('url', '', { shouldValidate: true });
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setUploadedImageUrl('');
    setUploadedImageKey('');
    reset({
      dishName: { en: '', ar: '' },
      url: '',
      tags: [],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: ImageLibraryItem) => {
    setEditingItem(item);
    setUploadedImageUrl(getS3UploadBaseUrl() + '/' + item.url);
    setUploadedImageKey('');
    reset({
      dishName: item.dishName,
      url: getS3UploadBaseUrl() + '/' + item.url,
      tags: item.tags || [],
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setUploadedImageUrl('');
    setUploadedImageKey('');
    reset();
  };

  const onSubmit = async (formData: ImageLibraryFormValues) => {
    try {
      if (editingItem) {
        await updateMutation.mutateAsync({
          id: editingItem._id,
          data: formData,
        });
      } else {
        await createMutation.mutateAsync(formData);
      }
      refreshItems();
      closeModal();
    } catch (error) {
      console.error('Failed to save item:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteMutation.mutateAsync(id);
        refreshItems();
      } catch (error) {
        console.error('Failed to delete item:', error);
      }
    }
  };

  const currentUrl = watch('url');
  const watchedTags = watch('tags') || [];

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    refreshItems();
  }, [debouncedSearch, refreshItems]);

  useEffect(() => {
    if (!data?.data) return;
    if (typeof data.meta?.page === 'number' && data.meta.page !== page) return;

    setItems((prev) => {
      if (page === 1) {
        return data.data;
      }

      const existingIds = new Set(prev.map((item) => item._id));
      const newItems = data.data.filter((item) => !existingIds.has(item._id));
      return [...prev, ...newItems];
    });

    if (typeof data.meta?.total === 'number') {
      setTotalItems(data.meta.total);
    } else {
      setTotalItems((prevTotal) =>
        page === 1 ? data.data.length : Math.max(prevTotal, data.data.length),
      );
    }

    if (typeof data.meta?.hasNextPage === 'boolean') {
      setHasMore(data.meta.hasNextPage);
    } else {
      setHasMore(data.data.length === queryParams.limit);
    }
  }, [data, page, queryParams.limit]);

  useEffect(() => {
    if (!hasMore) return;
    const node = loadMoreRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !isFetching && !isLoading) {
          setPage((prev) => prev + 1);
        }
      },
      {
        rootMargin: '200px',
      },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isFetching, isLoading]);

  const hasSearch = Boolean(debouncedSearch);
  const isInitialLoading = isLoading && page === 1 && items.length === 0;
  const isFetchingMore = isFetching && page > 1;

  if (isInitialLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error loading image library</div>;
  }

  return (
    <section className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="px-6 sm:px-10 lg:px-20 py-10 mx-auto max-w-screen-2xl">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to dashboard
          </Link>
        </div>
        <header className="flex flex-wrap items-center gap-4 justify-between border-b border-gray-200 dark:border-white/10 pb-6 mb-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Media Center
            </p>
            <h1 className="text-3xl lg:text-4xl font-black leading-tight tracking-[-0.03em] text-gray-900 dark:text-white">
              Image Library
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Browse your curated visuals, update metadata, or upload new
              dishes.
            </p>
          </div>
          <Button size="lg" onClick={openCreateModal}>
            Add Image
          </Button>
        </header>

        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="w-full flex-1 min-w-[280px] max-w-2xl">
            <label className="flex flex-col w-full">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 mb-2">
                Search
              </span>
              <div className="flex items-center rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 h-12 px-4 shadow-sm focus-within:ring-2 focus-within:ring-primary/50">
                <SearchIcon className="w-4 h-4 text-gray-400 mr-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by code, English or Arabic name, or tags..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
              </div>
            </label>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Showing {items.length} of {totalItems} assets
          </div>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {items.map((item) => (
              <div
                key={item._id}
                className="group relative overflow-hidden rounded-xl aspect-[3/4] bg-gray-200 dark:bg-white/5 flex items-end"
              >
                <Image
                  src={getS3UploadBaseUrl() + '/' + item.url}
                  alt={item.dishName.en}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent pointer-events-none" />

                <div className="absolute inset-0 flex flex-col justify-between p-4">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      type="button"
                      onClick={() => openEditModal(item)}
                      className="flex size-10 items-center justify-center rounded-full bg-gray-900/70 text-white backdrop-blur-md hover:bg-gray-900/90 shadow-lg shadow-black/30"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item._id)}
                      className="flex size-10 items-center justify-center rounded-full bg-gray-900/70 text-white backdrop-blur-md hover:bg-gray-900/90 shadow-lg shadow-black/30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="relative text-white">
                    <p className="text-xs font-semibold tracking-[0.3em] uppercase text-white/70">
                      {item.code}
                    </p>
                    <p className="text-lg font-bold leading-tight mt-1 line-clamp-2">
                      {item.dishName.en}
                    </p>
                    {item.dishName.ar && (
                      <p className="text-sm text-white/80 mt-1">
                        {item.dishName.ar}
                      </p>
                    )}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 rounded-full bg-white/15 text-xs font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-gray-300 dark:border-white/20 rounded-2xl py-16 text-center">
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              {hasSearch
                ? `No images match “${debouncedSearch || searchQuery}”`
                : 'No images in your library yet.'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {hasSearch
                ? 'Try adjusting your search or upload a new asset.'
                : 'Start by uploading an image to populate your library.'}
            </p>
          </div>
        )}
        {hasMore && (
          <div ref={loadMoreRef} className="flex justify-center py-10">
            {isFetchingMore && (
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-300">
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading more images...
              </div>
            )}
          </div>
        )}
      </div>

      <CrudModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingItem ? 'Edit Image' : 'Add Image'}
        form={form}
        onSubmit={onSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
        submitButtonText={editingItem ? 'Update Image' : 'Add Image'}
      >
        <div className="space-y-4">
          <RHFMultilingualInput
            form={form}
            name="dishName"
            label="Dish Name"
            placeholder={{
              en: 'Enter dish name in English',
              ar: 'أدخل اسم الطبق بالعربية',
            }}
          />

          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium mb-2">Image</label>

            {uploadedImageUrl || currentUrl ? (
              <div className="space-y-2">
                <div className="relative w-full h-48 border rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800">
                  <Image
                    src={uploadedImageUrl || currentUrl || ''}
                    alt="Preview"
                    fill
                    className="object-contain"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearUploadedImage}
                  className="w-full"
                >
                  <X className="w-4 h-4 mr-2" />
                  Remove Image
                </Button>
              </div>
            ) : (
              <div>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={uploadMutation.isPending}
                />
                <label
                  htmlFor="image-upload"
                  className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors block"
                >
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Click to upload or drag and drop
                  </span>
                  {uploadMutation.isPending && (
                    <p className="text-sm text-blue-600 mt-2">Uploading...</p>
                  )}
                </label>
              </div>
            )}

            <input type="hidden" {...register('url')} />
            {errors.url && (
              <p className="text-red-500 text-sm mt-1">{errors.url.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tags</label>
            <TagEditor
              tags={watchedTags}
              onChange={(tags) =>
                setValue('tags', tags, { shouldValidate: true })
              }
            />
          </div>
        </div>
      </CrudModal>
    </section>
  );
}
