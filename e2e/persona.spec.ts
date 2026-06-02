import { test, expect } from '@playwright/test';
import { launchApp, waitForBoot, typeCommand, waitForOutput } from './utils';

test.describe('Persona Workflow', () => {
  test('should create and display a persona', async () => {
    const { app, page } = await launchApp();
    
    await waitForBoot(page);
    
    // Create persona
    await typeCommand(page, 'persona create rahul');
    await waitForOutput(page, 'Creating persona: rahul');
    await waitForOutput(page, 'Enter data using:');
    
    // Enter fields
    await typeCommand(page, 'name=Rahul');
    await typeCommand(page, 'city=Mumbai');
    await typeCommand(page, 'done');
    
    await waitForOutput(page, 'Persona "rahul" saved');
    
    // Display persona
    await typeCommand(page, 'persona show rahul');
    await waitForOutput(page, 'TARGET PROFILE');
    await waitForOutput(page, 'Rahul');
    await waitForOutput(page, 'Mumbai');
    
    await app.close();
  });

  test('should list all personas', async () => {
    const { app, page } = await launchApp();
    
    await waitForBoot(page);
    
    // Create multiple personas
    await typeCommand(page, 'persona create rahul');
    await typeCommand(page, 'name=Rahul');
    await typeCommand(page, 'done');
    
    await typeCommand(page, 'persona create john');
    await typeCommand(page, 'name=John');
    await typeCommand(page, 'done');
    
    // List personas
    await typeCommand(page, 'persona list');
    await waitForOutput(page, 'Stored personas:');
    await waitForOutput(page, 'rahul');
    await waitForOutput(page, 'john');
    
    await app.close();
  });

  test('should update persona fields', async () => {
    const { app, page } = await launchApp();
    
    await waitForBoot(page);
    
    // Create persona
    await typeCommand(page, 'persona create rahul');
    await typeCommand(page, 'city=Mumbai');
    await typeCommand(page, 'done');
    
    // Update field
    await typeCommand(page, 'persona set rahul city Delhi');
    await waitForOutput(page, 'Updated rahul.city = Delhi');
    
    // Verify update
    await typeCommand(page, 'persona show rahul');
    await waitForOutput(page, 'Delhi');
    
    await app.close();
  });

  test('should delete persona', async () => {
    const { app, page } = await launchApp();
    
    await waitForBoot(page);
    
    // Create persona
    await typeCommand(page, 'persona create rahul');
    await typeCommand(page, 'name=Rahul');
    await typeCommand(page, 'done');
    
    // Delete persona
    await typeCommand(page, 'persona delete rahul');
    await waitForOutput(page, 'Persona "rahul" deleted');
    
    // Verify deletion
    await typeCommand(page, 'persona show rahul');
    await waitForOutput(page, 'Persona "rahul" not found');
    
    await app.close();
  });
});
