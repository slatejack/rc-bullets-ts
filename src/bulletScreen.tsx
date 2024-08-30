import React from 'react';
import ReactDOM from 'react-dom';
import {defaultOptions, getContainer} from '@/utils/bulletHelper';
import {AnimationPlayState, BulletStyle, pushItem, screenElement, ScreenOpsTypes} from '@/interface/screen';
import {isPlainObject} from '@/utils/utils';
import StyledBullet from './styleBullet';
import {ANIMATION_PLAY_STATE, TRACK_STATUS} from '@/constants/common';


type queueType = [pushItem, HTMLElement, (BulletStyle | undefined)];

class BulletScreen {
  target: HTMLElement; // dom容器对象实例
  options = defaultOptions;
  bullets: HTMLElement[] = []; // 弹幕队列
  allPaused = false; // 暂停全部弹幕移动
  allHide = false; // 隐藏全部弹幕
  tracks: string[] = []; // 弹幕轨道
  queues: queueType[] = []; // 等待队列

  constructor(ele: screenElement, opts: ScreenOpsTypes | object = {}) {
    this.options = {...this.options, ...opts};
    const {trackHeight} = this.options;
    if (typeof ele === 'string') {
      const target = document.querySelector(ele);
      if (!target) {
        throw new Error('The display target dose not exist');
      }
      this.target = target as HTMLElement;
    } else {
      this.target = ele;
    }
    this.initBulletTrack(trackHeight);
    this.initBulletAnimate(this.target);
  }

  /**
   * 初始化弹幕轨道
   * @param trackHeight
   */
  initBulletTrack(trackHeight: number) {
    const {height} = this.target.getBoundingClientRect();
    this.tracks = new Array(Math.floor(height / trackHeight)).fill(TRACK_STATUS.free);
    const {position} = getComputedStyle(this.target);
    if (position === 'static') {
      this.target.style.position = 'relative';
    }
  }

  /**
   * 初始化弹幕动画
   * @param screen
   */
  initBulletAnimate(screen: HTMLElement) {
    const animateClass = 'BULLET_ANIMATE';
    const style = document.createElement('style');
    style.classList.add(animateClass);
    document.head.appendChild(style);
    const {width} = screen.getBoundingClientRect();
    const from = `from { visibility: visible; transform: translateX(${width}px); }`;
    const to = 'to { visibility: visible; transform: translateX(-100%); }';
    style.sheet?.insertRule(`@keyframes RightToLeft { ${from} ${to} }`, 0);
  }

  /**
   * 发送弹幕
   * @param item
   * @param opts
   */
  push(item: pushItem, opts: Partial<ScreenOpsTypes>) {
    const options = {...this.options, ...opts};
    const {onStart, onEnd, top, bottom} = options;
    const bulletContainer = getContainer({
      ...options,
      currScreen: this,
    });
    const bulletStyle = {
      top,
      bottom,
    };
    // 加入当前存在的弹幕列表
    this.bullets.push(bulletContainer);
    const currIdletrack = this._getTrack(); // 获取播放的弹幕轨道
    if (currIdletrack === -1 || this.allPaused) {
      // 全部暂停或通道全被占用的情况
      this.queues.push([item, bulletContainer, bulletStyle]);
    } else {
      this._render(item, bulletContainer, currIdletrack, bulletStyle);
    }

    if (onStart) {
      // 监听弹幕动画开始时间
      bulletContainer.addEventListener('animationstart', () => {
        onStart.call(null, bulletContainer.id, this);
      });
    }

    bulletContainer.addEventListener('animationend', () => {
      if (onEnd) {
        onEnd.call(null, bulletContainer.id, this);
      }
      this.bullets = this.bullets.filter((obj) => obj.id !== bulletContainer.id);
      ReactDOM.unmountComponentAtNode(bulletContainer);// react移除虚拟dom
      bulletContainer.remove(); // 移除真实dom
    });

    return bulletContainer.id;
  }

  /**
   * 获取需要渲染的dom样式
   * @param Item
   */
  getRenderDom(Item: pushItem) {
    if (React.isValidElement(Item)) {
      return Item;
    }
    if (typeof Item === 'string') {
      return <span>{Item}</span>;
    }
    if (isPlainObject(Item)) {
      return <StyledBullet {...Item} />;
    }
    return <></>;
  }

