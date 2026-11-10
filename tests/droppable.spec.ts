import { test } from '@playwright/test';
import { DroppablePage } from '../pages/DroppablePage';

test.describe('Soal 2 - Drag and Drop (Droppable)', () => {
  let droppable: DroppablePage;

  test.beforeEach(async ({ page }) => {
    droppable = new DroppablePage(page);
    await droppable.goto();
  });

  test('Simple: elemen "Drag me" berhasil di-drop ke area target', async () => {
    await droppable.expectNotDropped(droppable.simpleDroppable);

    await droppable.dragSimpleToTarget();

    await droppable.expectDropped(droppable.simpleDroppable);
    await droppable.expectInsideTarget(droppable.simpleDraggable, droppable.simpleDroppable);
  });

  test('Accept: hanya elemen "Acceptable" yang diterima area target', async () => {
    await droppable.openAcceptTab();

    await droppable.dragAndDrop(droppable.notAcceptableBox, droppable.acceptDroppable);
    await droppable.expectNotDropped(droppable.acceptDroppable);

    await droppable.dragAndDrop(droppable.acceptableBox, droppable.acceptDroppable);
    await droppable.expectDropped(droppable.acceptDroppable);
  });
});
