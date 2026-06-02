import { test, expect } from '@playwright/test';
import { launchApp, waitForBoot, typeCommand, waitForOutput } from './utils';

test.describe('Lockdown Command', () => {
  test('should execute lockdown sequence', async () => {
    const { app, page } = await launchApp();
    
    await waitForBoot(page);
    
    await typeCommand(page, 'lockdown');
    
    // Verify authorization
    await waitForOutput(page, 'AUTHORIZATION REQUIRED');
    await waitForOutput(page, 'Verifying Clearance');
    await waitForOutput(page, 'ACCESS GRANTED');
    
    // Verify lockdown sequence
    await waitForOutput(page, 'THREAT LEVEL: CRITICAL');
    await waitForOutput(page, 'Initiating Countermeasures');
    await waitForOutput(page, 'Closing External Channels');
    await waitForOutput(page, 'Purging Active Sessions');
    await waitForOutput(page, 'Encrypting Intelligence Cache');
    await waitForOutput(page, 'Securing Satellite Uplinks');
    await waitForOutput(page, 'LOCKDOWN COMPLETE');
    
    await app.close();
  });

  test('should show critical threat badge after lockdown', async () => {
    const { app, page } = await launchApp();
    
    await waitForBoot(page);
    
    await typeCommand(page, 'lockdown');
    await waitForOutput(page, 'LOCKDOWN COMPLETE');
    
    // Verify threat badge shows CRITICAL
    const threatBadge = page.locator('.threat-badge');
    await expect(threatBadge).toContainText('CRITICAL');
    
    await app.close();
  });

  test('should require authorization for lockdown', async () => {
    const { app, page } = await launchApp();
    
    await waitForBoot(page);
    
    await typeCommand(page, 'lockdown');
    
    // Authorization should appear before lockdown sequence
    await waitForOutput(page, 'AUTHORIZATION REQUIRED');
    await waitForOutput(page, 'Current Clearance:');
    await waitForOutput(page, 'Required Clearance:');
    
    await app.close();
  });

  test('should show system secure message after lockdown', async () => {
    const { app, page } = await launchApp();
    
    await waitForBoot(page);
    
    await typeCommand(page, 'lockdown');
    await waitForOutput(page, 'LOCKDOWN COMPLETE');
    await waitForOutput(page, 'System is now in secure mode');
    
    await app.close();
  });
});
