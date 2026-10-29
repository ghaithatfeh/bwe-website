import type { Database } from "@/integrations/supabase/types";

export type OrderStatus = Database["public"]["Enums"]["order_status"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];
export type OrderWithItems = Order & { order_items: OrderItem[] };

/** Badge colors per status; labels live in the `OrderStatus` messages namespace. */
export const ORDER_STATUS_CLASSES: Record<OrderStatus, string> = {
	new: "bg-blue-100 text-blue-800",
	confirmed: "bg-indigo-100 text-indigo-800",
	processing: "bg-amber-100 text-amber-800",
	delivering: "bg-orange-100 text-orange-800",
	completed: "bg-green-100 text-green-800",
	cancelled: "bg-gray-200 text-gray-700",
};
