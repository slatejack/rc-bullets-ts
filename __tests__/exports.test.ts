import BulletScreen, { StyledBullet, useBulletScreen } from '../app';

describe('package public exports (app.ts)', () => {
  it('exports BulletScreen as default', () => {
    expect(BulletScreen).toBeDefined();
    expect(typeof BulletScreen).toBe('function');
  });

  it('exports StyledBullet and useBulletScreen as named exports', () => {
    expect(StyledBullet).toBeDefined();
    expect(typeof StyledBullet).toBe('function');
    expect(useBulletScreen).toBeDefined();
    expect(typeof useBulletScreen).toBe('function');
  });
});
