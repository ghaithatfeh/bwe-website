"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { FaWhatsapp } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useRouter } from "@/i18n/routing";
import { OTP_LENGTH, OTP_RESEND_SECONDS, authErrorKey, normalizePhone } from "@/lib/auth";

const inputClassName = "h-12 bg-white rounded-2xl focus:border-[#ffc85b] focus-visible:ring-0";

export type AuthMode = "signin" | "signup";

/**
 * Two steps: collect the phone (plus name when signing up), then verify the
 * code sent on WhatsApp. Sign-up and sign-in only differ in whether Supabase
 * may create the user.
 */
const PhoneOtpForm = ({
	mode,
	onModeChange,
	next = "/profile",
}: {
	mode: AuthMode;
	onModeChange: (mode: AuthMode) => void;
	/** In-site path to go to once verified, e.g. "/cart". */
	next?: string;
}) => {
	const t = useTranslations("Auth");
	const router = useRouter();

	const [step, setStep] = useState<"phone" | "code">("phone");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [phoneInput, setPhoneInput] = useState("");
	const [phone, setPhone] = useState("");
	const [code, setCode] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);
	const [resendIn, setResendIn] = useState(0);

	useEffect(() => {
		if (resendIn <= 0) return;
		const timer = setTimeout(() => setResendIn((s) => s - 1), 1000);
		return () => clearTimeout(timer);
	}, [resendIn]);

	const sendCode = async (toPhone: string) => {
		setSubmitting(true);
		setError(null);

		const { error } = await supabase.auth.signInWithOtp({
			phone: toPhone,
			options: {
				channel: "whatsapp",
				shouldCreateUser: mode === "signup",
				// Only used when the user is created; becomes their profile name.
				data: mode === "signup" ? { first_name: firstName.trim(), last_name: lastName.trim() } : undefined,
			},
		});

		setSubmitting(false);
		if (error) {
			setError(t(authErrorKey(error)));
			return false;
		}
		setResendIn(OTP_RESEND_SECONDS);
		return true;
	};

	const handlePhoneSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (mode === "signup" && (!firstName.trim() || !lastName.trim())) {
			setError(t("nameRequired"));
			return;
		}
		const normalized = normalizePhone(phoneInput);
		if (!normalized) {
			setError(t("invalidPhone"));
			return;
		}

		if (await sendCode(normalized)) {
			setPhone(normalized);
			setCode("");
			setStep("code");
		}
	};

	const handleCodeSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (code.length !== OTP_LENGTH) {
			setError(t("invalidCode"));
			return;
		}

		setSubmitting(true);
		setError(null);
		const { error } = await supabase.auth.verifyOtp({ phone, token: code, type: "sms" });
		setSubmitting(false);

		if (error) {
			setError(t(authErrorKey(error) === "genericError" ? "invalidCode" : authErrorKey(error)));
			return;
		}
		router.replace(next);
	};

	const errorMessage = error && (
		<p role="alert" className="text-red-500 text-sm -mt-2 ms-1">
			{error}
		</p>
	);

	if (step === "code") {
		return (
			<form onSubmit={handleCodeSubmit} className="flex flex-col gap-4">
				<p className="text-[#333333] text-center">
					{t.rich("codeSentTo", {
						phone: () => (
							<span dir="ltr" className="font-semibold whitespace-nowrap">
								{phone}
							</span>
						),
					})}
				</p>
				<Input
					className={`${inputClassName} text-center text-2xl tracking-[0.5em]`}
					placeholder={"•".repeat(OTP_LENGTH)}
					aria-label={t("code")}
					value={code}
					onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, OTP_LENGTH))}
					inputMode="numeric"
					autoComplete="one-time-code"
					dir="ltr"
					autoFocus
				/>
				{errorMessage}
				<Button type="submit" variant="primary" className="h-12" disabled={submitting}>
					{submitting ? t("verifying") : t("verify")}
				</Button>
				<div className="flex items-center justify-between text-sm">
					<button
						type="button"
						className="text-gray-600 hover:text-primary transition-colors"
						onClick={() => {
							setStep("phone");
							setError(null);
						}}
					>
						{t("changeNumber")}
					</button>
					<button
						type="button"
						className="text-primary disabled:text-gray-400 transition-colors"
						disabled={resendIn > 0 || submitting}
						onClick={() => sendCode(phone)}
					>
						{resendIn > 0 ? t("resendIn", { seconds: resendIn }) : t("resend")}
					</button>
				</div>
			</form>
		);
	}

	return (
		<form onSubmit={handlePhoneSubmit} className="flex flex-col gap-4">
			{mode === "signup" && (
				<div className="flex flex-col sm:flex-row gap-4">
					<Input
						className={inputClassName}
						placeholder={t("firstName")}
						aria-label={t("firstName")}
						value={firstName}
						onChange={(e) => setFirstName(e.target.value)}
						autoComplete="given-name"
						maxLength={100}
						required
					/>
					<Input
						className={inputClassName}
						placeholder={t("lastName")}
						aria-label={t("lastName")}
						value={lastName}
						onChange={(e) => setLastName(e.target.value)}
						autoComplete="family-name"
						maxLength={100}
						required
					/>
				</div>
			)}
			<div className="flex flex-col gap-1">
				<Input
					className={`${inputClassName} rtl:text-right`}
					type="tel"
					placeholder={t("phone")}
					aria-label={t("phone")}
					value={phoneInput}
					onChange={(e) => setPhoneInput(e.target.value)}
					autoComplete="tel"
					dir="ltr"
					required
				/>
				<p className="text-xs text-gray-500 ms-1">{t("phoneHint")}</p>
			</div>
			{errorMessage}
			<Button type="submit" variant="primary" className="h-12 " disabled={submitting}>
				<FaWhatsapp className="!size-5" />
				<span className="mt-1">{submitting ? t("sending") : t("sendCode")}</span>
			</Button>
			<p className="text-sm text-center text-gray-600">
				{mode === "signup" ? t("haveAccount") : t("noAccount")}{" "}
				<button
					type="button"
					onClick={() => onModeChange(mode === "signup" ? "signin" : "signup")}
					className="text-primary font-semibold hover:underline"
				>
					{mode === "signup" ? t("signIn") : t("signUp")}
				</button>
			</p>
		</form>
	);
};

export default PhoneOtpForm;
