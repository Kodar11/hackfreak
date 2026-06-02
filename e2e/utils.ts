import { _electron, Page, ElectronApplication } from '@playwright/test';

export async function launchApp(): Promise<{ app: ElectronApplication; page: Page }> {
  const app = await _electron.launch({
    args: ['.'],
    env: { NODE_ENV: 'development' },
  });
  const page = await app.firstWindow();
  await waitForPreloadScript(page);
  return { app, page };
}

async function waitForPreloadScript(page: Page): Promise<void> {
  await page.waitForFunction(() => {
    return (window as any).electron !== undefined;
  }, { timeout: 10000 });
}

export async function waitForBoot(page: Page): Promise<void> {
  await page.waitForSelector('text=System Ready', { timeout: 10000 });
}

export async function typeCommand(page: Page, command: string): Promise<void> {
  const input = page.locator('input.terminal-input');
  await input.fill(command);
  await input.press('Enter');
}

export async function waitForOutput(page: Page, text: string, timeout = 30000): Promise<void> {
  await page.waitForSelector(`text=${text}`, { timeout });
}
