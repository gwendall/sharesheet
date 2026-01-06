# @gwendall/share-menu

[![npm version](https://img.shields.io/npm/v/@gwendall/share-menu.svg)](https://www.npmjs.com/package/@gwendall/share-menu)
[![npm downloads](https://img.shields.io/npm/dm/@gwendall/share-menu.svg)](https://www.npmjs.com/package/@gwendall/share-menu)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A beautiful, fully customizable share menu component for React. Supports 15+ social platforms with a modern drawer UI, CSS variable theming, and headless mode for complete control.

## ✨ Features

- 🎨 **Fully themeable** — CSS variables + Tailwind class overrides
- 🧩 **Headless mode** — Use the hook to build your own UI
- 📱 **Mobile-first** — Beautiful drawer with native share API support
- 🔧 **Customizable** — Hide/show platforms, custom labels & icons
- 📦 **Tree-shakeable** — Import only what you need
- 🌐 **15+ platforms** — WhatsApp, X, Telegram, Instagram, and more

## 📦 Installation

```bash
npm install @gwendall/share-menu
# or
pnpm add @gwendall/share-menu
# or
yarn add @gwendall/share-menu
```

### Peer Dependencies

```bash
npm install react react-dom
```

### Tailwind CSS Setup

Add the package to your `tailwind.config.js` content array:

```js
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@gwendall/share-menu/dist/**/*.{js,mjs}", // 👈 Add this
  ],
  // ...
}
```

## 🚀 Quick Start

### Full Drawer (recommended)

```tsx
import { ShareMenuDrawer } from "@gwendall/share-menu";

function App() {
  return (
    <ShareMenuDrawer
      title="Share this!"
      shareUrl="https://example.com"
      shareText="Check out this awesome page!"
    >
      <button>Share</button>
    </ShareMenuDrawer>
  );
}
```

### Content Only (for custom modals)

```tsx
import { ShareMenuContent } from "@gwendall/share-menu/content";

function CustomModal() {
  return (
    <Dialog>
      <ShareMenuContent
        shareUrl="https://example.com"
        shareText="Check this out!"
      />
    </Dialog>
  );
}
```

### Headless (full control)

```tsx
import { useShareMenu } from "@gwendall/share-menu/headless";

function CustomShareUI() {
  const {
    canNativeShare,
    copied,
    copyLink,
    nativeShare,
    shareWhatsApp,
    shareX,
  } = useShareMenu({
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

## 🖼️ Content Preview

The share menu can display a preview of the content being shared. It automatically detects the content type based on the URL and displays an appropriate preview.

### Auto-detection

```tsx
// Image preview (detected from extension)
<ShareMenuDrawer preview="https://example.com/image.png" {...props} />

// Video preview (detected from extension)
<ShareMenuDrawer preview="https://example.com/video.mp4" {...props} />

// Audio file (shows icon + filename)
<ShareMenuDrawer preview="https://example.com/song.mp3" {...props} />

// Link (shows link icon + URL)
<ShareMenuDrawer preview="https://example.com/page" {...props} />
```

### Explicit Type

```tsx
// Force image type (e.g., for API endpoints)
<ShareMenuDrawer
  preview={{ url: "/api/og?id=123", type: "image" }}
  {...props}
/>

// Video with poster image
<ShareMenuDrawer
  preview={{
    url: "https://example.com/video.mp4",
    type: "video",
    poster: "https://example.com/thumbnail.jpg"
  }}
  {...props}
/>

// File with custom filename
<ShareMenuDrawer
  preview={{
    url: "https://example.com/doc.pdf",
    type: "file",
    filename: "Report Q4 2024.pdf"
  }}
  {...props}
/>
```

### PreviewConfig

```ts
interface PreviewConfig {
  url: string;              // URL of the content
  type?: PreviewType;       // "image" | "video" | "audio" | "file" | "link" | "auto"
  filename?: string;        // Display name for file/audio types
  alt?: string;             // Alt text for images
  poster?: string;          // Poster image for videos
}
```

### Supported Formats

- **Images**: jpg, jpeg, png, gif, webp, svg, bmp, ico, avif
- **Videos**: mp4, webm, mov, avi, mkv, m4v, ogv
- **Audio**: mp3, wav, ogg, m4a, aac, flac, wma

## 🎨 Theming

### CSS Variables

Override these variables to match your theme:

```css
:root {
  /* Drawer */
  --share-menu-overlay-bg: rgba(0, 0, 0, 0.7);
  --share-menu-drawer-bg: #09090b;
  --share-menu-drawer-border: #27272a;
  --share-menu-handle-bg: #27272a;
  
  /* Typography */
  --share-menu-title-color: #ffffff;
  --share-menu-subtitle-color: #a1a1aa;
  --share-menu-button-label-color: #ffffff;
  
  /* Image Preview */
  --share-menu-preview-bg: rgba(255, 255, 255, 0.05);
  --share-menu-preview-shimmer: rgba(255, 255, 255, 0.1);
  
  /* Platform colors (optional - defaults to brand colors) */
  --share-menu-whatsapp-bg: #25D366;
  --share-menu-telegram-bg: #229ED9;
  /* ... see full list below */
}

/* Dark/Light mode support */
.dark {
  --share-menu-drawer-bg: #0a0a0a;
}

.light {
  --share-menu-drawer-bg: #ffffff;
  --share-menu-title-color: #09090b;
}
```

<details>
<summary>All CSS Variables</summary>

```css
/* Drawer */
--share-menu-overlay-bg: rgba(0, 0, 0, 0.7);
--share-menu-drawer-bg: #09090b;
--share-menu-drawer-border: #27272a;
--share-menu-handle-bg: #27272a;

/* Typography */
--share-menu-title-color: #ffffff;
--share-menu-subtitle-color: #a1a1aa;
--share-menu-button-label-color: #ffffff;

/* Image Preview */
--share-menu-preview-bg: rgba(255, 255, 255, 0.05);
--share-menu-preview-shimmer: rgba(255, 255, 255, 0.1);

/* Platform backgrounds */
--share-menu-native-share-bg: #7c3aed;
--share-menu-copy-bg: #3b82f6;
--share-menu-download-bg: #ef4444;
--share-menu-whatsapp-bg: #25D366;
--share-menu-telegram-bg: #229ED9;
--share-menu-instagram-bg: #E1306C;
--share-menu-facebook-bg: #1877F2;
--share-menu-snapchat-bg: #FFFC00;
--share-menu-sms-bg: #22c55e;
--share-menu-email-bg: #f97316;
--share-menu-linkedin-bg: #0A66C2;
--share-menu-reddit-bg: #FF4500;
--share-menu-x-bg: #000000;
--share-menu-tiktok-bg: #000000;
--share-menu-threads-bg: #000000;
```

</details>

### Tailwind Class Overrides

Override any part of the component with `classNames`:

```tsx
<ShareMenuDrawer
  shareUrl="..."
  shareText="..."
  classNames={{
    // Drawer
    overlay: "bg-black/80 backdrop-blur-sm",
    drawer: "bg-background rounded-t-3xl",
    drawerInner: "p-6",
    handle: "bg-muted",
    
    // Content
    root: "max-w-lg",
    header: "mb-6",
    title: "text-3xl font-bold text-foreground",
    subtitle: "text-muted-foreground",
    grid: "gap-6",
    button: "w-20",
    buttonIcon: "rounded-xl shadow-lg",
    buttonLabel: "font-medium",
  }}
>
```

## ⚙️ API Reference

### Props

#### ShareMenuContent / ShareMenuDrawer

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `"Share"` | Title displayed at the top |
| `shareUrl` | `string` | **required** | URL to share |
| `shareText` | `string` | **required** | Text to share |
| `preview` | `string \| PreviewConfig` | — | Preview of content (see Preview section below) |
| `downloadUrl` | `string` | — | URL for download button |
| `downloadFilename` | `string` | — | Filename for download |
| `className` | `string` | — | Class for root container |
| `classNames` | `object` | — | Override sub-component classes |
| `buttonSize` | `number` | `45` | Button size in pixels |
| `iconSize` | `number` | `22` | Icon size in pixels |
| `show` | `ShareOption[]` | — | Only show these platforms |
| `hide` | `ShareOption[]` | — | Hide these platforms |
| `labels` | `object` | — | Custom button labels |
| `icons` | `object` | — | Custom button icons |
| `onNativeShare` | `() => void` | — | Native share callback |
| `onCopy` | `() => void` | — | Copy callback |
| `onDownload` | `() => void` | — | Download callback |

#### ShareMenuDrawer (additional)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | **required** | Trigger element |
| `disabled` | `boolean` | `false` | Disable the trigger |
| `open` | `boolean` | — | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | — | Open state callback |

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

### useShareMenu Hook

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
} = useShareMenu({
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

## 📦 Exports

```ts
// Everything
import { 
  ShareMenuDrawer, 
  ShareMenuContent,
  useShareMenu,
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
} from "@gwendall/share-menu";

// Content only (smaller bundle)
import { ShareMenuContent } from "@gwendall/share-menu/content";

// Drawer only
import { ShareMenuDrawer } from "@gwendall/share-menu/drawer";

// Headless (smallest bundle - no UI components)
import { 
  useShareMenu, 
  PLATFORM_COLORS,
  PLATFORM_ICONS,
  getPlatform,
  shareToWhatsApp, 
  shareToX,
  // ...
} from "@gwendall/share-menu/headless";
```

## 🎨 Platform Utilities

Access platform colors, icons, and labels for custom UIs:

```tsx
import { 
  PLATFORM_COLORS, 
  PLATFORM_ICONS, 
  PLATFORM_LABELS,
  getPlatform,
  getAllPlatforms,
} from "@gwendall/share-menu";

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
import { getPlatform, shareToWhatsApp } from "@gwendall/share-menu";

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

## 🛠 Examples

### Filter platforms

```tsx
// Show only specific platforms
<ShareMenuContent
  shareUrl="..."
  shareText="..."
  show={["copy", "whatsapp", "telegram", "x"]}
/>

// Hide specific platforms
<ShareMenuContent
  shareUrl="..."
  shareText="..."
  hide={["tiktok", "snapchat", "threads"]}
/>
```

### Custom labels

```tsx
<ShareMenuContent
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
<ShareMenuDrawer
  shareUrl="https://example.com/post/123"
  shareText="Check out my video!"
  downloadUrl="https://example.com/video.mp4"
  downloadFilename="my-video.mp4"
>
  <button>Share</button>
</ShareMenuDrawer>
```

### Controlled state

```tsx
function ControlledExample() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Open Share Menu</button>
      <ShareMenuDrawer
        open={open}
        onOpenChange={setOpen}
        shareUrl="..."
        shareText="..."
      >
        <span /> {/* Hidden trigger */}
      </ShareMenuDrawer>
    </>
  );
}
```

## 📋 Requirements

- React 18+
- Tailwind CSS (for default styling)

> **Note:** If you're not using Tailwind, you can use the headless hook to build your own UI, or override all classes via `classNames`.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT © [Gwendall Esnault](https://github.com/gwendall)
