/** Create a screen container sized for multiple tracks. */
export function createScreenElement(opts?: {
  width?: number;
  height?: number;
  id?: string;
}): HTMLDivElement {
  const { width = 800, height = 400, id = 'bullet-screen' } = opts || {};
  const el = document.createElement('div');
  el.id = id;
  el.style.position = 'relative';
  el.style.width = `${width}px`;
  el.style.height = `${height}px`;
  document.body.appendChild(el);

  // jsdom returns zeros for getBoundingClientRect; stub meaningful sizes
  jest.spyOn(el, 'getBoundingClientRect').mockReturnValue({
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    bottom: height,
    right: width,
    width,
    height,
    toJSON: () => ({}),
  } as DOMRect);

  return el;
}

/** Stub bullet container rect so track selection can measure distance. */
export function stubBulletRect(
  bullet: HTMLElement,
  rect: Partial<DOMRect> & { width: number; height?: number; left?: number; right?: number }
) {
  const left = rect.left ?? 0;
  const width = rect.width;
  const right = rect.right ?? left + width;
  const height = rect.height ?? 20;
  const top = rect.top ?? 0;
  jest.spyOn(bullet, 'getBoundingClientRect').mockReturnValue({
    x: left,
    y: top,
    top,
    left,
    bottom: top + height,
    right,
    width,
    height,
    toJSON: () => ({}),
  } as DOMRect);
}
