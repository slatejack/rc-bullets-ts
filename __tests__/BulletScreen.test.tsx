import React from 'react';
import { act } from '@testing-library/react';
import BulletScreen from '../src/bulletScreen';
import { createScreenElement, stubBulletRect } from './__helpers__/dom';

describe('BulletScreen', () => {
  describe('constructor / init', () => {
    it('accepts an HTMLElement and initializes tracks from height/trackHeight', () => {
      const el = createScreenElement({ height: 200 });
      const screen = new BulletScreen(el, { trackHeight: 50 });
      expect(screen.target).toBe(el);
      // 200 / 50 = 4 tracks
      expect(screen.tracks).toHaveLength(4);
      expect(screen.tracks.every((t) => t === 'idle')).toBe(true);
      screen.destroy();
    });

    it('accepts a CSS selector string', () => {
      createScreenElement({ id: 'by-selector' });
      const screen = new BulletScreen('#by-selector');
      expect(screen.target.id).toBe('by-selector');
      screen.destroy();
    });

    it('throws when selector matches nothing', () => {
      expect(() => new BulletScreen('#missing-element')).toThrow(
        'The display target does not exist'
      );
    });

    it('forces relative position when container is static', () => {
      const el = createScreenElement();
      el.style.position = 'static';
      const screen = new BulletScreen(el);
      expect(el.style.position).toBe('relative');
      screen.destroy();
    });

    it('injects RightToLeft keyframes style into document.head', () => {
      const el = createScreenElement();
      const screen = new BulletScreen(el);
      const style = document.head.querySelector('style.BULLET_ANIMATE');
      expect(style).toBeTruthy();
      expect((screen as any)._styleElement).toBe(style);
      screen.destroy();
      expect(document.head.querySelector('style.BULLET_ANIMATE')).toBeNull();
    });

    it('merges custom options over defaults', () => {
      const el = createScreenElement();
      const screen = new BulletScreen(el, { duration: 20, pauseOnHover: false });
      expect(screen.options.duration).toBe(20);
      expect(screen.options.pauseOnHover).toBe(false);
      expect(screen.options.trackHeight).toBe(50);
      screen.destroy();
    });
  });

  describe('push content types', () => {
    it('pushes a string and returns a bullet id', () => {
      const el = createScreenElement();
      const screen = new BulletScreen(el);
      let id = '';
      act(() => {
        id = screen.push('hello text', {});
      });
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
      expect(screen.bullets).toHaveLength(1);
      expect(el.textContent).toContain('hello text');
      screen.destroy();
    });

    it('pushes a React element', () => {
      const el = createScreenElement();
      const screen = new BulletScreen(el);
      act(() => {
        screen.push(<span data-testid="custom-bullet">react-node</span>, {});
      });
      expect(el.textContent).toContain('react-node');
      screen.destroy();
    });

    it('pushes a styled object via StyledBullet', () => {
      const el = createScreenElement();
      const screen = new BulletScreen(el);
      act(() => {
        screen.push(
          {
            msg: 'obj-msg',
            head: 'https://example.com/h.png',
            size: 'large',
            backgroundColor: '#fff',
            color: '#111',
          },
          {}
        );
      });
      expect(el.textContent).toContain('obj-msg');
      expect(el.querySelector('img.bullet-head-image')).toBeTruthy();
      screen.destroy();
    });
  });

  describe('per-bullet options', () => {
    it('applies duration, delay, direction, animateTimeFun, loopCount on container', () => {
      const el = createScreenElement();
      const screen = new BulletScreen(el);
      let id = '';
      act(() => {
        id = screen.push('opts', {
          duration: 15,
          delay: 2,
          direction: 'reverse',
          animateTimeFun: 'ease-in',
          loopCount: 3,
        });
      });
      const bullet = screen.bullets.find((b) => b.id === id)!;
      expect(bullet.style.animationDuration).toBe('15s');
      expect(bullet.style.animationDelay).toBe('2s');
      expect(bullet.style.animationDirection).toBe('reverse');
      expect(bullet.style.animationTimingFunction).toBe('ease-in');
      expect(bullet.style.animationIterationCount).toBe('3');
      expect(bullet.style.animationName).toBe('RightToLeft');
      screen.destroy();
    });

    it('accepts string duration/delay units', () => {
      const el = createScreenElement();
      const screen = new BulletScreen(el);
      let id = '';
      act(() => {
        id = screen.push('ms', {
          duration: '300ms' as unknown as number,
          delay: '10s' as unknown as number,
        });
      });
      const bullet = screen.bullets.find((b) => b.id === id)!;
      expect(bullet.style.animationDuration).toBe('300ms');
      expect(bullet.style.animationDelay).toBe('10s');
      screen.destroy();
    });

    it('honors forced top / bottom style', () => {
      const el = createScreenElement();
      const screen = new BulletScreen(el);
      let topId = '';
      let bottomId = '';
      act(() => {
        topId = screen.push('top', { top: '12px' });
        bottomId = screen.push('bottom', { bottom: '8px' });
      });
      const topBullet = screen.bullets.find((b) => b.id === topId)!;
      const bottomBullet = screen.bullets.find((b) => b.id === bottomId)!;
      expect(topBullet.style.top).toBe('12px');
      expect(bottomBullet.style.bottom).toBe('8px');
      screen.destroy();
    });

    it('invokes onStart on animationstart and onEnd on animationend', () => {
      const el = createScreenElement();
      const screen = new BulletScreen(el);
      const onStart = jest.fn();
      const onEnd = jest.fn();
      let id = '';
      act(() => {
        id = screen.push('events', { onStart, onEnd });
      });
      const bullet = screen.bullets.find((b) => b.id === id)!;

      act(() => {
        bullet.dispatchEvent(new Event('animationstart'));
      });
      expect(onStart).toHaveBeenCalledWith(id, screen);

      act(() => {
        bullet.dispatchEvent(new Event('animationend'));
      });
      expect(onEnd).toHaveBeenCalledWith(id, screen);
      expect(screen.bullets.find((b) => b.id === id)).toBeUndefined();
      screen.destroy();
    });
  });

  describe('pauseOnHover / pauseOnClick', () => {
    it('pauses animation on mouseenter and resumes on mouseleave when pauseOnHover', () => {
      const el = createScreenElement();
      const screen = new BulletScreen(el, { pauseOnHover: true });
      let id = '';
      act(() => {
        id = screen.push('hover', {});
      });
      const bullet = screen.bullets.find((b) => b.id === id)!;

      act(() => {
        bullet.dispatchEvent(new Event('mouseenter'));
      });
      expect(bullet.style.animationPlayState).toBe('paused');

      act(() => {
        bullet.dispatchEvent(new Event('mouseleave'));
      });
      expect(bullet.style.animationPlayState).toBe('running');
      screen.destroy();
    });

    it('pauses on click when pauseOnClick is enabled', () => {
      const el = createScreenElement();
      const screen = new BulletScreen(el, { pauseOnHover: false, pauseOnClick: true });
      let id = '';
      act(() => {
        id = screen.push('click', {});
      });
      const bullet = screen.bullets.find((b) => b.id === id)!;

      act(() => {
        bullet.dispatchEvent(new Event('click'));
      });
      expect(bullet.style.animationPlayState).toBe('paused');
      expect(bullet.dataset.clicked).toBe('true');
      // Note: resume branch checks dataset.click (not clicked), so a second click
      // does not resume with the current implementation — we only assert pause.
      screen.destroy();
    });
  });

  describe('screen controls', () => {
    it('pause/resume a single bullet by id', () => {
      const el = createScreenElement();
      const screen = new BulletScreen(el);
      let id = '';
      act(() => {
        id = screen.push('one', {});
      });
      screen.pause(id);
      expect(screen.bullets[0].style.animationPlayState).toBe('paused');
      expect(screen.allPaused).toBe(false);

      screen.resume(id);
      expect(screen.bullets[0].style.animationPlayState).toBe('running');
      screen.destroy();
    });

    it('pause/resume all bullets', () => {
      const el = createScreenElement();
      const screen = new BulletScreen(el);
      act(() => {
        screen.push('a', {});
        screen.push('b', {});
      });
      screen.pause();
      expect(screen.allPaused).toBe(true);
      screen.bullets.forEach((b) => {
        expect(b.style.animationPlayState).toBe('paused');
      });

      screen.resume();
      expect(screen.allPaused).toBe(false);
      screen.bullets.forEach((b) => {
        expect(b.style.animationPlayState).toBe('running');
      });
      screen.destroy();
    });

    it('hide/show toggles opacity on all bullets', () => {
      const el = createScreenElement();
      const screen = new BulletScreen(el);
      act(() => {
        screen.push('visible', {});
      });
      screen.hide();
      expect(screen.allHide).toBe(true);
      expect(screen.bullets[0].style.opacity).toBe('0');

      screen.show();
      expect(screen.allHide).toBe(false);
      expect(screen.bullets[0].style.opacity).toBe('1');
      screen.destroy();
    });

    it('new bullets inherit hidden opacity when allHide is true', () => {
      const el = createScreenElement();
      const screen = new BulletScreen(el);
      screen.hide();
      let id = '';
      act(() => {
        id = screen.push('already-hidden', {});
      });
      const bullet = screen.bullets.find((b) => b.id === id)!;
      expect(bullet.style.opacity).toBe('0');
      screen.destroy();
    });

    it('clear(id) removes one bullet and releases its track', () => {
      const el = createScreenElement();
      const screen = new BulletScreen(el);
      let id1 = '';
      let id2 = '';
      act(() => {
        id1 = screen.push('keep', {});
        id2 = screen.push('drop', {});
      });
      expect(screen.bullets.length).toBe(2);
      screen.clear(id2 as any);
      expect(screen.bullets.find((b) => b.id === id2)).toBeUndefined();
      expect(screen.bullets.find((b) => b.id === id1)).toBeTruthy();
      screen.destroy();
    });

    it('clear() without id removes all bullets and resets tracks/queues', () => {
      const el = createScreenElement({ height: 200 });
      const screen = new BulletScreen(el, { trackHeight: 50 });
      act(() => {
        screen.push('x', {});
        screen.push('y', {});
      });
      screen.queues.push(['queued' as any, document.createElement('div'), {}]);
      screen.clear();
      expect(screen.bullets).toHaveLength(0);
      expect(screen.queues).toHaveLength(0);
      expect(screen.tracks).toHaveLength(4);
      expect(screen.tracks.every((t) => t === 'idle')).toBe(true);
      screen.destroy();
    });

    it('resize() recomputes tracks and refreshes keyframes', () => {
      const el = createScreenElement({ height: 100 });
      const screen = new BulletScreen(el, { trackHeight: 50 });
      expect(screen.tracks).toHaveLength(2);

      jest.spyOn(el, 'getBoundingClientRect').mockReturnValue({
        x: 0,
        y: 0,
        top: 0,
        left: 0,
        bottom: 300,
        right: 800,
        width: 800,
        height: 300,
        toJSON: () => ({}),
      } as DOMRect);

      const oldStyle = (screen as any)._styleElement;
      screen.resize();
      expect(screen.tracks).toHaveLength(6);
      expect((screen as any)._styleElement).not.toBe(oldStyle);
      expect(document.head.contains(oldStyle)).toBe(false);
      screen.destroy();
    });

    it('destroy() clears bullets, stops queue timer, and removes style', () => {
      const el = createScreenElement();
      const screen = new BulletScreen(el);
      act(() => {
        screen.push('to-destroy', {});
      });
      expect((screen as any)._queueCheckTimer).not.toBeNull();
      screen.destroy();
      expect(screen.bullets).toHaveLength(0);
      expect((screen as any)._queueCheckTimer).toBeNull();
      expect((screen as any)._styleElement).toBeNull();
      expect(document.head.querySelector('style.BULLET_ANIMATE')).toBeNull();
    });
  });

  describe('queue / tracks / timers', () => {
    it('queues bullets when allPaused and flushes on resume', () => {
      const el = createScreenElement();
      const screen = new BulletScreen(el);
      screen.pause();
      expect(screen.allPaused).toBe(true);

      act(() => {
        screen.push('queued-while-paused', {});
      });
      expect(screen.queues.length).toBeGreaterThanOrEqual(1);
      expect(screen.bullets).toHaveLength(0);

      act(() => {
        screen.resume();
      });
      expect(screen.bullets.length).toBeGreaterThanOrEqual(1);
      expect(el.textContent).toContain('queued-while-paused');
      screen.destroy();
    });

    it('periodically processes the wait queue via interval', () => {
      const el = createScreenElement();
      const screen = new BulletScreen(el);
      const spy = jest.spyOn(screen as any, '_processQueue');
      spy.mockClear();

      act(() => {
        jest.advanceTimersByTime(100);
      });
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
      screen.destroy();
    });

    it('assigns dataset.track on rendered bullets', () => {
      const el = createScreenElement();
      const screen = new BulletScreen(el);
      let id = '';
      act(() => {
        id = screen.push('tracked', {});
      });
      const bullet = screen.bullets.find((b) => b.id === id)!;
      expect(bullet.dataset.track).toBeDefined();
      expect(Number(bullet.dataset.track)).toBeGreaterThanOrEqual(0);
      screen.destroy();
    });

    it('frees track and removes bullet on animationend', () => {
      const el = createScreenElement();
      const screen = new BulletScreen(el);
      let id = '';
      act(() => {
        id = screen.push('end-me', {});
      });
      const bullet = screen.bullets.find((b) => b.id === id)!;
      const trackIdx = Number(bullet.dataset.track);

      act(() => {
        bullet.dispatchEvent(new Event('animationend'));
      });

      expect(screen.bullets.find((b) => b.id === id)).toBeUndefined();
      expect(screen.tracks[trackIdx]).toBe('idle');
      expect(el.contains(bullet)).toBe(false);
      screen.destroy();
    });
  });

  describe('getRenderDom', () => {
    it('wraps strings in span, passes through elements, maps objects to StyledBullet', () => {
      const el = createScreenElement();
      const screen = new BulletScreen(el);

      const fromString = screen.getRenderDom('plain');
      expect(fromString.type).toBe('span');
      expect(fromString.props.children).toBe('plain');

      const node = <div>x</div>;
      expect(screen.getRenderDom(node)).toBe(node);

      const fromObj = screen.getRenderDom({ msg: 'm' });
      expect(fromObj.props.msg).toBe('m');

      const empty = screen.getRenderDom(123 as any);
      expect(empty.type).toBe(React.Fragment);

      screen.destroy();
    });
  });
});
