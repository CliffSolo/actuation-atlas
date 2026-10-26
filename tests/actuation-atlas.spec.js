// Actuation Atlas: default switches, search + add, quick-add chips, show/hide, remove, reset, spec table, saving.
const { test, expect } = require('@playwright/test');
const { openApp } = require('./helpers');

const open = (page) => openApp(page, 'actuation-atlas.html');
const curves = (page) => page.locator('#chartSvg path.switch-line');
const activeNames = (page) => page.locator('#activeList .active-row .n');
const activeRow = (page, name) => page.locator('#activeList .active-row', { has: page.locator('.n', { hasText: name }) });
const tableRow = (page, name) => page.locator('#specTableBody tr', { has: page.locator('.name-cell', { hasText: name }) });
const DEFAULTS = ['Cherry MX Red', 'Cherry MX Brown', 'Cherry MX Blue'];

test('loads with no errors and layers the 3 default Cherry switches', async ({ page }) => {
  const errors = await open(page);
  await expect(activeNames(page)).toHaveText(DEFAULTS);
  await expect(curves(page)).toHaveCount(3);
  await expect(page.locator('#chartSvg .actuation-dot')).toHaveCount(3);
  await expect(page.locator('#specTableBody tr')).toHaveCount(3);
  expect(errors).toEqual([]);
});

test('the spec table shows each switch\'s numbers', async ({ page }) => {
  await open(page);
  await expect(tableRow(page, 'Cherry MX Brown').locator('td')).toHaveText(['Cherry MX Brown', 'Tactile', '2.0mm', '4.0mm', '45g', '55g', '55g']);
  await expect(tableRow(page, 'Cherry MX Red').locator('td').last()).toHaveText('—'); // linear: no tactile bump
});

test('each actuation dot names the switch, force and travel', async ({ page }) => {
  await open(page);
  await expect(page.locator('#chartSvg .actuation-dot[data-id="cherry-mx-red"] title')).toHaveText('Cherry MX Red · actuation 45g at 2.0mm');
});

test('searching by name and clicking a result adds that switch', async ({ page }) => {
  await open(page);
  await page.fill('#searchInput', 'box');
  await expect(page.locator('#searchResults .result-row')).toHaveCount(2);
  await page.locator('#searchResults .result-row', { hasText: 'Kailh Box Navy' }).click();
  await expect(activeRow(page, 'Kailh Box Navy')).toHaveCount(1);
  await expect(curves(page)).toHaveCount(4);
  await expect(page.locator('#searchInput')).toHaveValue('');
});

test('searching by brand lists that brand\'s switches', async ({ page }) => {
  await open(page);
  await page.fill('#searchInput', 'gateron');
  await expect(page.locator('#searchResults .r-brand')).toHaveText(['Gateron', 'Gateron', 'Gateron', 'Gateron', 'Gateron']);
});

test('switches already on the chart are left out of the search', async ({ page }) => {
  await open(page);
  await page.fill('#searchInput', 'cherry mx');
  await expect(page.locator('#searchResults .result-row')).toHaveText([/Cherry MX Black/, /Cherry MX Speed Silver/]);
});

test('Enter adds the first search result', async ({ page }) => {
  await open(page);
  await page.fill('#searchInput', 'holy');
  await page.press('#searchInput', 'Enter');
  await expect(activeRow(page, 'Holy Panda')).toHaveCount(1);
});

test('an unknown switch shows the not-found message', async ({ page }) => {
  await open(page);
  await page.fill('#searchInput', 'zzz-not-a-switch');
  await expect(page.locator('#notFoundMsg')).toBeVisible();
  await expect(page.locator('#searchResults')).toBeHidden();
});

test('quick-add chips add a switch in one click', async ({ page }) => {
  await open(page);
  await expect(page.locator('#quickAdd .chip')).toHaveCount(6);
  const name = await page.locator('#quickAdd .chip').first().innerText();
  await page.locator('#quickAdd .chip').first().click();
  await expect(activeRow(page, name)).toHaveCount(1);
  await expect(page.locator('#quickAdd .chip', { hasText: name })).toHaveCount(0);
});

test('hiding a curve takes it off the chart; hiding all shows the empty message', async ({ page }) => {
  await open(page);
  await activeRow(page, 'Cherry MX Red').locator('.vis-toggle').click();
  await expect(curves(page)).toHaveCount(2);
  await expect(page.locator('#chartSvg path.switch-line[data-id="cherry-mx-red"]')).toHaveCount(0);
  for (const n of ['Cherry MX Brown', 'Cherry MX Blue']) await activeRow(page, n).locator('.vis-toggle').click();
  await expect(page.locator('#emptyState')).toBeVisible();
});

test('removing a switch takes it out of the list, chart and table', async ({ page }) => {
  await open(page);
  await activeRow(page, 'Cherry MX Blue').locator('.remove-btn').click();
  await expect(activeNames(page)).toHaveText(['Cherry MX Red', 'Cherry MX Brown']);
  await expect(curves(page)).toHaveCount(2);
  await expect(tableRow(page, 'Cherry MX Blue')).toHaveCount(0);
});

test('Reset goes back to the 3 default switches', async ({ page }) => {
  await open(page);
  await activeRow(page, 'Cherry MX Red').locator('.remove-btn').click();
  await page.fill('#searchInput', 'alpaca');
  await page.press('#searchInput', 'Enter');
  await page.click('#resetBtn');
  await expect(activeNames(page)).toHaveText(DEFAULTS);
});

test('the layered switches and hidden curves are kept after a reload', async ({ page }) => {
  await open(page);
  await page.fill('#searchInput', 'piano');
  await page.press('#searchInput', 'Enter');
  await activeRow(page, 'Cherry MX Red').locator('.vis-toggle').click();
  await page.reload();
  await expect(activeNames(page)).toHaveText([...DEFAULTS, 'Akko Piano Pro (V3)']);
  await expect(curves(page)).toHaveCount(3);
});
