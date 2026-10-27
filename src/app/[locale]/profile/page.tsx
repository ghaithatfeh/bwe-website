"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-hot-toast";
import { BadgeCheck, LogOut } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useSession from "@/hooks/useSession";
import { supabase } from "@/integrations/supabase/client";
import { useRouter } from "@/i18n/routing";
import { formatPhone } from "@/lib/auth";

const inputClassName = "h-12 bg-white rounded-2xl focus:border-[#ffc85b] focus-visible:ring-0";
const labelClassName = "text-sm text-gray-600 ms-1";

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const ProfilePage = () => {
	const t = useTranslations("Auth");
	const router = useRouter();
	const { user, loading: sessionLoading } = useSession();
	const userId = user?.id;

	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [phone, setPhone] = useState("");
	const [form, setForm] = useState({ first_name: "", last_name: "", email: "", address: "" });

	useEffect(() => {
		if (sessionLoading) return;
		if (!userId) {
			router.replace("/account");
			return;
		}

		supabase
			.from("profiles")
			.select("first_name, last_name, phone, email, address")
			.eq("id", userId)
			.single()
			.then(({ data, error }) => {
				if (error) {
					toast.error(t("genericError"));
				} else if (data) {
					setPhone(formatPhone(data.phone));
					setForm({
						first_name: data.first_name,
						last_name: data.last_name,
						email: data.email ?? "",
						address: data.address ?? "",
					});
				}
				setLoading(false);
			});
	}, [userId, sessionLoading]);

	const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
		setForm((f) => ({ ...f, [field]: e.target.value }));

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!user) return;

		const values = {
			first_name: form.first_name.trim(),
			last_name: form.last_name.trim(),
			email: form.email.trim() || null,
			address: form.address.trim() || null,
		};
		if (!values.first_name || !values.last_name) {
			setError(t("nameRequired"));
			return;
		}
		if (values.email && !EMAIL.test(values.email)) {
			setError(t("invalidEmail"));
			return;
		}

		setSaving(true);
		setError(null);
		const { error } = await supabase.from("profiles").update(values).eq("id", user.id);
		setSaving(false);

		if (error) {
			setError(t("genericError"));
		} else {
			toast.success(t("saved"), { className: "p-4 bg-[#fffcf5]" });
		}
	};

	const handleSignOut = async () => {
		await supabase.auth.signOut();
		router.replace("/");
	};

	if (sessionLoading || loading) {
		return (
			<AuthLayout title={t("profile")}>
				<p className="text-center text-gray-500 py-8">{t("loading")}</p>
			</AuthLayout>
		);
	}

	return (
		<AuthLayout title={t("profile")} subtitle={t("profileSubtitle")}>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<div className="flex flex-col gap-1">
					<span className={labelClassName}>{t("phone")}</span>
					{phone ? (
						<div className="h-12 rounded-2xl border bg-gray-50 px-3 flex items-center justify-between">
							<span dir="ltr">{phone}</span>
							<span className="flex items-center gap-1 text-xs text-green-600">
								<BadgeCheck className="w-4 h-4" />
								{t("phoneVerified")}
							</span>
						</div>
					) : (
						<p className="text-sm text-gray-500 ms-1">{t("noPhone")}</p>
					)}
				</div>
				<div className="flex flex-col sm:flex-row gap-4">
					<label className="flex flex-col gap-1 flex-1">
						<span className={labelClassName}>{t("firstName")}</span>
						<Input
							className={inputClassName}
							value={form.first_name}
							onChange={update("first_name")}
							autoComplete="given-name"
							maxLength={100}
							required
						/>
					</label>
					<label className="flex flex-col gap-1 flex-1">
						<span className={labelClassName}>{t("lastName")}</span>
						<Input
							className={inputClassName}
							value={form.last_name}
							onChange={update("last_name")}
							autoComplete="family-name"
							maxLength={100}
							required
						/>
					</label>
				</div>
				<label className="flex flex-col gap-1">
					<span className={labelClassName}>{t("emailOptional")}</span>
					<Input
						className={inputClassName}
						type="email"
						value={form.email}
						onChange={update("email")}
						autoComplete="email"
						dir="ltr"
						maxLength={255}
					/>
				</label>
				<label className="flex flex-col gap-1">
					<span className={labelClassName}>{t("addressOptional")}</span>
					<Textarea
						className="min-h-[100px] bg-white rounded-2xl focus:border-[#ffc85b] focus-visible:ring-0 py-3"
						value={form.address}
						onChange={update("address")}
						autoComplete="street-address"
						maxLength={500}
					/>
				</label>
				{error && (
					<p role="alert" className="text-red-500 text-sm -mt-2 ms-1">
						{error}
					</p>
				)}
				<Button type="submit" variant="primary" className="h-12" disabled={saving}>
					{saving ? t("saving") : t("save")}
				</Button>
				<Button type="button" variant="ghost" className="h-12 rounded-full text-gray-600" onClick={handleSignOut}>
					<LogOut />
					{t("signOut")}
				</Button>
			</form>
		</AuthLayout>
	);
};

export default ProfilePage;
