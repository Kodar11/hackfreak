import { test, expect } from '@playwright/test';
import { launchApp, waitForBoot, typeCommand, waitForOutput } from './utils';

test.describe('Investigation Workflow', () => {
  test('should run complete investigation workflow', async () => {
    const { app, page } = await launchApp();
    
    await waitForBoot(page);
    
    // Create persona first
    await typeCommand(page, 'persona create rahul');
    await typeCommand(page, 'name=Rahul Sharma');
    await typeCommand(page, 'city=Mumbai');
    await typeCommand(page, 'email=rahul@example.com');
    await typeCommand(page, 'done');
    
    // Run investigation
    await typeCommand(page, 'investigate rahul');
    
    // Verify authorization sequence
    await waitForOutput(page, 'AUTHORIZATION REQUIRED');
    await waitForOutput(page, 'Verifying Clearance');
    await waitForOutput(page, 'ACCESS GRANTED');
    
    // Verify Phase 1
    await waitForOutput(page, 'Phase 1: Asset Discovery');
    await waitForOutput(page, 'Scanning Assets');
    await waitForOutput(page, 'Locating Endpoints');
    
    // Verify Phase 2
    await waitForOutput(page, 'Phase 2: Deep Analysis');
    await waitForOutput(page, 'Running: persona show');
    await waitForOutput(page, 'Running: network');
    await waitForOutput(page, 'Running: timeline');
    await waitForOutput(page, 'Running: ai analyze');
    
    // Verify Phase 3
    await waitForOutput(page, 'Phase 3: Investigation Summary');
    await waitForOutput(page, 'INVESTIGATION COMPLETE');
    
    await app.close();
  });

  test('should show threat level change after investigation', async () => {
    const { app, page } = await launchApp();
    
    await waitForBoot(page);
    
    // Create persona
    await typeCommand(page, 'persona create rahul');
    await typeCommand(page, 'name=Rahul');
    await typeCommand(page, 'done');
    
    // Run investigation
    await typeCommand(page, 'investigate rahul');
    
    // Wait for completion
    await waitForOutput(page, 'INVESTIGATION COMPLETE', 30000);
    
    // Verify threat level is shown
    await waitForOutput(page, 'Threat Level:');
    
    await app.close();
  });

  test('should handle investigation without persona', async () => {
    const { app, page } = await launchApp();
    
    await waitForBoot(page);
    
    // Run investigation without creating persona
    await typeCommand(page, 'investigate unknown');
    
    // Should still complete but show no persona data
    await waitForOutput(page, 'AUTHORIZATION REQUIRED');
    await waitForOutput(page, 'Phase 2: Deep Analysis');
    await waitForOutput(page, 'no persona data');
    
    await app.close();
  });
});
