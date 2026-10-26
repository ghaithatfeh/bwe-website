"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import AuthLayout from "@/components/auth/AuthLayout";
import PhoneOtpForm from "@/components/auth/PhoneOtpForm";
import SocialLogin from "@/components/auth/SocialLogin";
import useSession from "@/hooks/useSession";
import { useRouter } from "@/i18n/routing";

const SignUpPage = () => {
	const t = useTranslations("Auth");
	const router = useRouter();
	const { user } = useSession();

	useEffect(() => {
		if (user) router.replace("/profile");
	}, [user, router]);

	return (
		<AuthLayout title={t("signUp")} subtitle={t("signUpSubtitle")}>
			<PhoneOtpForm mode="signup" />
			<SocialLogin />
		</AuthLayout>
	);
};

export default SignUpPage;
