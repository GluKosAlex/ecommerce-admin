import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Concatenates and merges the given class values into a single class string.
 *
 * @param {ClassValue[]} inputs - The class values to be concatenated and merged.
 * @return {string} The concatenated and merged class string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
});
