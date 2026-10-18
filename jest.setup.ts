import '@testing-library/jest-dom';

class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
  private callback: IntersectionObserverCallback;
  private elements = new Set<Element>();

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.callback = callback;
    this.root = (options?.root as Element) ?? null;
    this.rootMargin = options?.rootMargin ?? '';
    this.thresholds = options?.threshold
      ? Array.isArray(options.threshold)
        ? options.threshold
        : [options.threshold]
      : [0];
    (MockIntersectionObserver.instances as MockIntersectionObserver[]).push(this);
  }

  static instances: MockIntersectionObserver[] = [];

  static reset() {
    MockIntersectionObserver.instances = [];
  }

  observe(target: Element) {
    this.elements.add(target);
    // Simulate fully visible by default so tracks can progress
    this.callback(
      [
        {
          target,
          isIntersecting: true,
          intersectionRatio: 1,
          boundingClientRect: target.getBoundingClientRect(),
          intersectionRect: target.getBoundingClientRect(),
          rootBounds: null,
          time: Date.now(),
        } as IntersectionObserverEntry,
      ],
      this
    );
  }

  unobserve(target: Element) {
    this.elements.delete(target);
  }

  disconnect() {
    this.elements.clear();
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  trigger(ratio: number) {
    const entries = Array.from(this.elements).map(
      (target) =>
        ({
          target,
          isIntersecting: ratio > 0,
          intersectionRatio: ratio,
          boundingClientRect: target.getBoundingClientRect(),
          intersectionRect: target.getBoundingClientRect(),
          rootBounds: null,
          time: Date.now(),
        }) as IntersectionObserverEntry
    );
    this.callback(entries, this);
  }
}

(global as any).IntersectionObserver = MockIntersectionObserver;
(global as any).MockIntersectionObserver = MockIntersectionObserver;

beforeEach(() => {
  MockIntersectionObserver.reset();
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
  document.head.querySelectorAll('style.BULLET_ANIMATE').forEach((el) => el.remove());
  document.body.innerHTML = '';
});

const originalError = console.error;
const originalLog = console.log;
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
    const msg = String(args[0] ?? '');
    if (
      msg.includes('unmountComponentAtNode') ||
      msg.includes('createRoot') ||
      msg.includes('not a top-level container')
    ) {
      return;
    }
    originalError(...(args as Parameters<typeof console.error>));
  });
  jest.spyOn(console, 'log').mockImplementation(() => undefined);
});
afterAll(() => {
  (console.error as jest.Mock).mockRestore?.();
  (console.log as jest.Mock).mockRestore?.();
});
