const path = require('node:path');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const root = path.join(process.env.TEMP, 'dovia-ui-check');
const { chromium } = require(path.join(root, 'node_modules/playwright'));
const AxeBuilder = require(path.join(root, 'node_modules/@axe-core/playwright')).default;

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors = [];
  const apiCalls = [];
  const results = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('request', request => { if (new URL(request.url()).pathname.startsWith('/api/')) apiCalls.push(request.url()); });
  const go = async route => { const response = await page.goto('http://localhost:3000' + route, { waitUntil: 'networkidle' }); assert.equal(response.status(), 200, route); await page.locator('#main-content h1').waitFor(); };
  const overflow = async () => assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'Horizontal document overflow');
  const scan = async name => {
    const report = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    results.push({ name, violations: report.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) })) });
    fs.writeFileSync(path.join(root, 'workspace-report.json'), JSON.stringify(results, null, 2));
  };
  try {
    for (const width of [375, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await go('/dashboard');
      await overflow();
      assert.equal(await page.getByRole('main').count(), 1);
      const rail = page.locator('#workspace-sidebar');
      if (width < 768) assert.equal(await rail.isVisible(), false);
      else assert.equal(Math.round((await rail.boundingBox()).width), width < 1024 ? 76 : 248);
      await scan('shell-' + width);
      await page.screenshot({ path: path.join(root, 'workspace-' + width + '.png'), fullPage: true });
    }
    const nav = page.getByRole('navigation', { name: 'Workspace', exact: true });
    const routes = [
      ['/dashboard', 'Dashboard'], ['/meetings', 'Meetings'], ['/meetings/new', 'Meetings'],
      ['/meetings/test-meeting', 'Meetings'], ['/meetings/abc/content', 'Meetings'], ['/meetings/abc/ai-review', 'Meetings'],
      ['/tasks', 'My Tasks'], ['/tasks/test-task', 'My Tasks'], ['/calendar', 'Calendar'], ['/team', 'Team'],
      ['/reports', 'Reports'], ['/notifications', null], ['/settings', 'Settings'], ['/settings/account', 'Settings'],
      ['/settings/notifications', 'Settings'], ['/settings/integrations', 'Settings'], ['/settings/security', 'Settings'], ['/settings/workspace', 'Settings'],
    ];
    for (const [route, label] of routes) {
      await go(route);
      assert.equal(await page.getByRole('main').count(), 1, route);
      assert.equal(await page.locator('#workspace-sidebar').isVisible(), true);
      if (label) assert.equal(await nav.getByRole('link', { name: label, exact: true }).getAttribute('aria-current'), 'page', route);
      assert.equal(await nav.locator('[aria-current="page"]').count(), label ? 1 : 0, route);
    }
    await go('/dashboard');
    await page.getByRole('button', { name: 'Collapse sidebar', exact: true }).click();
    assert.equal(Math.round((await page.locator('#workspace-sidebar').boundingBox()).width), 76);
    assert.equal(await page.getByRole('button', { name: 'Expand sidebar', exact: true }).evaluate(el => el === document.activeElement), true);
    await scan('collapsed-sidebar');
    await nav.getByRole('link', { name: 'Meetings', exact: true }).focus();
    await page.locator('[role="tooltip"].fixed').waitFor();
    await page.keyboard.press('Enter');
    await page.waitForURL('**/meetings');
    assert.equal(Math.round((await page.locator('#workspace-sidebar').boundingBox()).width), 76, 'Collapse state must persist across navigation');
    await page.getByRole('button', { name: 'Expand sidebar', exact: true }).click();
    assert.equal(Math.round((await page.locator('#workspace-sidebar').boundingBox()).width), 248);
    await page.getByRole('textbox', { name: 'Search workspace' }).fill('Planning');
    await nav.getByRole('link', { name: 'My Tasks', exact: true }).click();
    await page.waitForURL('**/tasks');
    assert.equal(await page.getByRole('textbox', { name: 'Search workspace' }).inputValue(), 'Planning');

    const profile = page.getByRole('button', { name: 'Open profile menu', exact: true });
    await profile.focus(); await page.keyboard.press('ArrowDown');
    assert.equal(await page.evaluate(() => document.activeElement.textContent.trim()), 'Profile / Account');
    await page.keyboard.press('End'); assert.equal(await page.evaluate(() => document.activeElement.textContent.trim()), 'Sign out');
    await page.keyboard.press('Home');
    await scan('profile-menu');
    await page.keyboard.press('Escape'); assert.equal(await profile.evaluate(el => el === document.activeElement), true);
    await profile.click(); await page.getByRole('menuitem', { name: 'Sign out', exact: true }).click();
    await page.getByText('Authentication will be connected later.', { exact: true }).waitFor();
    assert.equal(new URL(page.url()).pathname, '/tasks');
    await page.getByRole('button', { name: 'Dismiss notification' }).click();
    await profile.click(); await page.getByRole('menuitem', { name: 'Security', exact: true }).click();
    await page.waitForURL('**/settings/security');
    assert.equal(await nav.getByRole('link', { name: 'Settings', exact: true }).getAttribute('aria-current'), 'page');

    const notifications = page.getByRole('button', { name: 'Open notifications', exact: true });
    await notifications.click(); await scan('notifications-desktop');
    assert.equal(await page.getByRole('menuitem').count(), 4);
    await page.screenshot({ path: path.join(root, 'workspace-notifications.png') });
    await page.keyboard.press('Escape'); assert.equal(await notifications.evaluate(el => el === document.activeElement), true);
    await notifications.click(); await page.getByRole('menuitem', { name: 'View all notifications', exact: true }).click();
    await page.waitForURL('**/notifications');

    await go('/dashboard');
    await page.keyboard.press('Tab');
    assert.equal(await page.getByRole('link', { name: 'Skip to main content' }).evaluate(el => el === document.activeElement), true);
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('#main-content').evaluate(el => el === document.activeElement), true);

    await page.setViewportSize({ width: 375, height: 812 }); await go('/dashboard');
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    const mobileSearch = page.getByRole('textbox', { name: 'Search workspace' });
    assert.equal(await mobileSearch.evaluate(el => el === document.activeElement), true);
    await mobileSearch.fill('Meeting notes'); await page.keyboard.press('Escape');
    assert.equal(await mobileSearch.isVisible(), false);
    assert.equal(await page.getByRole('button', { name: 'Search', exact: true }).evaluate(el => el === document.activeElement), true);

    const openNav = page.getByRole('button', { name: 'Open navigation', exact: true });
    await openNav.click();
    const drawer = page.getByRole('dialog', { name: 'Workspace navigation' }); await drawer.waitFor();
    const mobileNav = page.getByRole('navigation', { name: 'Mobile workspace' });
    assert.equal(await mobileNav.getByRole('link').count(), 7);
    assert.equal(await drawer.evaluate(el => el.contains(document.activeElement)), true);
    for (let i = 0; i < 12; i++) { await page.keyboard.press('Tab'); assert.equal(await drawer.evaluate(el => el.contains(document.activeElement)), true); }
    await scan('mobile-drawer'); await page.screenshot({ path: path.join(root, 'workspace-mobile-drawer.png') });
    await page.keyboard.press('Escape'); await drawer.waitFor({ state: 'hidden' });
    assert.equal(await openNav.evaluate(el => el === document.activeElement), true);
    await openNav.click(); await page.getByRole('button', { name: 'Close navigation', exact: true }).click(); await drawer.waitFor({ state: 'hidden' });
    await openNav.click(); await page.mouse.click(365, 400); await drawer.waitFor({ state: 'hidden' });
    await openNav.click(); await mobileNav.getByRole('link', { name: 'Meetings', exact: true }).click();
    await page.waitForURL('**/meetings'); await drawer.waitFor({ state: 'hidden' });
    assert.equal(await page.evaluate(() => document.body.style.overflow), '');
    await openNav.click(); await page.setViewportSize({ width: 768, height: 900 }); await drawer.waitFor({ state: 'hidden' });
    assert.equal(await page.evaluate(() => document.body.style.overflow), '');
    await page.setViewportSize({ width: 375, height: 812 });
    await notifications.click(); await overflow(); await scan('notifications-mobile');
    const menu = await page.getByRole('menu').boundingBox(); assert.ok(menu.x >= 0 && menu.x + menu.width <= 375);
    await page.keyboard.press('Escape');
    await profile.click(); await overflow(); await scan('profile-mobile'); await page.keyboard.press('Escape');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    assert.equal(await nav.locator('a').first().evaluate(el => getComputedStyle(el).transitionDuration), '0s');
    assert.deepEqual(apiCalls, []);
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ routes: routes.length, interactions: 'passed', runtimeErrors: errors, apiCalls, accessibility: results }, null, 2));
    assert.ok(results.every(result => result.violations.length === 0), 'Accessibility issues found');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
