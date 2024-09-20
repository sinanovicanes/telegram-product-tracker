export function pluralify(singular: string, plural: string, count: number): string {
  return count === 1 ? singular : plural;
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function getCommandArgsFromRawText(text: string): string[] {
  const args = text
    .trim()
    .split(" ")
    .filter(arg => arg);

  // Removes the command from the arguments
  args.shift();

  return args;
}

export function isEqualObjects(
  obj1: Record<string, unknown>,
  obj2: Record<string, unknown>
): boolean {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}
