/**
 * Utility functions for input sanitization and secure serialization
 * to prevent stored/reflected XSS and script injection vulnerabilities.
 */

/**
 * Sanitizes input string by stripping all HTML tags, script elements,
 * style elements, inline on* handlers, and javascript: links.
 * Enforces strictly safe plain-text inputs.
 */
export function sanitizeInput(str: any): string {
  if (str === null || str === undefined) return "";
  if (typeof str !== "string") {
    // If it's a number or boolean, convert to string, otherwise return empty
    if (typeof str === "number" || typeof str === "boolean") {
      return String(str);
    }
    return "";
  }

  // 1. Remove script tags and their contents completely
  let sanitized = str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

  // 2. Remove style blocks and their contents completely to prevent style injections
  sanitized = sanitized.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");

  // 3. Remove dangerous HTML tags (iframe, embed, object, link, meta, style, etc.)
  sanitized = sanitized.replace(/<\/?(iframe|object|embed|style|link|form|input|button|textarea|meta|applet|frame|frameset)[^>]*>/gi, "");

  // 4. Remove on* event handlers (e.g. onclick, onload, onerror)
  sanitized = sanitized.replace(/on\w+\s*=\s*(["'])(.*?)\1/gi, "");

  // 5. De-activate javascript: pseudo-protocol
  sanitized = sanitized.replace(/javascript\s*:/gi, "no-javascript:");

  // 6. Strip all remaining HTML tags to enforce absolute plain text
  sanitized = sanitized.replace(/<\/?[^>]+(>|$)/g, "");

  return sanitized.trim();
}

/**
 * Safely stringifies and unicode-escapes JSON-LD objects for use inside
 * dangerouslySetInnerHTML in Next.js/React inline <script> tags.
 * Prevents Early Script Termination XSS: </script><script>alert('XSS')</script>
 */
export function safeJsonLd(schema: any): string {
  if (!schema) return "{}";
  const jsonString = JSON.stringify(schema);
  // Safely escape characters that can terminate inline scripts or trigger HTML parsers
  return jsonString
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}
