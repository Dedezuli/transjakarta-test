import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ResizableLocators as L } from '../locators/resizable.locators';

export interface Size {
  width: number;
  height: number;
}

export class ResizablePage extends BasePage {
  readonly box: Locator;
  readonly handle: Locator;

  constructor(page: Page) {
    super(page);
    this.box = page.locator(L.restrictedBox);
    this.handle = page.locator(L.restrictedBoxHandle);
  }

  async goto(): Promise<void> {
    await this.open('/resizable');
    await expect(this.box).toBeVisible();
  }

  async getSize(): Promise<Size> {
    return this.box.evaluate((el: HTMLElement) => ({ width: el.offsetWidth, height: el.offsetHeight }));
  }

  private async dragHandleBy(dx: number, dy: number): Promise<void> {
    await this.handle.scrollIntoViewIfNeeded();
    const h = await this.handle.boundingBox();
    if (!h) throw new Error('Handle resize tidak terlihat');
    const startX = h.x + h.width / 2;
    const startY = h.y + h.height / 2;

    await this.page.mouse.move(startX, startY);
    await this.page.mouse.down();
    await this.page.mouse.move(startX + dx, startY + dy, { steps: 15 });
    await this.page.mouse.up();
  }

  async resizeTo(target: Size): Promise<void> {
    for (let attempt = 0; attempt < 3; attempt++) {
      const current = await this.getSize();
      const dx = target.width - current.width;
      const dy = target.height - current.height;
      if (dx === 0 && dy === 0) return;
      await this.dragHandleBy(dx, dy);
    }
  }

  async expectSize(expected: Size): Promise<void> {
    await expect.poll(() => this.getSize()).toEqual(expected);
  }
}
