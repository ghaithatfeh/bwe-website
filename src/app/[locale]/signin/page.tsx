"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import AuthLayout from "@/components/auth/AuthLayout";
import PhoneOtpForm from "@/components/auth/PhoneOtpForm";
import SocialLogin from "@/components/auth/SocialLogin";
import useSession from "@/hooks/useSession";
import { useRouter } from "@/i18n/routing";

const SignInPage = () => {
	const t = useTranslations("Auth");
	const router = useRouter();
	const { user } = useSession();

	useEffect(() => {
		if (user) router.replace("/profile");
	}, [user, router]);

	return (
		<AuthLayout title={t("signIn")} subtitle={t("signInSubtitle")}>
			<PhoneOtpForm mode="signin" />
			<SocialLogin />
		</AuthLayout>
	);
};

export default SignInPage;
