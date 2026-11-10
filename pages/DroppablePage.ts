import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { DroppableLocators as L } from '../locators/droppable.locators';

export class DroppablePage extends BasePage {
  readonly simpleDraggable: Locator;
  readonly simpleDroppable: Locator;
  readonly acceptableBox: Locator;
  readonly notAcceptableBox: Locator;
  readonly acceptDroppable: Locator;

  constructor(page: Page) {
    super(page);
    this.simpleDraggable = page.locator(L.simpleDraggable);
    this.simpleDroppable = page.locator(L.simpleDroppable);
    this.acceptableBox = page.locator(L.acceptableBox);
    this.notAcceptableBox = page.locator(L.notAcceptableBox);
    this.acceptDroppable = page.locator(L.acceptDroppable);
  }

  async goto(): Promise<void> {
    await this.open('/droppable');
    await expect(this.simpleDraggable).toBeVisible();
  }

  async openAcceptTab(): Promise<void> {
    await this.page.locator(L.acceptTab).click();
    await expect(this.acceptableBox).toBeVisible();
  }

  async dragAndDrop(source: Locator, target: Locator): Promise<void> {
    // tunggu jQuery UI siap, kalau belum drop-nya tidak kebaca
    await expect(source).toHaveClass(L.draggableReadyClass);
    await expect(target).toHaveClass(L.droppableReadyClass);
    await source.scrollIntoViewIfNeeded();
    const s = await source.boundingBox();
    const t = await target.boundingBox();
    if (!s || !t) throw new Error('Elemen source/target tidak terlihat');

    await this.page.mouse.move(s.x + s.width / 2, s.y + s.height / 2);
    await this.page.mouse.down();
    await this.page.mouse.move(t.x + t.width / 2, t.y + t.height / 2, { steps: 20 });
    await this.page.mouse.up();
  }

  async dragSimpleToTarget(): Promise<void> {
    await this.dragAndDrop(this.simpleDraggable, this.simpleDroppable);
  }

  async expectDropped(target: Locator): Promise<void> {
    await expect(target).toHaveText(L.droppedText);
    await expect(target).toHaveClass(L.droppedHighlightClass);
  }

  async expectNotDropped(target: Locator): Promise<void> {
    await expect(target).toHaveText(L.notDroppedText);
  }

  async expectInsideTarget(source: Locator, target: Locator): Promise<void> {
    const s = await source.boundingBox();
    const t = await target.boundingBox();
    if (!s || !t) throw new Error('Elemen source/target tidak terlihat');
    const cx = s.x + s.width / 2;
    const cy = s.y + s.height / 2;
    expect(cx).toBeGreaterThanOrEqual(t.x);
    expect(cx).toBeLessThanOrEqual(t.x + t.width);
    expect(cy).toBeGreaterThanOrEqual(t.y);
    expect(cy).toBeLessThanOrEqual(t.y + t.height);
  }
}
