// Opens app/<file> straight from disk with the clock frozen at `when` (local time), and returns a list
// that fills with any uncaught page errors, so a test can check the page ran cleanly.
const path = require('path');
const { pathToFileURL } = require('url');

async function openApp(page, file, when = '2026-10-26T10:00:00') {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.clock.install({ time: new Date(when) });
  await page.goto(pathToFileURL(path.join(__dirname, '..', 'app', file)).href);
  return errors;
}

module.exports = { openApp };
