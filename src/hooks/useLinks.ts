import { usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";

const useLinks = () => {
	const pathname = usePathname();
	const t = useTranslations();

	const navLinks = [
		{
			name: t("Home"),
			href: "/",
			active: pathname === "/",
		},
		{
			name: t("About Us"),
			href: "/about",
			active: pathname.startsWith("/about"),
		},
		{
			name: t("Products"),
			href: "/products",
			active: pathname.startsWith("/products"),
		},
		{
			name: t("Contact Us"),
			href: "/contact",
			active: pathname.startsWith("/contact"),
		},
	];

	const socialLinks = {
		facebook: "https://www.facebook.com/profile.php?id=100076417875791",
		whatsapp: "https://wa.me/212696644134",
		instagram: "https://www.instagram.com/best.world.emballage?igsi=MXhwMHBqazdsMGRrZw%3D%3D&utm_source=qr",
	};

	return { navLinks, socialLinks };
};

export default useLinks;
