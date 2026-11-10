import { Page } from '@playwright/test';

const AD_HOSTS =
  /(googlesyndication|doubleclick|googletagservices|googletagmanager|google-analytics|adservice|adsbygoogle|amazon-adsystem|adnxs|criteo|taboola|outbrain|pubmatic|rubiconproject|ezoic|adplus)/i;

export class BasePage {
  constructor(protected readonly page: Page) {}

  async open(path: string): Promise<void> {
    await this.page.route('**/*', (route) =>
      AD_HOSTS.test(route.request().url()) ? route.abort() : route.continue(),
    );
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    await this.hideOverlays();
  }

  protected async hideOverlays(): Promise<void> {
    await this.page.addStyleTag({
      content: `#fixedban, footer, #adplus-anchor, .adsbygoogle, iframe[id^="google_ads"] { display: none !important; }`,
    });
  }
}
