const path = require('node:path');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const testRoot = path.join(process.env.TEMP, 'dovia-ui-check');
const { chromium } = require(path.join(testRoot, 'node_modules/playwright'));
const AxeBuilder = require(path.join(testRoot, 'node_modules/@axe-core/playwright')).default;

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const reports = [];
  try {
    await page.goto('http://localhost:3100/design-system-check', { waitUntil: 'networkidle' });
    await page.getByRole('heading', { name: 'Clarity in every detail.' }).waitFor();
    for (const width of [375, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true, `Overflow at ${width}`);
      const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      reports.push({ width, violations: result.violations.map(v => ({ id: v.id, description: v.description, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) })) });
      await page.screenshot({ path: path.join(testRoot, `preview-${width}.png`), fullPage: true });
    }
    await page.setViewportSize({ width: 375, height: 900 });
    const title = page.getByRole('textbox', { name: 'Meeting title' });
    await title.focus();
    assert.equal(await title.evaluate(el => getComputedStyle(el).outlineStyle), 'solid');
    assert.equal(await page.getByRole('textbox', { name: 'Email address' }).getAttribute('aria-invalid'), 'true');
    await page.getByRole('textbox', { name: 'Meeting notes' }).fill('Hello Dovia');
    assert.equal(await page.getByText('11 / 500 characters').count(), 1);
    await page.getByRole('checkbox', { name: 'Include a reminder' }).focus();
    await page.keyboard.press('Space');
    assert.equal(await page.getByRole('checkbox', { name: 'Include a reminder' }).isChecked(), true);
    await page.getByRole('tab', { name: 'Overview', exact: true }).focus();
    await page.keyboard.press('ArrowRight');
    assert.equal(await page.getByRole('tab', { name: 'Details', exact: true }).getAttribute('aria-selected'), 'true');
    await page.keyboard.press('End');
    assert.equal(await page.getByRole('tab', { name: 'Activity', exact: true }).getAttribute('aria-selected'), 'true');
    await page.keyboard.press('Home');
    assert.equal(await page.getByRole('tab', { name: 'Overview', exact: true }).getAttribute('aria-selected'), 'true');
    const menuTrigger = page.getByRole('button', { name: 'Example actions' });
    await menuTrigger.focus();
    await page.keyboard.press('ArrowDown');
    await page.getByRole('menu').waitFor();
    assert.equal(await page.evaluate(() => document.activeElement.textContent.trim()), 'Edit');
    const menuBounds = await page.getByRole('menu').boundingBox();
    assert.ok(menuBounds.x >= 0 && menuBounds.x + menuBounds.width <= 375);
    await page.keyboard.press('ArrowDown');
    assert.equal(await page.evaluate(() => document.activeElement.textContent.trim()), 'Delete');
    await page.keyboard.press('Escape');
    assert.equal(await menuTrigger.evaluate(el => el === document.activeElement), true);
    await menuTrigger.click();
    await page.keyboard.press('d');
    await page.keyboard.press('Enter');
    await page.getByText('Delete selected', { exact: true }).waitFor();
    await page.getByRole('button', { name: 'Open dialog', exact: true }).click();
    const dialog = page.getByRole('dialog');
    await dialog.waitFor();
    assert.equal(await dialog.evaluate(el => el.contains(document.activeElement)), true);
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('Tab');
      assert.equal(await dialog.evaluate(el => el.contains(document.activeElement)), true, 'Focus escaped dialog');
    }
    await page.screenshot({ path: path.join(testRoot, 'modal-mobile.png') });
    reports.push({ dialog: (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations });
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'hidden' });
    assert.equal(await page.getByRole('button', { name: 'Open dialog', exact: true }).evaluate(el => el === document.activeElement), true);
    await page.getByRole('button', { name: 'Open dialog', exact: true }).click();
    await page.getByRole('button', { name: 'Confirm', exact: true }).click();
    await page.getByText('Confirmed', { exact: true }).waitFor();
    await page.getByRole('button', { name: 'Dismiss notification' }).click();
    assert.equal(await page.getByText('Dismissible feedback', { exact: true }).count(), 0);
    await page.getByRole('button', { name: 'Search workspace' }).focus();
    assert.equal(await page.getByRole('tooltip').isVisible(), true);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('[role="tooltip"].fixed').count(), 0);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    assert.equal(await page.locator('.dovia-skeleton').first().evaluate(el => getComputedStyle(el).animationName), 'none');
    assert.equal(await page.locator('.dovia-spinner').first().evaluate(el => getComputedStyle(el).animationName), 'none');
    assert.equal(await page.getByRole('img', { name: 'Abdulfatai', exact: true }).textContent(), 'AD');
    assert.equal(await page.getByRole('img', { name: 'Broken image fallback' }).textContent(), 'BF');
    assert.deepEqual(errors, []);
    fs.writeFileSync(path.join(testRoot, 'report.json'), JSON.stringify(reports, null, 2));
    console.log(JSON.stringify({ interactions: 'passed', runtimeErrors: errors, accessibility: reports, screenshots: testRoot }, null, 2));
    assert.ok(reports.every(r => r.violations ? !r.violations.length : !r.dialog.length), 'Accessibility violations found');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
