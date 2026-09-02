import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Mock navigator.share
Object.defineProperty(navigator, "share", {
  value: vi.fn(),
  writable: true,
});

// Mock navigator.clipboard
Object.defineProperty(navigator, "clipboard", {
  value: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
  writable: true,
});

// Mock window.open
vi.stubGlobal("open", vi.fn());

// Mock fetch for OG data tests
globalThis.fetch = vi.fn();
