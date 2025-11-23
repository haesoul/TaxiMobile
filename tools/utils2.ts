
// Перенесено с utils.ts, потому что был цикл использования

export function firstItem<T>(value: Iterable<T>): T | undefined {
  for (const item of value)
    return item
}