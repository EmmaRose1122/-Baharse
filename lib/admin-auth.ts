export const ADMIN_COOKIE_NAME = "baharse_admin_session";

interface TokenPayload {
  email: string;
  iat: number;
  exp: number;
}

const encoder = new TextEncoder();

/**
 * Gets secret key string from environment or secure fallback
 */
function getSecretKeyString(): string {
  return (
    process.env.ADMIN_SECRET_KEY ||
    "baharse_fallback_secret_key_8493721092834710928347120938471"
  );
}

/**
 * Creates Web Crypto HMAC key
 */
async function getHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/**
 * Converts ArrayBuffer to Hex string
 */
function bufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, "0");
  }
  return hex;
}

/**
 * Constant-time string comparison to prevent timing attacks
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Checks if an email is an authorized admin email
 */
export function isAuthorizedAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const cleanEmail = email.trim().toLowerCase();

  const primaryAdmin = (process.env.ADMIN_EMAIL || "admin@baharse.pk").trim().toLowerCase();
  if (cleanEmail === primaryAdmin) return true;

  const allowedList = (process.env.ADMIN_ALLOWED_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  return allowedList.includes(cleanEmail);
}

/**
 * Checks email & password against configured environment secrets
 */
export function verifyAdminCredentials(email?: string, password?: string): boolean {
  if (!email || !password) return false;

  const configEmail = (process.env.ADMIN_EMAIL || "admin@baharse.pk").trim().toLowerCase();
  const configPassword = process.env.ADMIN_PASSWORD || "BaharSe@SecureAdmin2026!";

  const inputEmail = email.trim().toLowerCase();

  if (inputEmail === configEmail && password === configPassword) {
    return true;
  }

  return false;
}

/**
 * Signs an admin session token (Valid for 7 days)
 */
export async function signAdminToken(email: string): Promise<string> {
  const payload: TokenPayload = {
    email: email.trim().toLowerCase(),
    iat: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  const payloadBase64 = btoa(JSON.stringify(payload));
  const secret = getSecretKeyString();
  const key = await getHmacKey(secret);
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payloadBase64)
  );
  const signatureHex = bufferToHex(signatureBuffer);

  return `${payloadBase64}.${signatureHex}`;
}

/**
 * Verifies an admin session token
 */
export async function verifyAdminToken(
  token?: string | null
): Promise<{ valid: boolean; email?: string }> {
  if (!token || typeof token !== "string") {
    return { valid: false };
  }

  const parts = token.split(".");
  if (parts.length !== 2) {
    return { valid: false };
  }

  const [payloadBase64, providedSig] = parts;

  try {
    const secret = getSecretKeyString();
    const key = await getHmacKey(secret);
    const expectedSigBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(payloadBase64)
    );
    const expectedSigHex = bufferToHex(expectedSigBuffer);

    if (!timingSafeEqual(providedSig, expectedSigHex)) {
      return { valid: false };
    }

    const payloadJson = atob(payloadBase64);
    const payload: TokenPayload = JSON.parse(payloadJson);

    // Check expiration
    if (Date.now() > payload.exp) {
      return { valid: false };
    }

    // Check if email is in authorized list
    if (!isAuthorizedAdminEmail(payload.email)) {
      return { valid: false };
    }

    return { valid: true, email: payload.email };
  } catch {
    return { valid: false };
  }
}
