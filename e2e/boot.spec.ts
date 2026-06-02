import { test, expect } from '@playwright/test';
import { launchApp, waitForBoot, typeCommand, waitForOutput } from './utils';

test.describe('Boot Sequence', () => {
  test('should complete boot sequence and show System Ready', async () => {
    const { app, page } = await launchApp();
    
    await waitForBoot(page);
    await waitForOutput(page, 'System Ready');
    
    await app.close();
  });

  test('should show terminal prompt after boot', async () => {
    const { app, page } = await launchApp();
    
    await waitForBoot(page);
    
    const prompt = page.locator('text=user@hacker:~ $');
    await expect(prompt).toBeVisible();
    
    await app.close();
  });

  test('should accept commands after boot', async () => {
    const { app, page } = await launchApp();
    
    await waitForBoot(page);
    await typeCommand(page, 'help');
    await waitForOutput(page, 'Available commands');
    
    await app.close();
  });

  test('should show session ID in boot sequence', async () => {
    const { app, page } = await launchApp();
    
    await waitForBoot(page);
    await waitForOutput(page, 'SESSION:');
    
    await app.close();
  });
});
