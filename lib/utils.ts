import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency to Pakistani Rupee (PKR / Rs.)
 * e.g., 4500 -> "Rs. 4,500"
 */
export function formatPKR(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return "Rs. 0";
  }
  const numeric = typeof amount === "number" ? amount : parseFloat(amount);
  return `Rs. ${new Intl.NumberFormat("en-PK", {
    maximumFractionDigits: 0,
  }).format(numeric)}`;
}

/**
 * Generates an order number like IMP-98421
 */
export function generateOrderNumber(): string {
  const randomPart = Math.floor(10000 + Math.random() * 90000);
  return `IMP-${randomPart}`;
}

/**
 * Format payment method into user-friendly display string
 */
export function formatPaymentMethod(method: string): string {
  switch (method?.toLowerCase()) {
    case "jazzcash":
      return "JazzCash Advance Transfer";
    case "easypaisa":
      return "EasyPaisa Advance Transfer";
    case "bank_transfer":
      return "Bank Transfer / Raast (Meezan Bank)";
    default:
      return method || "Advance Payment";
  }
}

/**
 * Get visual badge colors for payment status
 */
export function getPaymentStatusInfo(status: string): {
  label: string;
  badgeClass: string;
} {
  switch (status) {
    case "verified":
      return {
        label: "Payment Verified",
        badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
      };
    case "rejected":
      return {
        label: "Payment Rejected / Invalid TID",
        badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
      };
    case "pending_verification":
    default:
      return {
        label: "Verification Pending",
        badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
      };
  }
}

/**
 * Get visual badge colors for order fulfillment status
 */
export function getOrderStatusInfo(status: string): {
  label: string;
  badgeClass: string;
} {
  switch (status) {
    case "confirmed":
      return {
        label: "Order Confirmed",
        badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
      };
    case "shipped":
      return {
        label: "Dispatched / In Transit",
        badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200",
      };
    case "delivered":
      return {
        label: "Delivered",
        badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
      };
    case "cancelled":
      return {
        label: "Cancelled",
        badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
      };
    case "pending":
    default:
      return {
        label: "Awaiting Verification",
        badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
      };
  }
}

/**
 * Format timestamp to readable Pakistani date
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-PK", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
}
