import { test, expect } from '@playwright/test';
import { launchApp, waitForBoot } from './utils';

test('custom frame should minimize the main window', async () => {
  const { app, page } = await launchApp();

  await waitForBoot(page);
  await page.getByLabel('Minimize').click();

  const isMinimized = await app.evaluate((electron) => {
    return electron.BrowserWindow.getAllWindows()[0].isMinimized();
  });

  expect(isMinimized).toBe(true);
  await app.close();
});

test('frameless release app should hide the native application menu', async () => {
  const { app } = await launchApp();

  const menu = await app.evaluate((electron) => {
    return electron.Menu.getApplicationMenu();
  });

  expect(menu).toBeNull();
  await app.close();
});
