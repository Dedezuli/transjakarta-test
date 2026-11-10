import { test, expect } from '@playwright/test';
import { ResizablePage } from '../pages/ResizablePage';
import resizeData from '../data/resizable.json';

test.describe('Soal 3 - Resize Element (Resizable)', () => {
  test(`mengubah ukuran elemen menjadi ${resizeData.targetWidth} x ${resizeData.targetHeight} piksel`, async ({ page }) => {
    const resizable = new ResizablePage(page);
    const target = { width: resizeData.targetWidth, height: resizeData.targetHeight };

    await resizable.goto();

    const initial = await resizable.getSize();
    expect(initial).not.toEqual(target);
    await resizable.screenshot(`ukuran awal ${initial.width}x${initial.height}`);

    await resizable.resizeTo(target);

    await resizable.expectSize(target);
    await resizable.screenshot(`ukuran akhir ${target.width}x${target.height}`);
  });
});
