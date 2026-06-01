export interface ParsedCommand {
  command: string;
  args: string[];
  raw: string;
}

export function parseCommand(input: string): ParsedCommand {
  const trimmed = input.trim();
  const parts = trimmed.split(/\s+/);
  return {
    command: parts[0]?.toLowerCase() ?? '',
    args: parts.slice(1),
    raw: trimmed,
  };
}
