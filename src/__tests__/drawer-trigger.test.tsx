import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { ShareSheetDrawer } from "../ShareSheetDrawer";

describe("ShareSheetDrawer trigger", () => {
  it("puts the button semantics on the caller's own button, not on a wrapper div", () => {
    render(
      <ShareSheetDrawer shareUrl="https://example.com" shareText="hello">
        <button type="button" data-testid="opener">Share</button>
      </ShareSheetDrawer>,
    );

    const opener = screen.getByTestId("opener");
    expect(opener.tagName).toBe("BUTTON");
    expect(opener).toHaveAttribute("aria-haspopup", "dialog");
    // Le défaut corrigé : ces attributs atterrissaient sur un div, ce qu'axe signale en
    // critique et qu'aucun lecteur d'écran ne sait annoncer.
    expect(document.querySelector("div[aria-haspopup]")).toBeNull();
    expect(document.querySelector("div[aria-expanded]")).toBeNull();
  });

  it("still gives a bare string a real button to live in", () => {
    render(
      <ShareSheetDrawer shareUrl="https://example.com" shareText="hello">
        Share this
      </ShareSheetDrawer>,
    );

    const opener = screen.getByText("Share this");
    expect(opener.tagName).toBe("BUTTON");
    expect(opener).toHaveAttribute("type", "button");
  });

  it("merges the trigger class into the caller's element instead of wrapping it", () => {
    render(
      <ShareSheetDrawer
        shareUrl="https://example.com"
        shareText="hello"
        classNames={{ trigger: "trigger-class" }}
      >
        <button type="button" className="mine" data-testid="opener">Share</button>
      </ShareSheetDrawer>,
    );

    const opener = screen.getByTestId("opener");
    expect(opener.className).toContain("mine");
    expect(opener.className).toContain("trigger-class");
  });
});
