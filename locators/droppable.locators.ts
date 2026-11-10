const ACCEPT_PANEL = '[role="tabpanel"]:has-text("Not Acceptable")';

export const DroppableLocators = {
  simpleTab: '#droppableExample-tab-simple',
  acceptTab: '#droppableExample-tab-accept',

  simpleContainer: '#simpleDropContainer',
  simpleDraggable: '#simpleDropContainer #draggable',
  simpleDroppable: '#simpleDropContainer #droppable',

  acceptPanel: ACCEPT_PANEL,
  acceptableBox: `${ACCEPT_PANEL} >> text="Acceptable"`,
  notAcceptableBox: `${ACCEPT_PANEL} >> text="Not Acceptable"`,
  acceptDroppable: `${ACCEPT_PANEL} .drop-box`,

  notDroppedText: /^\s*drop here\s*$/i,
  droppedText: /^\s*dropped!\s*$/i,
  droppedHighlightClass: /ui-state-highlight/,

  draggableReadyClass: /ui-draggable/,
  droppableReadyClass: /ui-droppable/,
} as const;
