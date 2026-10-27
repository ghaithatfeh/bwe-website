"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import AuthLayout from "@/components/auth/AuthLayout";
import PhoneOtpForm, { type AuthMode } from "@/components/auth/PhoneOtpForm";
import SocialLogin from "@/components/auth/SocialLogin";
import useSession from "@/hooks/useSession";
import { useRouter } from "@/i18n/routing";

const AccountPage = () => {
	const t = useTranslations("Auth");
	const router = useRouter();
	const { user } = useSession();
	const [mode, setMode] = useState<AuthMode>("signin");

	useEffect(() => {
		if (user) router.replace("/profile");
	}, [user, router]);

	return (
		<AuthLayout title={mode === "signup" ? t("signUp") : t("signIn")}>
			<AnimatePresence mode="wait" initial={false}>
				<motion.div
					key={mode}
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -12 }}
					transition={{ duration: 0.2, ease: "easeOut" }}
					className="flex flex-col gap-8"
				>
					<p className="font-['Baloo_Bhaina_2',Helvetica] text-[#333333] text-base leading-6 text-center">
						{mode === "signup" ? t("signUpSubtitle") : t("signInSubtitle")}
					</p>
					<PhoneOtpForm mode={mode} onModeChange={setMode} />
				</motion.div>
			</AnimatePresence>
			<SocialLogin />
		</AuthLayout>
	);
};

export default AccountPage;
