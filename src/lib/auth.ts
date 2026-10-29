import type { AuthError, Provider } from "@supabase/supabase-js";

/** Numbers typed in local format (06…) are assumed to be Moroccan. */
const DEFAULT_COUNTRY_CODE = "212";

const E164 = /^\+[1-9]\d{7,14}$/;

/**
 * Turns user input like "06 12 34 56 78", "00212612345678" or
 * "+33 6 12 34 56 78" into E.164 ("+212612345678"), or null if invalid.
 */
export function normalizePhone(input: string): string | null {
	let phone = input.replace(/[\s\-().]/g, "");

	if (phone.startsWith("00")) phone = `+${phone.slice(2)}`;
	else if (phone.startsWith("0")) phone = `+${DEFAULT_COUNTRY_CODE}${phone.slice(1)}`;
	else if (!phone.startsWith("+")) phone = `+${phone}`;

	return E164.test(phone) ? phone : null;
}

/** Supabase stores phones without the leading "+". */
export function formatPhone(phone: string | null | undefined): string {
	if (!phone) return "";
	return phone.startsWith("+") ? phone : `+${phone}`;
}

/**
 * Where to go after signing in, from the `?next=` query param. Only
 * locale-less in-site paths like "/cart" are accepted, never other origins.
 */
export function safeNextPath(next: string | null | undefined, fallback = "/profile"): string {
	if (!next || !/^\/[a-z0-9\-/]*$/i.test(next) || next.startsWith("//")) return fallback;
	return next;
}

export const OTP_LENGTH = 6;

/** Supabase only allows one OTP per number every 60 seconds by default. */
export const OTP_RESEND_SECONDS = 60;

/**
 * Social providers to show. Enable them in Supabase (Auth > Providers)
 * first, then list them in NEXT_PUBLIC_AUTH_PROVIDERS, e.g. "google,facebook".
 */
export const SOCIAL_PROVIDERS = (process.env.NEXT_PUBLIC_AUTH_PROVIDERS ?? "")
	.split(",")
	.map((p) => p.trim())
	.filter((p): p is "google" | "facebook" => p === "google" || p === "facebook") satisfies Provider[];

/** Maps Supabase auth errors to keys in the `Auth` messages namespace. */
export function authErrorKey(error: AuthError): string {
	switch (error.code) {
		// Returned when shouldCreateUser is false and the number is unknown.
		case "otp_disabled":
			return "accountNotFound";
		case "otp_expired":
			return "invalidCode";
		case "user_banned":
			return "accountBlocked";
		case "over_sms_send_rate_limit":
		case "over_request_rate_limit":
			return "tooManyRequests";
		case "validation_failed":
			return "invalidPhone";
		default:
			return "genericError";
	}
}
