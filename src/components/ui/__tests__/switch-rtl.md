# RTL Switch Animation Implementation

## Overview

The Switch component now supports proper RTL (Right-to-Left) animations for Arabic language users.

## Implementation Details

### Switch Component (`src/components/ui/switch.tsx`)

- Added `rtl?: boolean` prop to the Switch interface
- When `rtl={true}`, the switch thumb animates to the left when checked
- When `rtl={false}` (default), the switch thumb animates to the right when checked

### Animation Classes

- **LTR Mode**: `data-[state=checked]:translate-x-[calc(100%-2px)]` (moves right)
- **RTL Mode**: `data-[state=checked]:translate-x-[calc(-100%+2px)]` (moves left)

### Form Components Integration

#### RHFSwitch (`src/components/ui/form-components.tsx`)

- Automatically detects current locale using `useI18n()` hook
- Sets `rtl={true}` when `locale === 'ar'` (Arabic)
- Passes the RTL flag to the underlying Switch component

#### FormSwitch (`src/components/ui/form-fields.tsx`)

- Also includes RTL support with automatic locale detection
- Additionally handles RTL spacing with `space-x-reverse` class

## Usage Examples

### Automatic RTL Detection (Recommended)

```tsx
// In Arabic locale, this will automatically use RTL animations
<RHFSwitch
  form={form}
  name="isActive"
  label="Active Status"
  description="Toggle to activate or deactivate"
/>
```

### Manual RTL Control

```tsx
// For custom implementations
<Switch
  checked={isChecked}
  onCheckedChange={setIsChecked}
  rtl={locale === 'ar'}
/>
```

## Testing

1. Switch language to Arabic in the app
2. Navigate to any form with switches (e.g., brand creation form)
3. Toggle the switch - the thumb should animate towards the left when checked
4. Switch back to English - the thumb should animate towards the right when checked

## Files Modified

- `src/components/ui/switch.tsx` - Added RTL prop and animation logic
- `src/components/ui/form-components.tsx` - Added RTL detection for RHFSwitch
- `src/components/ui/form-fields.tsx` - Added RTL detection for FormSwitch
