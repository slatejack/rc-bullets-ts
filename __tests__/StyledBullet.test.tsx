import React from 'react';
import { render, screen } from '@testing-library/react';
import StyledBullet from '../src/styleBullet';

describe('StyledBullet', () => {
  it('renders message text', () => {
    render(<StyledBullet msg="hello danmaku" />);
    expect(screen.getByText('hello danmaku')).toBeInTheDocument();
  });

  it('renders head image when head is provided', () => {
    render(<StyledBullet msg="with head" head="https://example.com/a.jpg" />);
    const img = screen.getByAltText('msg head') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toBe('https://example.com/a.jpg');
  });

  it('omits head image when head is absent', () => {
    render(<StyledBullet msg="no head" />);
    expect(screen.queryByAltText('msg head')).not.toBeInTheDocument();
  });

  it('applies preset size fonts', () => {
    const { container, rerender } = render(<StyledBullet msg="s" size="small" />);
    expect((container.firstChild as HTMLElement).style.fontSize).toBe('10px');

    rerender(<StyledBullet msg="n" size="normal" />);
    expect((container.firstChild as HTMLElement).style.fontSize).toBe('12px');

    rerender(<StyledBullet msg="l" size="large" />);
    expect((container.firstChild as HTMLElement).style.fontSize).toBe('14px');

    rerender(<StyledBullet msg="h" size="huge" />);
    expect((container.firstChild as HTMLElement).style.fontSize).toBe('16px');
  });

  it('accepts custom size string as fontSize', () => {
    const { container } = render(<StyledBullet msg="custom" size="20px" />);
    expect((container.firstChild as HTMLElement).style.fontSize).toBe('20px');
  });

  it('applies backgroundColor and explicit color', () => {
    const { container } = render(
      <StyledBullet msg="styled" backgroundColor="#112233" color="#ff0000" />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.backgroundColor).toBe('rgb(17, 34, 51)');
    expect(screen.getByText('styled').style.color).toBe('rgb(255, 0, 0)');
  });

  it('auto-picks contrasting text color when color omitted', () => {
    render(<StyledBullet msg="auto" backgroundColor="#ffffff" />);
    expect(screen.getByText('auto').style.color).toBe('rgb(80, 97, 109)');
  });
});
