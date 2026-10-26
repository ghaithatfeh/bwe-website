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
			<section className="bg-[#fffcf5] pb-20 px-4">
				<Card className="max-w-[480px] mx-auto bg-white rounded-[30px] p-8 shadow-lg -mt-24 relative z-10 flex flex-col gap-6">
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
