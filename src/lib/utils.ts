import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";

export function truncateDid(str: string, maxLength: number = 30): string {
  if (str.length <= maxLength) return str;

  const [ , , id ] = str.split(':');
  str = id ?? str;
  
  const sideLength = 8;
  return `${id.slice(0, sideLength)}....${id.slice(-sideLength)}`;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toastSuccess(message: string, description?: string) {
  toast.success(message, { description });
}

export function toastError(message: string, error?: unknown) {
  console.error("Toast Error >>>", { message, error });
  const errorMessage = error
    ? (error as Error)?.message || "Unknown error"
    : undefined;
  toast.error(message, { description: errorMessage });
}
