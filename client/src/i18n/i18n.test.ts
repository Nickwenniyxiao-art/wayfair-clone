import { describe, it, expect, beforeEach } from "vitest";
import i18n from "./config";
import en from "./locales/en.json";
import zh from "./locales/zh.json";

describe("i18n Configuration", () => {
  beforeEach(async () => {
    // Reset to English before each test
    await i18n.changeLanguage("en");
  });

  it("should initialize with default language", () => {
    expect(i18n.language).toBeDefined();
  });

  it("should have English translations loaded", () => {
    expect(en).toBeDefined();
    expect(en.common).toBeDefined();
    expect(en.home).toBeDefined();
    expect(en.products).toBeDefined();
    expect(en.cart).toBeDefined();
    expect(en.checkout).toBeDefined();
    expect(en.admin).toBeDefined();
    expect(en.footer).toBeDefined();
  });

  it("should have Chinese translations loaded", () => {
    expect(zh).toBeDefined();
    expect(zh.common).toBeDefined();
    expect(zh.home).toBeDefined();
    expect(zh.products).toBeDefined();
    expect(zh.cart).toBeDefined();
    expect(zh.checkout).toBeDefined();
    expect(zh.admin).toBeDefined();
    expect(zh.footer).toBeDefined();
  });

  it("should have matching keys between English and Chinese", () => {
    const enKeys = Object.keys(en);
    const zhKeys = Object.keys(zh);

    expect(enKeys.sort()).toEqual(zhKeys.sort());

    // Check nested keys
    enKeys.forEach((key) => {
      if (typeof en[key as keyof typeof en] === "object") {
        const enNested = Object.keys(
          en[key as keyof typeof en] as Record<string, unknown>
        ).sort();
        const zhNested = Object.keys(
          zh[key as keyof typeof zh] as Record<string, unknown>
        ).sort();

        expect(enNested).toEqual(
          zhNested,
          `Mismatch in ${key} section`
        );
      }
    });
  });

  it("should have all required translation keys", () => {
    // Common keys
    expect(en.common.language).toBeDefined();
    expect(en.common.search).toBeDefined();
    expect(en.common.cart).toBeDefined();
    expect(en.common.signIn).toBeDefined();

    // Home keys
    expect(en.home.title).toBeDefined();
    expect(en.home.shopNow).toBeDefined();

    // Product keys
    expect(en.products.title).toBeDefined();
    expect(en.products.addToCart).toBeDefined();

    // Cart keys
    expect(en.cart.title).toBeDefined();
    expect(en.cart.proceedToCheckout).toBeDefined();

    // Checkout keys
    expect(en.checkout.title).toBeDefined();
    expect(en.checkout.placeOrder).toBeDefined();

    // Admin keys
    expect(en.admin.dashboard).toBeDefined();
    expect(en.admin.productManagement).toBeDefined();

    // Footer keys
    expect(en.footer.aboutWayfair).toBeDefined();
    expect(en.footer.copyright).toBeDefined();
  });

  it("should have Chinese translations for all English keys", () => {
    const checkTranslations = (obj: any, path = "") => {
      Object.keys(obj).forEach((key) => {
        const fullPath = path ? `${path}.${key}` : key;
        const value = obj[key];

        if (typeof value === "string") {
          // Check that Chinese translation exists
          const zhValue = getNestedValue(zh, fullPath);
          expect(zhValue).toBeDefined(
            `Missing Chinese translation for ${fullPath}`
          );
          expect(typeof zhValue).toBe("string");
        } else if (typeof value === "object" && value !== null) {
          checkTranslations(value, fullPath);
        }
      });
    };

    checkTranslations(en);
  });

  it("should support language switching", async () => {
    // Start with English
    await i18n.changeLanguage("en");
    expect(i18n.language).toBe("en");

    // Switch to Chinese
    await i18n.changeLanguage("zh");
    expect(i18n.language).toBe("zh");

    // Switch back to English
    await i18n.changeLanguage("en");
    expect(i18n.language).toBe("en");
  });

  it("should have non-empty translation strings", () => {
    const checkNonEmpty = (obj: any, path = "") => {
      Object.keys(obj).forEach((key) => {
        const fullPath = path ? `${path}.${key}` : key;
        const value = obj[key];

        if (typeof value === "string") {
          expect(value.length).toBeGreaterThan(
            0,
            `Empty translation at ${fullPath}`
          );
        } else if (typeof value === "object" && value !== null) {
          checkNonEmpty(value, fullPath);
        }
      });
    };

    checkNonEmpty(en);
    checkNonEmpty(zh);
  });
});

/**
 * Helper function to get nested value from object
 */
function getNestedValue(obj: any, path: string): any {
  return path.split(".").reduce((current, prop) => current?.[prop], obj);
}
