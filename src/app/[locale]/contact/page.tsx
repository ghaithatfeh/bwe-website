"use client";

import { Suspense } from "react";
import { ContactSection } from "@/components/ContactSection";
import CustomHeroSection from "@/components/CustomHeroSection";
import { PhoneIcon, MailIcon, MapPinIcon } from "lucide-react";
import { useTranslations } from "next-intl";

const ContactPage = () => {
	const t = useTranslations();

	// Contact info data
	const contactInfo = [
		{
			id: 1,
			icon: <PhoneIcon className="w-5 h-5 text-white" />,
			label: t("Phone"),
			value: "+212 696 644 134",
			dir: "ltr",
		},
		{
			id: 2,
			icon: <MailIcon className="w-5 h-5 text-white" />,
			label: t("E-Mail"),
			value: "support@bestworldemballage.com",
			dir: "ltr",
		},
		{
			id: 3,
			icon: <MapPinIcon className="w-5 h-5 text-white" />,
			label: t("Location"),
			value: t("address"),
		},
	];

	return (
		<main className="relative">
			<CustomHeroSection title={t("Contact Us")} imageSrc="/bg-contact.webp" />
			<div className="flex justify-center flex-wrap -mt-8 gap-4 sm:gap-14 lg:gap-32 px-1 absolute left-1/2 -translate-x-1/2 w-full">
				{contactInfo.map((item) => (
					<div key={item.id} className="flex flex-col items-center gap-3">
						<div className="p-4 bg-primary rounded-full border-8 border-white">
							<div className="w-6 h-6 flex items-center justify-center">
								{item.icon}
							</div>
						</div>
						<div className="text-center">
							<p className="font-['Baloo_Bhaina_2',Helvetica] font-normal text-[#333333] text-sm leading-5">
								{item.label}
							</p>
							<p className="font-['Baloo_Bhaina_2',Helvetica] font-semibold text-[#333333] text-base leading-6 w-[12.5rem] break-all">
								<span dir={item.dir} lang={item.dir === "ltr" ? "en" : ""}>{item.value}</span>
							</p>
						</div>
					</div>
				))}
			</div>
			<div className="bg-[url('/contact-page.png')] md:bg-contain bg-no-repeat pt-[26rem] xs:pt-72 md:pt-28">
				<Suspense fallback={<div className="pt-20" />}>
					<ContactSection withIcon={false} />
				</Suspense>
			</div>
		</main>
	);
};

export default ContactPage;

