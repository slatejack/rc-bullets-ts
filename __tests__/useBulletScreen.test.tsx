import React from 'react';
import { render, act, screen } from '@testing-library/react';
import useBulletScreen from '../src/hooks/useBulletScreen';
import { createScreenElement } from './__helpers__/dom';

function HookProbe({ ele }: { ele: HTMLElement }) {
  const api = useBulletScreen(ele);
  return (
    <div>
      <span data-testid="count">{api.count}</span>
      <button type="button" onClick={() => api.sendBullet('from-hook')}>
        send
      </button>
      <button type="button" onClick={() => api.pause()}>
        pause
      </button>
      <button type="button" onClick={() => api.resume()}>
        resume
      </button>
      <button type="button" onClick={() => api.hide()}>
        hide
      </button>
      <button type="button" onClick={() => api.show()}>
        show
      </button>
      <button type="button" onClick={() => api.reset()}>
        reset
      </button>
      <span data-testid="has-screen">{api.screen ? 'yes' : 'no'}</span>
    </div>
  );
}

describe('useBulletScreen', () => {
  it('initializes screen after mount (module instance visible after re-render)', () => {
    const el = createScreenElement();
    render(<HookProbe ele={el} />);
    expect(screen.getByTestId('count').textContent).toBe('0');

    // useEffect assigns module-level screen; sendBullet triggers setState re-render
    act(() => {
      screen.getByText('send').click();
    });
    expect(screen.getByTestId('count').textContent).toBe('1');
    expect(screen.getByTestId('has-screen').textContent).toBe('yes');
    expect(el.textContent).toContain('from-hook');
  });

  it('sendBullet increases count and renders content', () => {
    const el = createScreenElement();
    render(<HookProbe ele={el} />);

    act(() => {
      screen.getByText('send').click();
    });

    expect(screen.getByTestId('count').textContent).toBe('1');
    expect(el.textContent).toContain('from-hook');
  });

  it('pause / resume / hide / show / reset work without throwing', () => {
    const el = createScreenElement();
    render(<HookProbe ele={el} />);

    act(() => {
      screen.getByText('send').click();
    });

    act(() => {
      screen.getByText('pause').click();
      screen.getByText('resume').click();
      screen.getByText('hide').click();
      screen.getByText('show').click();
      screen.getByText('reset').click();
    });

    expect(screen.getByTestId('count').textContent).toBe('0');
  });
});
