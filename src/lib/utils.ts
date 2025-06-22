<<<<<<< HEAD

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNow } from "date-fns"
=======
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
>>>>>>> noteai-suite/main

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
<<<<<<< HEAD

export { formatDistanceToNow }
=======
>>>>>>> noteai-suite/main
