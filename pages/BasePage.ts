import { Page, test } from '@playwright/test';
import path from 'path';

const AD_HOSTS =
  /(googlesyndication|doubleclick|googletagservices|googletagmanager|google-analytics|adservice|adsbygoogle|amazon-adsystem|adnxs|criteo|taboola|outbrain|pubmatic|rubiconproject|ezoic|adplus)/i;

const SCREENSHOT_DIR = path.resolve(__dirname, '../screenshots');

export class BasePage {
  private screenshotCount = 0;

  constructor(protected readonly page: Page) {}

  async open(path: string): Promise<void> {
    await this.page.route('**/*', (route) =>
      AD_HOSTS.test(route.request().url()) ? route.abort() : route.continue(),
    );
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    await this.hideOverlays();
  }

  async screenshot(name: string): Promise<void> {
    const info = test.info();
    this.screenshotCount++;
    const fileName = `${String(this.screenshotCount).padStart(2, '0')}-${slug(name)}.png`;
    const filePath = path.join(SCREENSHOT_DIR, slug(info.titlePath.slice(1).join(' ')), fileName);

    await this.page.screenshot({ path: filePath, animations: 'disabled' });
    await info.attach(name, { path: filePath, contentType: 'image/png' });
  }

  protected async hideOverlays(): Promise<void> {
    await this.page.addStyleTag({
      content: `#fixedban, footer, #adplus-anchor, .adsbygoogle, iframe[id^="google_ads"] { display: none !important; }`,
    });
  }
}

function slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}
