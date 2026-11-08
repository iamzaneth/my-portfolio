import { test } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

test('capture required visual QA screenshots', async ({ page }) => {
  await mkdir('artifacts/visual/v4.3', { recursive: true });

  // 8. Full About desktop (1440x900)
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#about');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);

  // 2. New front after redesign (full section)
  await page.locator('#about').screenshot({ path: 'artifacts/visual/v4.3/08-full-about-desktop-1440x900.png' });

  // 3. New front close-up (identity-stage)
  await page.locator('.identity-stage').screenshot({ path: 'artifacts/visual/v4.3/03-new-front-closeup.png' });

  // 2. New front body close-up
  await page.locator('.identity-body').screenshot({ path: 'artifacts/visual/v4.3/02-new-front.png' });

  // 4. New front at a slight angle
  await page.locator('.identity-body').evaluate((e) => {
    (e as HTMLElement).style.transform = 'rotateY(15deg) rotateX(8deg)';
  });
  await page.waitForTimeout(200);
  await page.locator('.identity-stage').screenshot({ path: 'artifacts/visual/v4.3/04-front-slight-angle.png' });
  await page.locator('.identity-body').evaluate((e) => {
    (e as HTMLElement).style.transform = '';
  });

  // 7. Mid-flip (90deg and 60deg)
  await page.locator('.identity-body').evaluate((e) => {
    (e as HTMLElement).style.transform = 'rotateY(60deg)';
  });
  await page.waitForTimeout(200);
  await page.locator('.identity-stage').screenshot({ path: 'artifacts/visual/v4.3/07-mid-flip-60deg.png' });

  await page.locator('.identity-body').evaluate((e) => {
    (e as HTMLElement).style.transform = 'rotateY(90deg)';
  });
  await page.waitForTimeout(200);
  await page.locator('.identity-stage').screenshot({ path: 'artifacts/visual/v4.3/07-mid-flip-90deg.png' });

  // Reset transform and flip card
  await page.locator('.identity-body').evaluate((e) => {
    (e as HTMLElement).style.transform = '';
  });
  await page.getByRole('button', { name: 'Flip card: Zaneth identity' }).click();
  await page.waitForTimeout(600);

  // 6. New back
  await page.locator('.identity-stage').screenshot({ path: 'artifacts/visual/v4.3/06-new-back.png' });

  // Flip back to front
  await page.getByRole('button', { name: 'Flip card: Zaneth identity' }).click();
  await page.waitForTimeout(600);

  // 10. Full About at 1366 × 768
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto('/#about');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
  await page.locator('#about').screenshot({ path: 'artifacts/visual/v4.3/10-full-about-1366x768.png' });

  // 9. Full About mobile (375x812)
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/#about');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
  await page.locator('#about').screenshot({ path: 'artifacts/visual/v4.3/09-full-about-mobile-375x812.png' });
  await page.locator('.identity-stage').screenshot({ path: 'artifacts/visual/v4.3/09-card-mobile-375x812.png' });

  console.log('All QA captures complete.');
});
