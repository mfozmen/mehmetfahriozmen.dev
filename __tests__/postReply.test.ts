import { describe, it, expect } from "vitest";
import { replyHref, replySubject, emailSubject } from "@/lib/postReply";

describe("replyHref", () => {
  it("links to the contact form with the post title", () => {
    expect(replyHref("The Map")).toBe("/contact?re=The%20Map");
  });

  it("encodes characters that would break the query string", () => {
    expect(replyHref("A & B? #1")).toBe("/contact?re=A%20%26%20B%3F%20%231");
  });
});

describe("replySubject", () => {
  it("turns the re param into a reply subject", () => {
    expect(replySubject("The Map")).toBe("Re: The Map");
  });

  it("returns null when there is nothing to reply to", () => {
    expect(replySubject(null)).toBeNull();
    expect(replySubject("   ")).toBeNull();
  });

  it("caps a hand-edited param so it cannot flood the subject line", () => {
    expect(replySubject("x".repeat(500))).toBe(`Re: ${"x".repeat(120)}`);
  });
});

describe("emailSubject", () => {
  it("keeps what the reader typed", () => {
    expect(emailSubject("  Re: The Map ", "Ada")).toBe("Re: The Map");
  });

  it("falls back to the sender's name when the optional field is empty", () => {
    expect(emailSubject("", "Ada")).toBe("Message from Ada");
    expect(emailSubject(null, "Ada")).toBe("Message from Ada");
  });

  it("keeps the subject on one line so nothing can pose as an extra header", () => {
    expect(emailSubject("Foo\r\nBcc: x@example.com", "Ada")).toBe("Foo Bcc: x@example.com");
    expect(emailSubject("", "Ada\r\nB")).toBe("Message from Ada B");
  });
});
