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

export function isEqualObjects(obj1: Object, obj2: Object): boolean {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function getRandomUserAgent() {
  const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
  ];

  return userAgents[Math.floor(Math.random() * userAgents.length)];
}
