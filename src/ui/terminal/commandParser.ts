export interface ParsedCommand {
  command: string;
  subcommand: string;
  args: string[];
  raw: string;
}

const COMPOUND_COMMANDS: Record<string, string[]> = {
  persona: ['create', 'set', 'show', 'list', 'delete'],
  ai: ['analyze'],
};

export function parseCommand(input: string): ParsedCommand {
  const trimmed = input.trim();
  const parts = trimmed.split(/\s+/);
  const command = parts[0]?.toLowerCase() ?? '';

  const subcommands = COMPOUND_COMMANDS[command];
  if (subcommands && parts[1] && subcommands.includes(parts[1].toLowerCase())) {
    return {
      command,
      subcommand: parts[1].toLowerCase(),
      args: parts.slice(2),
      raw: trimmed,
    };
  }

  return {
    command,
    subcommand: '',
    args: parts.slice(1),
    raw: trimmed,
  };
}
