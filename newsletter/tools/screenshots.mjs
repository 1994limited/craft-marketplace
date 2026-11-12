// Screenshots of Newsletter for Craft for its Plugin Store listing: the list in the control
// panel, the confirmation email and the confirm page. Run against a Craft site with the plugin
// installed, some subscribers (one waiting to confirm), and mail written to files
// (the mailer's useFileTransport, so emails land in storage/runtime/mail):
//
//   cd newsletter/tools && npm install
//   SITE=~/Sites/my-site SITE_URL=http://localhost:8091 CP_USER=... CP_PASSWORD=... npm run screenshots
//
// SITE         the site's folder, for a confirm link and the email
// SITE_URL     the site's address (default http://localhost:8091)
// CP_USER      an admin's username and password, to sign in to the control panel
// CP_PASSWORD
// SCREENSHOTS  where to write them (default ./screenshots)
// CHROME       a Chrome or Chromium to drive (default: Google Chrome on macOS)
import { chromium } from 'playwright-core';
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync, readdirSync, statSync } from 'node:fs';

const site = (process.env.SITE || '').replace(/^~/, process.env.HOME);
const base = (process.env.SITE_URL || 'http://localhost:8091').replace(/\/$/, '');
const out = process.env.SCREENSHOTS || new URL('./screenshots', import.meta.url).pathname;
const chrome = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
if (!site || !process.env.CP_USER || !process.env.CP_PASSWORD) throw new Error('Set SITE, CP_USER and CP_PASSWORD');
mkdirSync(out, { recursive: true });

// A pending sign-up's confirm link and address, from Craft itself.
const [email, confirmUrl] = execFileSync('php', ['-r', `
    require 'vendor/autoload.php';
    require 'bootstrap.php';
    $app = require 'vendor/craftcms/cms/bootstrap/console.php';
    $s = nineteenninetyfour\\newsletter\\elements\\Subscriber::find()->status('pending')->one() ?? throw new Exception('No one waiting to confirm');
    echo $s->email, ' ', nineteenninetyfour\\newsletter\\Plugin::getInstance()->subscribers->confirmUrl($s);
`], { cwd: site }).toString().trim().split('\n').pop().split(' ');

// Their confirmation email: the newest one in storage/runtime/mail sent to them, its HTML part.
const mailDir = `${site}/storage/runtime/mail`;
const sent = readdirSync(mailDir).filter((f) => f.endsWith('.eml')).map((f) => `${mailDir}/${f}`).sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs);
const html = sent.map((f) => execFileSync('python3', ['-I', '-c', `
import sys, email
from email import policy
m = email.message_from_binary_file(open(sys.argv[1], 'rb'), policy=policy.default)
if sys.argv[2] in str(m['To']):
    part = m.get_body(('html',))
    print(part.get_content() if part else '')
`, f, email]).toString()).find((h) => h.trim());
if (!html) throw new Error(`No email to ${email} in ${mailDir}`);
writeFileSync(`${out}/email.html`, `<body style="margin:0;padding:24px 40px;background:#fff;font:16px/1.5 system-ui">${html}</body>`);

const browser = await chromium.launch({ executablePath: chrome });
const desktop = { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, colorScheme: 'light' };

async function settle(page) {
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(800);
}

const mail = await (await browser.newContext({ ...desktop, viewport: { width: 720, height: 240 } })).newPage();
await mail.goto(`file://${out}/email.html`);
await settle(mail);
await mail.screenshot({ path: `${out}/email.png` });

const visitor = await (await browser.newContext({ ...desktop, viewport: { width: 1280, height: 720 } })).newPage();
await visitor.goto(confirmUrl);
await settle(visitor);
await visitor.screenshot({ path: `${out}/confirm-page.png` });

// The list, signed in.
const cp = await (await browser.newContext(desktop)).newPage();
await cp.goto(`${base}/admin/login`);
await settle(cp);
await cp.locator('input[name=username]').first().fill(process.env.CP_USER);
await cp.locator('input[name=password]').first().fill(process.env.CP_PASSWORD);
await cp.locator('button[type=submit]').first().click();
await cp.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 20000 });
await cp.goto(`${base}/admin/newsletter`);
await settle(cp);
// Craft focuses the search box; take the focus away so it isn't ringed.
await cp.evaluate(() => document.activeElement?.blur());
await cp.waitForTimeout(300);
await cp.screenshot({ path: `${out}/cp-list.png` });

await browser.close();
console.log(`Screenshots in ${out}`);
