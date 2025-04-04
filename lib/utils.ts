import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * 合并多个 CSS 类名，并处理 Tailwind CSS 的类名冲突
 * @param inputs - 要合并的 CSS 类名数组
 * @returns 合并后的类名字符串
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
