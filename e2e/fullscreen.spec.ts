import { test, expect } from '@playwright/test';
import { launchApp, waitForBoot, typeCommand, waitForOutput } from './utils';

test.describe('Fullscreen Toggle', () => {
  test('should enter fullscreen mode', async () => {
    const { app, page } = await launchApp();
    
    await waitForBoot(page);
    
    await typeCommand(page, 'fullscreen');
    await waitForOutput(page, 'Entering Fullscreen Mode');
    await waitForOutput(page, 'System Interface Expanded');
    
    await app.close();
  });

  test('should exit fullscreen mode', async () => {
    const { app, page } = await launchApp();
    
    await waitForBoot(page);
    
    // Enter fullscreen
    await typeCommand(page, 'fullscreen');
    await waitForOutput(page, 'Entering Fullscreen Mode');
    
    // Exit fullscreen
    await typeCommand(page, 'fullscreen');
    await waitForOutput(page, 'Exiting Fullscreen Mode');
    await waitForOutput(page, 'System Interface Restored');
    
    await app.close();
  });

  test('should show help message when entering fullscreen', async () => {
    const { app, page } = await launchApp();
    
    await waitForBoot(page);
    
    await typeCommand(page, 'fullscreen');
    await waitForOutput(page, 'Use F11 or fullscreen to exit');
    
    await app.close();
  });

  test('should toggle fullscreen multiple times', async () => {
    const { app, page } = await launchApp();
    
    await waitForBoot(page);
    
    // First toggle
    await typeCommand(page, 'fullscreen');
    await waitForOutput(page, 'Entering Fullscreen Mode');
    
    // Second toggle
    await typeCommand(page, 'fullscreen');
    await waitForOutput(page, 'Exiting Fullscreen Mode');
    
    // Third toggle
    await typeCommand(page, 'fullscreen');
    await waitForOutput(page, 'Entering Fullscreen Mode');
    
    await app.close();
  });
});
