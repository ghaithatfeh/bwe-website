"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { SOCIAL_PROVIDERS } from "@/lib/auth";

const PROVIDERS = {
	google: { label: "continueWithGoogle", icon: <FcGoogle className="!size-5" /> },
	facebook: { label: "continueWithFacebook", icon: <FaFacebook className="!size-5 text-[#1877F2]" /> },
} as const;

/** `next` is the in-site path to return to after sign-in, e.g. "/cart". */
const SocialLogin = ({ next = "/profile" }: { next?: string }) => {
	const t = useTranslations("Auth");
	const locale = useLocale();
	const [pending, setPending] = useState<string | null>(null);

	if (SOCIAL_PROVIDERS.length === 0) return null;

	const signIn = async (provider: keyof typeof PROVIDERS) => {
		setPending(provider);
		const { error } = await supabase.auth.signInWithOAuth({
			provider,
			options: { redirectTo: `${window.location.origin}/${locale}${next.replace(/\/$/, "")}/` },
		});
		// On success the browser is already navigating to the provider.
		if (error) {
			toast.error(t("genericError"));
			setPending(null);
		}
	};

	return (
		<>
			<div className="flex items-center gap-3 text-sm text-gray-500">
				<span className="h-px flex-1 bg-gray-200" />
				{t("or")}
				<span className="h-px flex-1 bg-gray-200" />
			</div>
			<div className="flex flex-col gap-3">
				{SOCIAL_PROVIDERS.map((provider) => (
					<Button
						key={provider}
						type="button"
						variant="outline"
						className="h-12 rounded-full bg-white"
						disabled={pending !== null}
						onClick={() => signIn(provider)}
					>
						{PROVIDERS[provider].icon}
						<span className="mt-1">{t(PROVIDERS[provider].label)}</span>
					</Button>
				))}
			</div>
		</>
	);
};

export default SocialLogin;
