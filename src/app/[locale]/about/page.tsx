"use client";

import CustomHeroSection from "@/components/CustomHeroSection";
import Heading from "@/components/Heading";
import PageEnd from "@/components/PageEnd";
import WorkSection from "@/components/WorkSection";
import { useTranslations } from "next-intl";

const AboutPage = () => {
	const t = useTranslations();

	return (
		<main>
			<CustomHeroSection title={t("About Us")} imageSrc="/bg-about.webp" />
			<section className="py-16 bg-[#fffcf5]">
				<div className="container mx-auto flex flex-col xl:flex-row gap-[75px] rtl:gap-[85px] justify-between xl:rtl:flex-row-reverse">
					<div className="max-w-full xl:max-w-[22rem]">
						<h4 className="tracking-[6px] text-gray-500 mb-2 leading-10">
							{t("ABOUT US")}
						</h4>
						<Heading>{t("Our Mission")}</Heading>
						<p className="text-gray-600 mb-8 tracking-wide leading-7">
							{t("We aspire to become the first choice")}
						</p>
						<div className="flex gap-8 xl:mt-14">
							<div>
								<span className="font-bold text-2xl text-gray-900">+10</span>
								<div className="text-gray-700">{t("Year of experience")}</div>
							</div>
							<div>
								<span className="font-bold text-2xl text-gray-900">+40</span>
								<div className="text-gray-700">{t("Satisficed clients")}</div>
							</div>
						</div>
					</div>

					<div className="w-full flex relative flex-col md:flex-row pl-8 xl:pl-0 pr-4 md:pr-8 lg:pr-0">
						<div className="w-full" dir="ltr">
							<div>
								<img
									src="/about-img.jpeg"
									alt="about-1"
									className="h-[150px] w-full rounded-2xl mb-5 object-cover object-left-top"
								/>
							</div>
							<div>
								<img
									src="/about-img-2.jpeg"
									alt="about-1"
									className="h-[210px] w-1/2 rounded-2xl mb-5 object-cover object-[0%_55%]"
								/>
							</div>
							<div>
								<img
									src="/about-img-3.jpeg"
									alt="about-1"
									className="h-[180px] w-1/4 rounded-xl -mt-24 -ml-12 object-cover object-bottom outline outline-[20px] outline-[#fffcf5]"
								/>
							</div>
							<div className="absolute bottom-[30px] left-[140px] rtl:px-6 flex flex-col gap-2 items-center bg-red-700 p-4 rounded-2xl">
								<span className="text-2xl text-white">100+</span>
								<span className="text-white">{t("Employees")}</span>
							</div>
						</div>

						<div className="max-w-sm lg:absolute top-[33%] right-12 xl:-right-4 bg-[url('/bg-vision.webp')] bg-cover bg-center hidden lg:block">
							<h4 className="tracking-[6px] text-gray-500 mb-2 leading-10">
								{t("ABOUT US")}
							</h4>
							<Heading>{t("Our Vision")}</Heading>
							<p className="text-gray-600 mb-8 tracking-wide leading-7">
								{t("For us at BWE")}
							</p>
						</div>
					</div>

					<div className="bg-[url('/bg-vision.webp')] bg-contain bg-no-repeat ltr:bg-left rtl:bg-right lg:hidden">
						<h4 className="tracking-[6px] text-gray-500 mb-2 leading-10">
							{t("ABOUT US")}
						</h4>
						<Heading>{t("Our Vision")}</Heading>
						<p className="text-gray-600 mb-8 tracking-wide leading-7">
							{t("For us at BWE")}
						</p>
					</div>
				</div>
			</section>
			<WorkSection />
			<PageEnd
				text={t(
					"Whether you're looking for products for personal or commercial use, we offer solutions that meet all needs and requirements"
				) + "."}
				btnLabel={t("Discover Products")}
				btnLink="/products"
			/>
		</main>
	);
};

export default AboutPage;
