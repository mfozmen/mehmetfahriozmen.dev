import { describe, it, expect } from "vitest";
import { EMAIL_REGEX } from "@/components/contact/ContactForm";

describe("EMAIL_REGEX", () => {
  describe("valid emails", () => {
    const valid = [
      "user@example.com",
      "user.name@example.com",
      "user+tag@example.com",
      "user@sub.domain.com",
      "firstname.lastname@company.co.uk",
      "user123@example.org",
      "user@example.io",
      "a@b.co",
      "test@test-domain.com",
      "user@123.123.123.com",
      "user!def@example.com",
      "user#abc@example.com",
    ];

    valid.forEach((email) => {
      it(`accepts "${email}"`, () => {
        expect(EMAIL_REGEX.test(email)).toBe(true);
      });
    });
  });

  describe("invalid emails", () => {
    const invalid = [
      "",
      "plaintext",
      "@no-local.com",
      "user@",
      "user@.com",
      "user @example.com",
      "user@ example.com",
      "user@exam ple.com",
      "@",
      "user@@example.com",
      "user@.example.com",
    ];

    invalid.forEach((email) => {
      it(`rejects "${email}"`, () => {
        expect(EMAIL_REGEX.test(email)).toBe(false);
      });
    });
  });

  describe("ReDoS resistance", () => {
    it("handles long input without hanging", () => {
      const start = performance.now();
      const malicious = "a".repeat(10000) + "@" + "b".repeat(10000);
      EMAIL_REGEX.test(malicious);
      const elapsed = performance.now() - start;
      expect(elapsed).toBeLessThan(100);
    });

    it("handles repeated dots without hanging", () => {
      const start = performance.now();
      const malicious = "user@" + "a.".repeat(5000) + "com";
      EMAIL_REGEX.test(malicious);
      const elapsed = performance.now() - start;
      expect(elapsed).toBeLessThan(100);
    });
  });
});
