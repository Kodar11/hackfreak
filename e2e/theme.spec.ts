import { test, expect } from '@playwright/test';
import { launchApp, waitForBoot, typeCommand, waitForOutput } from './utils';

test.describe('Theme Switching', () => {
  test('should switch to cyberpunk theme', async () => {
    const { app, page } = await launchApp();
    
    await waitForBoot(page);
    
    await typeCommand(page, 'theme cyberpunk');
    await waitForOutput(page, 'Theme changed to: cyberpunk');
    
    // Verify CSS variable changed
    const bgColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--term-bg').trim();
    });
    expect(bgColor).toBe('#0d0d1a');
    
    await app.close();
  });

  test('should switch to military theme', async () => {
    const { app, page } = await launchApp();
    
    await waitForBoot(page);
    
    await typeCommand(page, 'theme military');
    await waitForOutput(page, 'Theme changed to: military');
    
    const bgColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--term-bg').trim();
    });
    expect(bgColor).toBe('#1a1f1a');
    
    await app.close();
  });

  test('should switch to amber theme', async () => {
    const { app, page } = await launchApp();
    
    await waitForBoot(page);
    
    await typeCommand(page, 'theme amber');
    await waitForOutput(page, 'Theme changed to: amber');
    
    const bgColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--term-bg').trim();
    });
    expect(bgColor).toBe('#1a1400');
    
    await app.close();
  });

  test('should switch back to matrix theme', async () => {
    const { app, page } = await launchApp();
    
    await waitForBoot(page);
    
    // Switch to cyberpunk first
    await typeCommand(page, 'theme cyberpunk');
    await waitForOutput(page, 'Theme changed to: cyberpunk');
    
    // Switch back to matrix
    await typeCommand(page, 'theme matrix');
    await waitForOutput(page, 'Theme changed to: matrix');
    
    const bgColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--term-bg').trim();
    });
    expect(bgColor).toBe('#0a0a0a');
    
    await app.close();
  });

  test('should show error for invalid theme', async () => {
    const { app, page } = await launchApp();
    
    await waitForBoot(page);
    
    await typeCommand(page, 'theme invalid');
    await waitForOutput(page, 'Available themes:');
    
    await app.close();
  });
});
