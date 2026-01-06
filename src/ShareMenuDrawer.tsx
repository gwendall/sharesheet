"use client";

import { useState } from "react";
import { Drawer } from "vaul";

import { cn } from "./utils";
import { ShareMenuContent } from "./ShareMenuContent";
import { CSS_VARS_UI, CSS_VAR_UI_DEFAULTS, type ShareMenuDrawerProps } from "./types";

// Default class names for drawer
const defaultDrawerClasses = {
  overlay: "fixed inset-0 z-[70]",
  drawer: "flex flex-col rounded-t-[14px] h-[70%] mt-24 fixed bottom-0 left-0 right-0 z-[80] border-t outline-none",
  drawerInner: "p-4 rounded-t-[14px] flex-1 overflow-auto",
  handle: "mx-auto w-12 h-1.5 shrink-0 rounded-full mb-6",
  trigger: "",
};

// Helper to create var() with fallback
function cssVar(name: string, fallback: string): string {
  return `var(${name}, ${fallback})`;
}

export function ShareMenuDrawer({
  title = "Share",
  shareUrl,
  shareText,
  downloadUrl,
  downloadFilename,
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
}: ShareMenuDrawerProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled
    ? (value: boolean) => controlledOnOpenChange?.(value)
    : setInternalOpen;

  return (
    <Drawer.Root open={open} onOpenChange={setOpen} shouldScaleBackground>
      <Drawer.Trigger asChild>
        <div
          className={cn(
            defaultDrawerClasses.trigger,
            classNames.trigger,
            disabled ? "pointer-events-none opacity-50" : ""
          )}
        >
          {children}
        </div>
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
          <Drawer.Title className="sr-only">{title}</Drawer.Title>
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

            <ShareMenuContent
              title={title}
              shareUrl={shareUrl}
              shareText={shareText}
              downloadUrl={downloadUrl}
              downloadFilename={downloadFilename}
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
