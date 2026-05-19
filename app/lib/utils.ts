export function formatDate(dateString: string): string {
  const date = new Date(dateString)

  if (isNaN(date.getTime())) {
    return "Invalid Date"
  }

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return `${year}-${month}-${day}`
}

export function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

export async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

