"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-hot-toast";

/**
 * When Google/Facebook sign-in fails or is cancelled, Supabase redirects back
 * with `error`/`error_code` in the query string and hash. Show a message and
 * strip them from the URL.
 */
const AuthRedirectError = () => {
	const t = useTranslations("Auth");

	useEffect(() => {
		const query = new URLSearchParams(window.location.search);
		const hash = new URLSearchParams(window.location.hash.slice(1));
		const error = query.get("error") ?? hash.get("error");
		if (!error) return;

		const code = query.get("error_code") ?? hash.get("error_code");
		console.error("Auth redirect error:", code ?? error, query.get("error_description") ?? hash.get("error_description"));
		toast.error(t(code === "user_banned" ? "accountBlocked" : "socialLoginFailed"), { duration: 6000 });

		window.history.replaceState(null, "", window.location.pathname);
	}, [t]);

	return null;
};

export default AuthRedirectError;
