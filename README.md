# react-sharesheet

[![npm version](https://img.shields.io/npm/v/react-sharesheet.svg)](https://www.npmjs.com/package/react-sharesheet)
[![npm downloads](https://img.shields.io/npm/dm/react-sharesheet.svg)](https://www.npmjs.com/package/react-sharesheet)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Demo](https://img.shields.io/badge/demo-live-brightgreen.svg)](https://sharesheet.gwendall.com)

A mobile-first share sheet for React with native share support, built-in Open Graph previews, and 15+ social platforms.

Designed for modern React apps, react-sharesheet ships with a beautiful Tailwind-based drawer UI out of the box, while also exposing fully headless APIs for complete customization.

**[→ Live Demo](https://sharesheet.gwendall.com)**

## Why react-sharesheet?

- 📱 **Mobile-first drawer UI** - feels native on iOS & Android
- 🔗 **Native Web Share API** - fallback handled automatically
- 🖼 **Built-in Open Graph previews** - no extra setup
- 🧠 **Headless APIs** - build your own UI if needed
- 🎨 **Themeable** - CSS variables + Tailwind class overrides
- 🌍 **15+ social platforms** - WhatsApp, X, Telegram, Instagram, and more

## Installation

```bash
npm install react-sharesheet
# or
pnpm add react-sharesheet
# or
yarn add react-sharesheet
```

### Peer Dependencies

```bash
npm install react react-dom
```

### Tailwind CSS Setup

#### Tailwind v4

Add the package source to your CSS file:

```css
@import "tailwindcss";
@source "../../node_modules/react-sharesheet/dist";
```

> **Monorepo note (pnpm/bun workspaces):** the package is usually hoisted to the repository ROOT
> `node_modules`, not your app's. Point `@source` at the root, e.g. from `apps/web/src/app/globals.css`:
> `@source "../../../../node_modules/react-sharesheet/dist";` - a wrong path fails silently and the
> drawer renders unstyled (invisible).

#### Tailwind v3

Add the package to your `tailwind.config.js` content array:

```js
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/react-sharesheet/dist/**/*.{js,mjs}", // <-- Add this
  ],
  // ...
}
```

## Quick Start

### Full Drawer (recommended)

```tsx
import { ShareSheetDrawer } from "react-sharesheet";

function App() {
  return (
    <ShareSheetDrawer
      title="Share this!"
      shareUrl="https://example.com"
      shareText="Check out this awesome page!"
    >
      <button>Share</button>
    </ShareSheetDrawer>
  );
}
```

### Content Only (for custom modals)

```tsx
import { ShareSheetContent } from "react-sharesheet/content";

function CustomModal() {
  return (
    <Dialog>
      <ShareSheetContent
        shareUrl="https://example.com"
        shareText="Check this out!"
      />
    </Dialog>
  );
}
```

### Headless (full control)

```tsx
import { useShareSheet } from "react-sharesheet/headless";

function CustomShareUI() {
  const {
    canNativeShare,
    copied,
    copyLink,
    nativeShare,
    shareWhatsApp,
    shareX,
  } = useShareSheet({
    shareUrl: "https://example.com",
    shareText: "Check this out!",
  });

  return (
    <div className="flex gap-2">
      {canNativeShare && <button onClick={nativeShare}>Share</button>}
      <button onClick={copyLink}>{copied ? "Copied!" : "Copy"}</button>
      <button onClick={shareWhatsApp}>WhatsApp</button>
      <button onClick={shareX}>X</button>
    </div>
  );
}
```

## Automatic Link Preview

The share sheet automatically fetches Open Graph (OG) metadata from the `shareUrl` and displays a rich preview - just like Twitter, Telegram, and other platforms do when you paste a link.

```tsx
<ShareSheetDrawer
  shareUrl="https://gwendall.com"  // OG data fetched automatically!
  shareText="Check out this site!"
>
  <button>Share</button>
</ShareSheetDrawer>
```

The component will:
1. Fetch OG metadata (title, description, image) from the URL
2. Display a loading shimmer while fetching
3. Show the OG image if available, or a placeholder with the page title

### Using the OG Hook Directly

You can also use the `useOGData` hook for custom implementations:

```tsx
import { useOGData } from "react-sharesheet/headless";

function CustomPreview({ url }: { url: string }) {
  const { ogData, loading, error } = useOGData(url);

  if (loading) return <div>Loading...</div>;
  if (!ogData) return <div>No preview available</div>;

  return (
    <div>
      {ogData.image && <img src={ogData.image} alt={ogData.title} />}
      <h3>{ogData.title}</h3>
      <p>{ogData.description}</p>
    </div>
  );
}
```

### OGData Type

```ts
interface OGData {
  title?: string;       // Page title
  description?: string; // Page description
  image?: string;       // OG image URL
  url?: string;         // Canonical URL
  siteName?: string;    // Site name
}
```

## Theming

### CSS Variables

Override these variables to match your theme. **Note:** Colors are applied via inline styles, so CSS variables are the only way to customize them (Tailwind classes won't override inline styles).

```css
:root {
  /* Drawer */
  --sharesheet-overlay-bg: rgba(0, 0, 0, 0.7);
  --sharesheet-drawer-bg: #09090b;
  --sharesheet-drawer-border: #27272a;
  --sharesheet-handle-bg: #27272a;
  
  /* Typography */
  --sharesheet-title-color: #ffffff;
  --sharesheet-subtitle-color: #a1a1aa;
  --sharesheet-button-label-color: #ffffff;
  
  /* Image Preview */
  --sharesheet-preview-bg: rgba(255, 255, 255, 0.05);
  --sharesheet-preview-shimmer: rgba(255, 255, 255, 0.1);
  
  /* Platform colors (optional - defaults to brand colors) */
  --sharesheet-whatsapp-bg: #25D366;
  --sharesheet-telegram-bg: #229ED9;
  /* ... see full list below */
}

/* Dark/Light mode support */
.dark {
  --sharesheet-drawer-bg: #0a0a0a;
}

.light {
  --sharesheet-drawer-bg: #ffffff;
  --sharesheet-title-color: #09090b;
}
```

<details>
<summary>All CSS Variables</summary>

```css
/* Drawer */
--sharesheet-overlay-bg: rgba(0, 0, 0, 0.7);
--sharesheet-drawer-bg: #09090b;
--sharesheet-drawer-border: #27272a;
--sharesheet-handle-bg: #27272a;

/* Typography */
--sharesheet-title-color: #ffffff;
--sharesheet-subtitle-color: #a1a1aa;
--sharesheet-button-label-color: #ffffff;

/* Image Preview */
--sharesheet-preview-bg: rgba(255, 255, 255, 0.05);
--sharesheet-preview-shimmer: rgba(255, 255, 255, 0.1);

/* Platform backgrounds */
--sharesheet-native-bg: #7c3aed;
--sharesheet-copy-bg: #3b82f6;
--sharesheet-download-bg: #ef4444;
--sharesheet-whatsapp-bg: #25D366;
--sharesheet-telegram-bg: #229ED9;
--sharesheet-instagram-bg: #E1306C;
--sharesheet-facebook-bg: #1877F2;
--sharesheet-snapchat-bg: #FFFC00;
--sharesheet-sms-bg: #22c55e;
--sharesheet-email-bg: #f97316;
--sharesheet-linkedin-bg: #0A66C2;
--sharesheet-reddit-bg: #FF4500;
--sharesheet-x-bg: #000000;
--sharesheet-tiktok-bg: #000000;
--sharesheet-threads-bg: #000000;
```

</details>

### Tailwind Class Overrides

Override any part of the component with `classNames`:

```tsx
<ShareSheetDrawer
  shareUrl="..."
  shareText="..."
  classNames={{
    // Drawer
    overlay: "bg-black/80 backdrop-blur-sm",
    drawer: "bg-background rounded-t-3xl",
    drawerInner: "p-6",
    handle: "bg-muted",
    trigger: "cursor-pointer",
    
    // Content
    root: "max-w-lg",
    header: "mb-6",
    title: "text-3xl font-bold text-foreground",
    subtitle: "text-muted-foreground",
    
    // Preview
    preview: "mb-4",
    previewSkeleton: "rounded-xl",
    previewImage: "border border-white/10",
    
    // Buttons
    grid: "gap-6",
    button: "w-20",
    buttonIcon: "rounded-xl shadow-lg",
    buttonLabel: "font-medium",
  }}
>
```

## API Reference

### Props

#### ShareSheetContent / ShareSheetDrawer

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `"Share"` | Title displayed at the top |
| `shareUrl` | `string` | **required** | URL to share (OG preview fetched automatically) |
| `shareText` | `string` | **required** | Text to share |
| `downloadUrl` | `string` | - | URL for download button |
| `downloadFilename` | `string` | - | Filename for download |
| `previewImage` | `string \| null` | - | Custom preview image URL (skips OG fetching) |
| `shareFile` | `string \| Blob \| null` | - | File shared via native share (data URL or Blob); takes priority over URL sharing |
| `shareFilename` | `string` | `"share.png"` | Filename for the shared file |
| `className` | `string` | - | Class for root container |
| `classNames` | `object` | - | Override sub-component classes |
| `buttonSize` | `number` | `45` | Button size in pixels |
| `iconSize` | `number` | `22` | Icon size in pixels |
| `show` | `ShareOption[]` | - | Show only these platforms, in this exact order |
| `hide` | `ShareOption[]` | - | Hide these platforms |
| `labels` | `object` | - | Custom button labels |
| `icons` | `object` | - | Custom button icons |
| `onNativeShare` | `() => void` | - | Native share callback |
| `onCopy` | `() => void` | - | Copy callback |
| `onDownload` | `() => void` | - | Download callback |
| `onShare` | `(option: ShareOption) => void` | - | Called on every share option click, with the option id (analytics) |

#### ShareSheetDrawer (additional)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | **required** | Trigger element |
| `disabled` | `boolean` | `false` | Disable the trigger |
| `open` | `boolean` | - | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | - | Open state callback |

### ShareOption

Available platform identifiers:

```ts
type ShareOption =
  | "native"    // Native share API
  | "copy"      // Copy to clipboard
  | "download"  // Download file
  | "whatsapp"
  | "telegram"
  | "instagram"
  | "facebook"
  | "snapchat"
  | "sms"
  | "email"
  | "linkedin"
  | "reddit"
  | "x"
  | "tiktok"
  | "threads";
```

### useShareSheet Hook

```ts
const {
  canNativeShare,  // boolean - browser supports native share
  copied,          // boolean - link was recently copied
  downloading,     // boolean - download in progress
  safeUrl,         // string - resolved share URL
  
  // Actions
  copyLink,        // () => Promise<void>
  nativeShare,     // () => Promise<void>
  downloadFile,    // () => Promise<void>
  
  // Platform share functions
  shareWhatsApp,   // () => void
  shareTelegram,   // () => void
  shareX,          // () => void
  shareFacebook,   // () => void
  shareInstagram,  // () => void
  shareTikTok,     // () => void
  shareThreads,    // () => void
  shareSnapchat,   // () => void
  shareSMS,        // () => void
  shareEmail,      // () => void
  shareLinkedIn,   // () => void
  shareReddit,     // () => void
} = useShareSheet({
  shareUrl: string,
  shareText: string,
  downloadUrl?: string,
  downloadFilename?: string,
  emailSubject?: string,
  onNativeShare?: () => void,
  onCopy?: () => void,
  onDownload?: () => void,
});
```

## Exports

```ts
// Everything
import { 
  ShareSheetDrawer, 
  ShareSheetContent,
  useShareSheet,
  CSS_VARS,
  CSS_VAR_DEFAULTS,
  // Platform utilities
  PLATFORMS,
  PLATFORM_COLORS,
  PLATFORM_ICONS,
  PLATFORM_LABELS,
  getPlatform,
  getPlatformColor,
  // Share functions
  shareToWhatsApp,
  shareToX,
  // ...
} from "react-sharesheet";

// Content only (smaller bundle)
import { ShareSheetContent } from "react-sharesheet/content";

// Drawer only
import { ShareSheetDrawer } from "react-sharesheet/drawer";

// Headless (smallest bundle - no UI components)
import { 
  useShareSheet, 
  PLATFORM_COLORS,
  PLATFORM_ICONS,
  getPlatform,
  shareToWhatsApp, 
  shareToX,
  // ...
} from "react-sharesheet/headless";
```

## Platform Utilities

Access platform colors, icons, and labels for custom UIs:

```tsx
import { 
  PLATFORM_COLORS, 
  PLATFORM_ICONS, 
  PLATFORM_LABELS,
  getPlatform,
  getAllPlatforms,
} from "react-sharesheet";

// Get all platforms
const platforms = getAllPlatforms();
// [{ id: "whatsapp", label: "WhatsApp", colors: {...}, Icon: ... }, ...]

// Get single platform
const whatsapp = getPlatform("whatsapp");
// { id: "whatsapp", label: "WhatsApp", colors: { bg: "#25D366", text: "#fff" }, Icon: ... }

// Use colors directly
const bgColor = PLATFORM_COLORS.whatsapp.bg; // "#25D366"
const textColor = PLATFORM_COLORS.whatsapp.text; // "#ffffff"

// Use icons
const WhatsAppIcon = PLATFORM_ICONS.whatsapp;
<WhatsAppIcon size={24} className="text-white" />

// Use labels
const label = PLATFORM_LABELS.whatsapp; // "WhatsApp"
```

### Build a custom share button

```tsx
import { getPlatform, shareToWhatsApp } from "react-sharesheet";

function WhatsAppButton({ url, text }: { url: string; text: string }) {
  const { colors, Icon, label } = getPlatform("whatsapp");
  
  return (
    <button
      onClick={() => shareToWhatsApp(url, text)}
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      <Icon size={20} />
      {label}
    </button>
  );
}
```

## Examples

### Filter platforms

```tsx
// Show only specific platforms
<ShareSheetContent
  shareUrl="..."
  shareText="..."
  show={["copy", "whatsapp", "telegram", "x"]}
/>

// Hide specific platforms
<ShareSheetContent
  shareUrl="..."
  shareText="..."
  hide={["tiktok", "snapchat", "threads"]}
/>
```

### Custom labels

```tsx
<ShareSheetContent
  shareUrl="..."
  shareText="..."
  labels={{
    copy: "Copy Link",
    native: "More options...",
    whatsapp: "Send via WhatsApp",
  }}
/>
```

### With download

```tsx
<ShareSheetDrawer
  shareUrl="https://example.com/post/123"
  shareText="Check out my video!"
  downloadUrl="https://example.com/video.mp4"
  downloadFilename="my-video.mp4"
>
  <button>Share</button>
</ShareSheetDrawer>
```

### Controlled state

```tsx
function ControlledExample() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Open Share Sheet</button>
      <ShareSheetDrawer
        open={open}
        onOpenChange={setOpen}
        shareUrl="..."
        shareText="..."
      >
        <span /> {/* Hidden trigger */}
      </ShareSheetDrawer>
    </>
  );
}
```

## Styling & Tailwind

react-sharesheet ships with a Tailwind-based UI by default.

Tailwind is **only required if you use the prebuilt components**.  
If you don't use Tailwind, you can:

- Use the **headless hook** to build your own UI
- Override all styles via `classNames`
- Use the exposed CSS variables

This makes react-sharesheet easy to integrate into any React stack.

## Requirements

- React 18+
- Tailwind CSS (only for prebuilt components)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © [Gwendall](https://github.com/gwendall)
