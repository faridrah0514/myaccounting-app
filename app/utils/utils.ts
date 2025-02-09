import type { FinanceAccountType } from "@/app/types/types"

export function currencyFormatter(value: string | undefined): string {
  if (value) {
    const numericValue = value.replace(/[^\d]/g, "")
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(numericValue))
  }
  return ""
}

export function numericOnly(value: string | undefined): number {
  return value ? parseFloat(value.replace(/[^\d]/g, "")) || 0 : 0
}

export function numberToCurrency(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value)
}

export function currencyToNumber(value: string | undefined): number {
  if (value) {
    const numericValue = value.replace(/[^\d]/g, "")
    return Number(numericValue)
  }
  return 0
}

export const flattenAccounts = (accounts: FinanceAccountType[]): FinanceAccountType[] => {
  const result: FinanceAccountType[] = []

  accounts.forEach((account) => {
    result.push(account) // Add the current account
    if (account.children && account.children.length > 0) {
      result.push(...flattenAccounts(account.children)) // Recursively add children
    }
  })

  return result
}
// export function dateFormatter(value: string): string {
//   return new Date(value).toLocaleDateString("id-ID", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   })
// }
// export function dateTimeFormatter(value: string): string {
//   return new Date(value).toLocaleString("id-ID", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//     hour: "numeric",
//     minute: "numeric",
//     second: "numeric",
//   })
// }
// export function timeFormatter(value: string): string {
//   return new Date(value).toLocaleTimeString("id-ID", {
//     hour: "numeric",
//     minute: "numeric",
//     second: "numeric",
//   })
// }
// export function dateFormatterShort(value: string): string {
//   return new Date(value).toLocaleDateString("id-ID", {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//   })
// }
// export function dateFormatterLong(value: string): string {
//   return new Date(value).toLocaleDateString("id-ID", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   })
// }
// export function dateFormatterMonth(value: string): string {
//   return new Date(value).toLocaleDateString("id-ID", {
//     month: "long",
//     year: "numeric",
//   })
// }
// export function dateFormatterYear(value: string): string {
//   return new Date(value).toLocaleDateString("id-ID", {
//     year: "numeric",
//   })
// }
// export function dateFormatterDay(value: string): string {
//   return new Date(value).toLocaleDateString("id-ID", {
//     weekday: "long",
//   })
// }
// export function dateFormatterDayShort(value: string): string {
//   return new Date(value).toLocaleDateString("id-ID", {
//     weekday: "short",
//   })
// }
// export function dateFormatterMonthShort(value: string): string {
//   return new Date(value).toLocaleDateString("id-ID", {
//     month: "short",
//   })
// }
// export function dateFormatterMonthYear(value: string): string {
//   return new Date(value).toLocaleDateString("id-ID", {
//     month: "long",
//     year: "numeric",
//   })
// }
// export function dateFormatterMonthYearShort(value: string): string {
//   return new Date(value).toLocaleDateString("id-ID", {
//     month: "short",
//     year: "numeric",
//   })
// }
// export function dateFormatterMonthDay(value: string): string {
//   return new Date(value).toLocaleDateString("id-ID", {
//     month: "long",
//     day: "numeric",
//   })
// }
// export function dateFormatterMonthDayShort(value: string): string {
//   return new Date(value).toLocaleDateString("id-ID", {
//     month: "short",
//     day: "numeric",
//   })
// }
// export function dateFormatterDayMonth(value: string): string {
//   return new Date(value).toLocaleDateString("id-ID", {
//     day: "numeric",
//     month: "long",
//   })
// }
// export function dateFormatterDayMonthShort(value: string): string {
//   return new Date(value).toLocaleDateString("id-ID", {
//     day: "numeric",
//     month: "short",
//   })
// }
// export function dateFormatterTime(value: string): string {
//   return new Date(value).toLocaleTimeString("id-ID", {
//     hour: "numeric",
//     minute: "numeric",
//     second: "numeric",
//   })
// }
// export function dateFormatterTimeShort(value: string): string {
//   return new Date(value).toLocaleTimeString("id-ID", {
//     hour: "numeric",
//     minute: "numeric",
//   })
// }
// export function dateFormatterTimeSecond(value: string): string {
//   return new Date(value).toLocaleTimeString("id-ID", {
//     hour: "numeric",
//     minute: "numeric",
//     second: "numeric",
//   })
// }
// export function dateFormatterTimeSecondShort(value: string): string {
//   return new Date(value).toLocaleTimeString("id-ID", {
//     hour: "numeric",
//     minute: "numeric",
//     second: "numeric",
//   })
// }
// export function dateFormatterTimeHour(value: string): string {
//   return new Date(value).toLocaleTimeString("id-ID", {
//     hour: "numeric",
//   })
// }
// export function dateFormatterTimeHourShort(value: string): string {
//   return new Date(value).toLocaleTimeString("id-ID", {
//     hour: "numeric",
//   })
// }
// export function dateFormatterTimeMinute(value: string): string {
//   return new Date(value).toLocaleTimeString("id-ID", {
//     minute: "numeric",
//   })
// }
