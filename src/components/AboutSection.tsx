"use client";

import { Link } from "@/i18n/routing";
import Heading from "./Heading";
import Paragraph from "./Paragraph";
import { Button } from "./ui/button";
import { useTranslations } from "next-intl";
import { FaPaperPlane } from "react-icons/fa";

const AboutSection = () => {
	const t = useTranslations();

	const features = [
		t("Innovation And Development"),
		t("Quality And Precision"),
		t("The Unique Experience"),
		t("Difference And Excellence"),
	];

	return (
		<section
			className="bg-[url('/about-section-2.png')] bg-[#fffcf5] md:bg-contain bg-no-repeat relative py-20"
			id="about"
		>
			<div className="container mx-auto">
				<div className="flex flex-col md:flex-row items-center justify-between gap-8">
					<div className="flex-1 max-w-md">
						<Heading>{t("About Us")}</Heading>
						<Paragraph>
							{t(
								"Whether you're looking for products for personal or commercial use, we offer solutions that meet all needs and requirements"
							)}
							.
						</Paragraph>
						<div className="flex justify-start items-center mt-6">
							<Link href="/about">
								<Button className="bg-primary rounded-full px-8 h-12">
									{t("Know More")}
								</Button>
							</Link>
							<Link href="/about">
								<Button
									size="icon"
									className="bg-primary rounded-full h-12 w-12 ml-0"
								>
									<FaPaperPlane className="h-3 w-3" />
								</Button>
							</Link>
						</div>
					</div>

					{/* Center Image */}
					<div className="flex-1 flex justify-center relative my-6 md:my-0">
						<img
							src="/about-section.webp"
							alt="Colorful straws"
							className="rounded-2xl shadow-lg object-cover"
						/>
						<img
							src="/about-section-3.svg"
							alt="Colorful straws"
							className="absolute top-1/2 -translate-y-1/2 ltr:-right-12 rtl:-left-12"
						/>
					</div>

					<div className="flex-1 flex flex-col gap-10">
						{features.map((feature, idx) => (
							<div
								key={idx}
								className="md:ms-10 md:rtl:ms-20 text-2xl font-semibold bg-gradient-to-r from-red-600 to-indigo-600 bg-clip-text text-transparent"
							>
								{feature}
							</div>
						))}
					</div>
				</div>
				<div className="mt-20 md:mt-28 relative">
					<p className="text-3xl md:text-4xl !leading-relaxed tracking-wide text-[#333] mt-5 text-center">
						{t("More than")}{" "}
						<span className="text-secondary font-bold">
							{t("ten years of experience")}
						</span>{" "}
						{t(
							"in this field, and we achieve our success through close cooperation with credible and powerful manufacturing companies that allow us to pursue the industrialization process directly"
						)}
						.
					</p>
					<div className="absolute ltr:right-0 rtl:left-0 bottom-0 w-1/3">
						<img src="/+10.png" className="w-full" />
					</div>
				</div>
			</div>
		</section>
	);
};

export default AboutSection;
