export function pluralify(singular: string, plural: string, count: number): string {
  return count === 1 ? singular : plural;
}
