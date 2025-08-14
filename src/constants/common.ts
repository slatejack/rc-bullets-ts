export const TRACK_STATUS = {
    free: 'idle', // 空闲状态
    feed: 'feed', // 占用结束状态
    occupied: 'running', // 占用中
};

export const ANIMATION_PLAY_STATE = {
    paused: 'paused',
    running: 'running',
};

/**
 * 弹幕安全距离（像素）- 新弹幕与现有弹幕之间的理想最小距离
 */
export const SAFE_DISTANCE = 80;
