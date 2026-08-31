'use client'

import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Link, usePathname } from "@/i18n/routing";
import { FaFacebook, FaInstagram, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { GrLanguage } from "react-icons/gr";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { MenuIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import useLinks from "@/hooks/useLinks";

const Header = () => {
	const locale = useLocale();
	const t = useTranslations();
	const pathname = usePathname();

	const { navLinks, socialLinks } = useLinks();

	return (
		<header className="bg-transparent absolute top-0 left-0 w-full z-50">
			<div className="container mx-auto flex items-center justify-between py-4">
				<Link href="/" className="-ms-2">
					<img src="/logo.svg" alt="logo" />
				</Link>
				<nav className="hidden md:block">
					<ul className="flex items-center gap-6 lg:gap-12">
						{navLinks.map((item) => (
							<li key={item.name} className="flex items-center gap-2">
								{item.active && (
									<svg
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										className="mb-1.5"
									>
										<path
											d="M21.7046 20.6382L21.7119 20.6353C21.7119 20.6353 16.4868 15.3325 15.9741 14.8198C15.6563 14.7261 13.7974 13.9087 13.7652 12.3721C14.5584 11.4632 15.7119 10.5901 17.4155 10.5729C17.4184 10.5714 17.4272 10.5707 17.4317 10.5707C18.2022 10.5916 18.98 10.3359 19.5989 9.79506C19.6421 9.75699 19.7439 9.65335 19.7439 9.65335L24.0001 4.28949L23.4888 3.77642L18.282 9.28899L17.6676 8.67266L23.0267 3.3139L22.5762 2.86602L17.1856 8.25775L16.6758 7.74758L22.0671 2.35585L21.5713 1.86106L16.18 7.2521L15.5757 6.64895L21.1406 1.42824L20.6733 0.960938L15.5449 4.9563C15.5449 4.9563 15.359 5.11302 15.2945 5.17826C14.5906 5.88177 14.2881 6.83648 14.3892 7.75602C14.3181 8.92242 13.941 9.78851 13.4517 10.4469C3.89097 1.09351 0.285626 2.09399 0.285626 2.09399L0 2.38365C0 2.38365 6.42883 8.83007 10.4011 12.8101C9.00735 14.2053 2.2881 20.9246 2.2881 20.9246L2.28879 20.926C2.28293 20.9318 2.27562 20.9341 2.26868 20.9414C1.78859 21.4218 1.79041 22.1997 2.26944 22.6794C2.74878 23.1591 3.52888 23.1591 4.00709 22.6808C4.01478 22.6735 4.01699 22.6655 4.0214 22.6611L4.02285 22.6625C4.02285 22.6625 10.7505 15.9368 12.1363 14.5517C12.8628 15.279 13.3477 15.7646 13.4429 15.8598C14.0318 16.4517 19.96 22.3798 19.96 22.3798H19.9673C19.9673 22.3872 19.9739 22.3938 19.9805 22.3967C20.4595 22.8794 21.2461 22.8794 21.7244 22.3967C22.21 21.9184 22.21 21.1347 21.7244 20.6528C21.7185 20.6455 21.7119 20.6426 21.7046 20.6382Z"
											fill="#C9162F"
										/>
									</svg>
								)}
								<Link
									href={item.href}
									className={cn(
										"text-white hover:text-secondary transition-colors",
										item.active && "text-secondary"
									)}
								>
									{item.name}
								</Link>
							</li>
						))}
					</ul>
				</nav>
				<div className="hidden md:flex items-center gap-4">
					<a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer">
						<FaFacebook className="w-5 h-5 text-white hover:text-blue-400 transition" />
					</a>
					<a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer">
						<FaWhatsapp className="w-5 h-5 text-white hover:text-green-400 transition" />
					</a>
					<a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer">
						<FaInstagram className="w-5 h-5 text-white hover:text-pink-400 transition" />
					</a>
					{/* <a href="#" target="_blank" rel="noopener noreferrer">
						<FaLinkedin className="w-5 h-5 text-white hover:text-blue-400 transition" />
					</a> */}

					<DropdownMenu>
						<DropdownMenuTrigger className="text-white flex items-center gap-2 outline-none hover:text-secondary transition-colors">
							<GrLanguage className="w-5 h-5" />
							<span className="mt-1">{locale.toUpperCase()}</span>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="bg-white p-3 flex flex-col gap-2">
							<DropdownMenuItem className="cursor-pointer p-0">
								<Link href={pathname} locale="en" className="h-full w-full px-2 py-1.5">
									English
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem className="cursor-pointer p-0">
								<Link href={pathname} locale="fr" className="h-full w-full px-2 py-1.5">
									French
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem className="cursor-pointer p-0" lang="ar">
								<Link href={pathname} locale="ar" className="h-full w-full px-2 py-1.5">
									عربي
								</Link>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				{/* mobile menu */}
				<Sheet>
					<SheetTrigger className="md:hidden outline-none">
						<MenuIcon className="w-8 h-8 text-white text-3xl" />
					</SheetTrigger>
					<SheetContent side={locale === "ar" ? "left" : "right"} className="p-0 w-64 max-w-xs md:hidden">
						<nav className="flex flex-col h-full bg-white dark:bg-gray-900">
							<div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
								<span className="text-xl font-bold">{t("Menu")}</span>
							</div>
							<ul className="flex-1 flex flex-col gap-2 p-6">
								{navLinks.map((item) => (
									<li key={item.name}>
										<Link
											href={item.href}
											className={cn(
												"flex items-center gap-2 py-2 px-4 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition",
												item.active && "bg-gray-100 text-secondary"
											)}
										>
											{item.active && (
												<svg
													width="24"
													height="24"
													viewBox="0 0 24 24"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
													className="mb-1.5"
												>
													<path
														d="M21.7046 20.6382L21.7119 20.6353C21.7119 20.6353 16.4868 15.3325 15.9741 14.8198C15.6563 14.7261 13.7974 13.9087 13.7652 12.3721C14.5584 11.4632 15.7119 10.5901 17.4155 10.5729C17.4184 10.5714 17.4272 10.5707 17.4317 10.5707C18.2022 10.5916 18.98 10.3359 19.5989 9.79506C19.6421 9.75699 19.7439 9.65335 19.7439 9.65335L24.0001 4.28949L23.4888 3.77642L18.282 9.28899L17.6676 8.67266L23.0267 3.3139L22.5762 2.86602L17.1856 8.25775L16.6758 7.74758L22.0671 2.35585L21.5713 1.86106L16.18 7.2521L15.5757 6.64895L21.1406 1.42824L20.6733 0.960938L15.5449 4.9563C15.5449 4.9563 15.359 5.11302 15.2945 5.17826C14.5906 5.88177 14.2881 6.83648 14.3892 7.75602C14.3181 8.92242 13.941 9.78851 13.4517 10.4469C3.89097 1.09351 0.285626 2.09399 0.285626 2.09399L0 2.38365C0 2.38365 6.42883 8.83007 10.4011 12.8101C9.00735 14.2053 2.2881 20.9246 2.2881 20.9246L2.28879 20.926C2.28293 20.9318 2.27562 20.9341 2.26868 20.9414C1.78859 21.4218 1.79041 22.1997 2.26944 22.6794C2.74878 23.1591 3.52888 23.1591 4.00709 22.6808C4.01478 22.6735 4.01699 22.6655 4.0214 22.6611L4.02285 22.6625C4.02285 22.6625 10.7505 15.9368 12.1363 14.5517C12.8628 15.279 13.3477 15.7646 13.4429 15.8598C14.0318 16.4517 19.96 22.3798 19.96 22.3798H19.9673C19.9673 22.3872 19.9739 22.3938 19.9805 22.3967C20.4595 22.8794 21.2461 22.8794 21.7244 22.3967C22.21 21.9184 22.21 21.1347 21.7244 20.6528C21.7185 20.6455 21.7119 20.6426 21.7046 20.6382Z"
														fill="#C9162F"
													/>
												</svg>
											)}
											{item.name}
										</Link>
									</li>
								))}
							</ul>
							<div className="p-6 border-t border-gray-200 dark:border-gray-700">
								<div className="flex justify-center gap-2 mb-4">
									<Link href={pathname} locale="en">
										<button
											className="px-2 py-1 rounded text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
											type="button"
											aria-label="Switch language to English"
										>
											EN
										</button>
									</Link>
									<Link href={pathname} locale="fr">
										<button
											className="px-2 py-1 rounded text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
											type="button"
											aria-label="Switch language to French"
										>
											FR
										</button>
									</Link>
									<Link href={pathname} locale="ar">
										<button
											className="px-2 py-1 rounded text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
											type="button"
											aria-label="Switch language to Arabic"
										>
											AR
										</button>
									</Link>
								</div>
								<div className="flex justify-center gap-4 mb-2">
									<a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer">
										<FaFacebook className="w-5 h-5 text-gray-600 dark:text-white hover:text-blue-600 transition" />
									</a>
									<a href="#" target="_blank" rel="noopener noreferrer">
										<FaInstagram className="w-5 h-5 text-gray-600 dark:text-white hover:text-pink-500 transition" />
									</a>
									<a href="#" target="_blank" rel="noopener noreferrer">
										<FaLinkedin className="w-5 h-5 text-gray-600 dark:text-white hover:text-blue-800 transition" />
									</a>
								</div>
							</div>
						</nav>
					</SheetContent>
				</Sheet>
			</div>
		</header>
	);
};

export default Header;
