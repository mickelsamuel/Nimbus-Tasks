export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  waitFor: number
): T {
  let timeout: NodeJS.Timeout | null = null

  return ((...args: Parameters<T>) => {
    if (timeout !== null) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      func(...args)
    }, waitFor)
  }) as T
}