import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
// import { parse } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// // Helper para parsear datas em formato yyyy-MM-dd ou ISO string
// const parseStringToDate = (dateString: string | undefined | Date): Date | undefined => {
//   if (!dateString) return undefined;

//   try {
//     // Se já for uma Date, retorna como está
//     if (dateString instanceof Date) {
//       return dateString;
//     }

//     // Tenta parsear como ISO string primeiro (YYYY-MM-DD ou ISO completo)
//     if (typeof dateString === 'string') {
//       // Se for formato yyyy-MM-dd
//       if (dateString.length === 10 && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
//         return parse(dateString, 'yyyy-MM-dd', new Date());
//       }

//       // Se for ISO completo (2026-04-20T00:00:00...)
//       if (dateString.includes('T')) {
//         return new Date(dateString);
//       }

//       // Tenta parsear como ISO
//       const parsed = new Date(dateString);
//       if (!isNaN(parsed.getTime())) {
//         return parsed;
//       }
//     }

//     return undefined;
//   } catch (error) {
//     console.error('Erro ao parsear data:', error, dateString);
//     return undefined;
//   }
// };