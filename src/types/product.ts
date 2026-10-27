import type { ProductColor } from "@/lib/colors";

export interface Product {
	id: number;
	code: string;
	category_id: number;
	title_en: string;
	title_ar: string;
	title_fr: string;
	material_en: string;
	material_ar: string;
	material_fr: string;
	length: number | null;
	weight: number | null;
	diameter: number | null;
	price: number | null;
	quantity_bag: number;
	quantity_box: number;
	images: string[] | null;
	colors: ProductColor[] | null;
	additional_colors: number | null;
	is_featured: boolean | null;
	top_products: boolean | null;
	primary_image_url: string | null;
	created_at: string | null;
	updated_at: string | null;
}