  _toggleAnimateStatus = (id: string | null, status: AnimationPlayState = 'paused') => {
    const currItem = this.bullets.find(item => item.id == id);
    if (currItem) {
      currItem.style.animationPlayState = status;
      return;
    }

    this.allPaused = status === ANIMATION_PLAY_STATE.paused;
    this.bullets.forEach(item => {
      item.style.animationPlayState = status;
    });
  };

  pause(id: string | null = null) {
    this._toggleAnimateStatus(id, ANIMATION_PLAY_STATE.paused as AnimationPlayState);
  }

  resume(id: string | null = null) {
    this._toggleAnimateStatus(id, ANIMATION_PLAY_STATE.running as AnimationPlayState);
  }

  hide() {
    this.allHide = true;
    this.bullets.forEach(item => {
      item.style.opacity = '0';
    });
  }

  show() {
    this.allHide = false;
    this.bullets.forEach(item => {
      item.style.opacity = '1';
    });
  }

  clear(id = null) {
    const currItem = this.bullets.find(item => item.id == id);
    if (currItem) {
      ReactDOM.unmountComponentAtNode(currItem);
      currItem.remove();
      this.bullets = this.bullets.filter(function (item) {
        return item.id !== id;
      });
      return;
    }
    this.bullets.forEach(item => {
      ReactDOM.unmountComponentAtNode(item);
      item.remove();
    });
    const {height} = this.target.getBoundingClientRect();
    this.tracks = new Array(Math.floor(height / this.options.trackHeight)).fill(TRACK_STATUS.free);
    this.queues = [];
    this.bullets = [];
  }

  /**
   * 样式重置
   */
  resize() {
    const {trackHeight} = this.options;
    this.initBulletTrack(trackHeight);
    this.initBulletAnimate(this.target);
  }

  /**
   * 获取播放轨道
   * @returns
   */
  private _getTrack() {
    const [readyTrackIds, feedTrackIds] = this.tracks.reduce((prev, status, trackIndex) => {
      const [readyTracks, feedTracks] = prev;
      if (status === TRACK_STATUS.free) {
        // 如果此时轨道为空闲轨道，则将其索引作为id添加进最终可选择的轨道数组
        readyTracks.push(trackIndex);
      } else if (status === TRACK_STATUS.feed) {
        feedTracks.push(trackIndex);
      }
      return [readyTracks, feedTracks];
    }, [[], []] as number[][]);

    if (readyTrackIds.length) {
      // 如果空闲轨道长度不为0，则随机选取一个轨道进行投放
      const trackId = readyTrackIds[Math.floor(Math.random() * readyTrackIds.length)];
      this.tracks[trackId] = TRACK_STATUS.occupied;
      return trackId;
    }

    if (feedTrackIds.length) {
      // 其次，如果有轨道处于即将播放结束的状态，视为可以接上状态的轨道，也可以进行投放
      const trackId = feedTrackIds[Math.floor(Math.random() * feedTrackIds.length)];
      this.tracks[trackId] = TRACK_STATUS.occupied;
      return trackId;
    }
    return -1;
  }

  private _render = (item: pushItem, container: HTMLElement, track: number, styleOption: BulletStyle) => {
    this.target.appendChild(container);
    const {gap, trackHeight} = this.options;
    const {top, bottom} = styleOption;
    ReactDOM.render(
      this.getRenderDom(item),
      container,
      () => {
        const trackTop = track * trackHeight;
        container.dataset.track = `${track}`;
        if (bottom) {
          container.style.bottom = bottom;
        } else {
          container.style.top = typeof (top) !== 'undefined' ? top : `${trackTop}px`;
        }
        const options = {
          root: this.target,
          rootMargin: `0px ${gap} 0px 0px`,
          threshold: 1.0, // 完全处于可视范围中
        };
        const observer = new IntersectionObserver(entries => {
          for (const entry of entries) {
            const {intersectionRatio, target} = entry;
            if (intersectionRatio < 1) {
              return;
            }
            const curTarget = target as HTMLElement;
            const trackIdx = typeof (curTarget.dataset.track) === 'undefined' ? undefined : +curTarget.dataset.track;
            if (trackIdx === undefined) {
              return;
            }
            if (!this.queues.length) {
              this.tracks[trackIdx] = TRACK_STATUS.feed;
            }
            const pushQueues = [...this.queues];
            this.queues = [];
            for (const queueInfo of pushQueues) {
              const [item, container, customStyle] = queueInfo;
              const currIdletrack = this._getTrack(); // 获取播放的弹幕轨道
              this._render(item, container, currIdletrack, customStyle || {});
            }
          }
        }, options);
        observer.observe(container);
      }
    );
  };
}

export default BulletScreen;
