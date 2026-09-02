"use client";

import React, { useState } from "react";
import { Drawer } from "vaul";

import { cn } from "./utils";
import { ShareSheetContent } from "./ShareSheetContent";
import { CSS_VARS_UI, CSS_VAR_UI_DEFAULTS, type ShareSheetDrawerProps } from "./types";

// Default class names for drawer
const defaultDrawerClasses = {
  overlay: "fixed inset-0 z-[70]",
  drawer: "flex flex-col rounded-t-[14px] max-h-[90%] fixed bottom-0 left-0 right-0 z-[80] border-t outline-none",
  drawerInner: "p-4 pb-8 rounded-t-[14px] overflow-auto",
  handle: "mx-auto w-12 h-1.5 shrink-0 rounded-full mb-6",
  trigger: "",
};

/**
 * Vaul passes the trigger's button semantics down to whatever element it receives:
 * `type="button"`, `aria-haspopup="dialog"` and `aria-expanded`. Handing it a plain
 * `div` puts button attributes on a non-button, which axe reports as a critical
 * `aria-allowed-attr` violation and which screen readers cannot announce.
 *
 * So the trigger element is the one the caller already provided, usually their own
 * button, with the trigger classes merged in. Only a bare string or a fragment needs a
 * host element, and that host is a real button.
 */
function renderTrigger(children: React.ReactNode, className: string): React.ReactElement {
  if (React.isValidElement(children)) {
    if (!className) return children;
    const childClassName = (children.props as { className?: string }).className;
    return React.cloneElement(children as React.ReactElement<{ className?: string }>, {
      className: cn(childClassName, className),
    });
  }
  return (
    <button type="button" className={className}>
      {children}
    </button>
  );
}

// Helper to create var() with fallback
function cssVar(name: string, fallback: string): string {
  return `var(${name}, ${fallback})`;
}

// Screen reader only styles (inline to avoid Tailwind dependency)
const srOnlyStyle: React.CSSProperties = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  borderWidth: 0,
};

export function ShareSheetDrawer({
  title = "Share",
  shareUrl,
  shareText,
  downloadUrl,
  downloadFilename,
  previewImage,
  shareFile,
  shareFilename,
  disabled,
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  className,
  classNames = {},
  buttonSize,
  iconSize,
  onNativeShare,
  onCopy,
  onDownload,
  hide,
  show,
  labels,
  icons,
}: ShareSheetDrawerProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled
    ? (value: boolean) => controlledOnOpenChange?.(value)
    : setInternalOpen;

  return (
    <Drawer.Root open={open} onOpenChange={setOpen} shouldScaleBackground>
      <Drawer.Trigger asChild>
        {renderTrigger(children, cn(
          defaultDrawerClasses.trigger,
          classNames.trigger,
          disabled ? "pointer-events-none opacity-50" : ""
        ))}
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay
          className={cn(defaultDrawerClasses.overlay, classNames.overlay)}
          style={{
            backgroundColor: cssVar(CSS_VARS_UI.overlayBg, CSS_VAR_UI_DEFAULTS[CSS_VARS_UI.overlayBg]),
          }}
        />
        <Drawer.Content
          className={cn(defaultDrawerClasses.drawer, classNames.drawer)}
          style={{
            backgroundColor: cssVar(CSS_VARS_UI.drawerBg, CSS_VAR_UI_DEFAULTS[CSS_VARS_UI.drawerBg]),
            borderColor: cssVar(CSS_VARS_UI.drawerBorder, CSS_VAR_UI_DEFAULTS[CSS_VARS_UI.drawerBorder]),
          }}
        >
          <Drawer.Title style={srOnlyStyle}>{title}</Drawer.Title>
          <div
            className={cn(defaultDrawerClasses.drawerInner, classNames.drawerInner)}
            style={{
              backgroundColor: cssVar(CSS_VARS_UI.drawerBg, CSS_VAR_UI_DEFAULTS[CSS_VARS_UI.drawerBg]),
            }}
          >
            <div
              className={cn(defaultDrawerClasses.handle, classNames.handle)}
              style={{
                backgroundColor: cssVar(CSS_VARS_UI.handleBg, CSS_VAR_UI_DEFAULTS[CSS_VARS_UI.handleBg]),
              }}
            />

            <ShareSheetContent
              title={title}
              shareUrl={shareUrl}
              shareText={shareText}
              downloadUrl={downloadUrl}
              downloadFilename={downloadFilename}
              previewImage={previewImage}
              shareFile={shareFile}
              shareFilename={shareFilename}
              className={className}
              classNames={classNames}
              buttonSize={buttonSize}
              iconSize={iconSize}
              onNativeShare={() => {
                onNativeShare?.();
                setOpen(false);
              }}
              onCopy={onCopy}
              onDownload={onDownload}
              hide={hide}
              show={show}
              labels={labels}
              icons={icons}
            />
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

// Legacy export for backwards compatibility
/** @deprecated Use ShareSheetDrawer instead */
export const ShareMenuDrawer = ShareSheetDrawer;

