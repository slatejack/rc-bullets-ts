import React, { ReactElement } from 'react';
import ReactDOM from 'react-dom';
import { defaultOptions, getContainer } from '@/utils/bulletHelper';
import { pushItemObj, ScreenOpsTypes } from '@/interface/screen';
import { isPlainObject } from '@/utils/utils';
import StyledBullet from './styleBullet';
type screenElement = string | HTMLElement;
type pushItem = string | pushItemObj | ReactElement;
type queueType = [pushItem, HTMLElement, (string | undefined)];
class BulletScreen {
  target: HTMLElement; // dom容器对象实例
  options = defaultOptions;
  bullets: HTMLElement[] = []; // 弹幕队列
  allPaused = false; // 暂停全部弹幕移动
  allHide = false; // 隐藏全部弹幕
  tracks: string[] = []; // 弹幕轨道
  queues: queueType[] = []; // 等待队列

  constructor(ele: screenElement, opts: ScreenOpsTypes | object = {}) {
    this.options = { ...this.options, ...opts };
    const { trackHeight } = this.options;
    if (typeof ele === 'string') {
      const target = document.querySelector(ele) as HTMLElement;
      if (!target) {
        throw new Error('The display target dose not exist');
      }
      this.target = target;
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
    const { height } = this.target.getBoundingClientRect();
    this.tracks = new Array(Math.floor(height / trackHeight)).fill('idle'); // idle代表闲置状态的轨道
    const { position } = getComputedStyle(this.target);
    if (position === 'static') {
      this.target.style.position === 'relative';
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
    const { width } = screen.getBoundingClientRect();
    const from = `from { visibility: visible; transform: translateX(${width}px); }`;
    const to = 'to { visibility: visible; transform: translateX(-100%); }';
    style.sheet?.insertRule(`@keyframes RightToLeft { ${from} ${to} }`, 0);
  }

  /**
   * 获取播放轨道
   * @returns 
   */
  private _getTrack() {
    const readyIdxs: number[] = [];
    let idx = -1;
    // 优先取得闲置状态的轨道
    this.tracks.forEach((status, index) => {
      if (status === 'idle') {
        readyIdxs.push(index);
      }
    });
    if (readyIdxs.length) {
      idx = readyIdxs[Math.floor(Math.random() * readyIdxs.length)];
    }
    if (idx === -1) {
      // 其次选择可以接上状态的
      this.tracks.forEach((status, index) => {
        if (status === 'feed') {
          readyIdxs.push(index);
        }
      });
      if (readyIdxs.length) {
        idx = readyIdxs[Math.floor(Math.random() * readyIdxs.length)];
      }
    } else {
      this.tracks[idx] = 'running';
    }
    return idx;
  }

  push(item: pushItem, opts: ScreenOpsTypes | object = {}) {
    const options = { ...this.options, opts };
    const { onStart, onEnd, top } = options;
    const bulletContainer = getContainer({
      ...options,
      currScreen: this,
    });

    // 加入当前存在的弹幕列表
    this.bullets.push(bulletContainer);
    const currIdletrack = this._getTrack(); // 获取播放的弹幕轨道
    if (currIdletrack === -1 && this.allPaused) {
      // 全部暂停
      this.queues.push([item, bulletContainer, top]);
    } else {
      this._render(item, bulletContainer, currIdletrack, top);
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

  getRenderDom(Item: pushItem) {
    // 待优化, 判断是否为styleBullet组件
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

  private _render = (item: pushItem, container: HTMLElement, track: number, top?: string) => {
    this.target.appendChild(container);
    const { gap, trackHeight } = this.options;
    ReactDOM.render(
      this.getRenderDom(item),
      container,
      () => {
        const trackTop = track * trackHeight;
        container.dataset.track = `${track}`;
        container.style.top = top ? top : `${trackTop}px`;
        const options = {
          root: this.target,
          rootMargin: `0px ${gap} 0px 0px`,
          threshold: 1.0,
        };
        const observe = new IntersectionObserver(enteries => {
          enteries.forEach(entry => {
            // 完全处于可视范围中
            const { intersectionRatio, target } = entry;
            if (intersectionRatio >= 1) {
              const curTaget = target as HTMLElement;
              const trackIdx = typeof (curTaget.dataset.track) === 'undefined' ? undefined : +curTaget.dataset.track;
              if (this.queues.length && trackIdx !== undefined) {
                const queue = this.queues.shift();
                if (queue) {
                  const [item, container, customTop] = queue;
                  this._render(item, container, trackIdx, customTop);
                }
              } else {
                if (typeof (trackIdx) !== 'undefined') {
                  this.tracks[trackIdx] = 'feed';
                }
              }
            }
          });
        }, options);
        observe.observe(container);
      }
    );
  };

  _toggleAnimateStatus = (id: string | null, status = 'paused') => {
    const currItem = this.bullets.find(item => item.id == id);
    if (currItem) {
      currItem.style.animationPlayState = status;
      return;
    }

    this.allPaused = status === 'paused' ? true : false;
    this.bullets.forEach(item => {
      item.style.animationPlayState = status;
    });
  };
  pause(id: string | null = null) {
    this._toggleAnimateStatus(id, 'paused');
  }
  resume(id: string | null = null) {
    this._toggleAnimateStatus(id, 'running');
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
    const { height } = this.target.getBoundingClientRect();
    this.tracks = new Array(Math.floor(height / this.options.trackHeight)).fill('idle');
    this.queues = [];
    this.bullets = [];
  }
}

export default BulletScreen;