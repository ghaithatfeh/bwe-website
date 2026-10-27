import React from "react";
import CustomHeroSection from "@/components/CustomHeroSection";
import { Card } from "@/components/ui/card";

const AuthLayout = ({
	title,
	subtitle,
	children,
}: {
	title: string;
	subtitle?: string;
	children: React.ReactNode;
}) => {
	return (
		<main>
			<CustomHeroSection title={title} imageSrc="/bg-contact.webp" />
			<section className="bg-[url('/contact-page.png')] py-16 px-4">
				<Card className="max-w-[480px] mx-auto bg-[#fffcf5] rounded-[30px] p-8 gap-8 shadow-lg relative z-10 flex flex-col">
					{subtitle && (
						<p className="font-['Baloo_Bhaina_2',Helvetica] text-[#333333] text-base leading-6 text-center">
							{subtitle}
						</p>
					)}
					{children}
				</Card>
			</section>
		</main>
	);
};

export default AuthLayout;
