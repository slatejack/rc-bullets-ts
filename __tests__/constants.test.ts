import { TRACK_STATUS, ANIMATION_PLAY_STATE, SAFE_DISTANCE } from '../src/constants/common';
import { defaultOptions } from '../src/utils/bulletHelper';

describe('constants and default options', () => {
  it('exposes track status values', () => {
    expect(TRACK_STATUS).toEqual({
      free: 'idle',
      feed: 'feed',
      occupied: 'running',
    });
  });

  it('exposes animation play states', () => {
    expect(ANIMATION_PLAY_STATE).toEqual({
      paused: 'paused',
      running: 'running',
    });
  });

  it('defines SAFE_DISTANCE', () => {
    expect(SAFE_DISTANCE).toBe(80);
  });

  it('provides expected default ScreenOpsTypes', () => {
    expect(defaultOptions).toMatchObject({
      trackHeight: 50,
      gap: '10px',
      animate: 'RightToLeft',
      pauseOnHover: true,
      pauseOnClick: false,
      loopCount: 1,
      duration: 10,
      delay: 0,
      direction: 'normal',
      animateTimeFun: 'linear',
    });
  });
});
