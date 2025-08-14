import React from 'react';
import ReactDOM from 'react-dom';
import {defaultOptions, getContainer} from '@/utils/bulletHelper';
import {AnimationPlayState, BulletStyle, pushItem, screenElement, ScreenOpsTypes} from '@/interface/screen';
import {isPlainObject} from '@/utils/utils';
import StyledBullet from './styleBullet';
import {ANIMATION_PLAY_STATE, TRACK_STATUS} from '@/constants/common';

let createRoot: any;
try {
    const ReactDOMClient = require('react-dom/client');
    createRoot = ReactDOMClient?.createRoot;
} catch (e) {
    // < React v18
    createRoot = null;
}


type queueType = [pushItem, HTMLElement, (BulletStyle | undefined)];
type ObserverMap = Map<string, IntersectionObserver>;

class BulletScreen {
    target: HTMLElement; // dom容器对象实例
    options = defaultOptions;
    bullets: HTMLElement[] = []; // 弹幕队列
    allPaused = false; // 暂停全部弹幕移动
    allHide = false; // 隐藏全部弹幕
    tracks: string[] = []; // 弹幕轨道
    queues: queueType[] = []; // 等待队列
    _observers: ObserverMap = new Map(); // 存储观察者实例
    _styleElement: HTMLStyleElement | null = null; // 存储样式元素引用

    constructor(ele: screenElement, opts: Partial<ScreenOpsTypes> = {}) {
        this.options = {...this.options, ...opts};
        const {trackHeight} = this.options;
        if (typeof ele === 'string') {
            const target = document.querySelector(ele);
            if (!target) {
                throw new Error('The display target does not exist');
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
        // 清理之前的样式元素
        if (this._styleElement) {
            this._styleElement.remove();
        }
        const animateClass = 'BULLET_ANIMATE';
        const style = document.createElement('style');
        style.classList.add(animateClass);
        document.head.appendChild(style);
        this._styleElement = style;

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

            // 清理观察者
            const observer = this._observers.get(bulletContainer.id);
            if (observer) {
                observer.disconnect();
                this._observers.delete(bulletContainer.id);
            }

            this.bullets = this.bullets.filter((obj) => obj.id !== bulletContainer.id);
            try {
                ReactDOM.unmountComponentAtNode(bulletContainer);
            } catch (e) {
                console.error('Error unmounting component:', e);
            }

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
        const currItem = this.bullets.find(item => item.id === id);
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
        // 清理单个弹幕
        const currItem = this.bullets.find(item => item.id === id);
        if (currItem) {
            // 清理观察者
            const observer = this._observers.get(currItem.id);
            if (observer) {
                observer.disconnect();
                this._observers.delete(currItem.id);
            }

            try {
                ReactDOM.unmountComponentAtNode(currItem);
            } catch (e) {
                console.error('Error unmounting component:', e);
            }

            currItem.remove();
            this.bullets = this.bullets.filter(item => item.id !== id);
            return;
        }

        // 清理所有弹幕
        this.bullets.forEach(item => {
            // 清理观察者
            const observer = this._observers.get(item.id);
            if (observer) {
                observer.disconnect();
                this._observers.delete(item.id);
            }

            try {
                ReactDOM.unmountComponentAtNode(item);
            } catch (e) {
                console.error('Error unmounting component:', e);
            }

            item.remove();
        });

        const {height} = this.target.getBoundingClientRect();
        this.tracks = new Array(Math.floor(height / this.options.trackHeight)).fill(TRACK_STATUS.free);
        this.queues = [];
        this.bullets = [];
        this._observers.clear();
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
     * 销毁方法，清理所有资源
     */
    destroy() {
        // 清理所有弹幕
        this.clear();

        // 清理样式元素
        if (this._styleElement) {
            this._styleElement.remove();
            this._styleElement = null;
        }
    }

    /**
     * 获取播放轨道
     * @returns
     */
    private _getTrack() {
        const readyIdxs: number[] = [];
        let idx = -1;
        // 优先取空闲状态的
        this.tracks.forEach((status, index) => {
            if (status === TRACK_STATUS.free) {
                readyIdxs.push(index);
            }
        });
        if (readyIdxs.length) {
            idx = readyIdxs[Math.floor(Math.random() * readyIdxs.length)];
        }
        if (idx === -1) {
            // 其次是可以接上状态的
            this.tracks.forEach((status, index) => {
                if (status === TRACK_STATUS.feed) {
                    readyIdxs.push(index);
                }
            });
            if (readyIdxs.length) {
                idx = readyIdxs[Math.floor(Math.random() * readyIdxs.length)];
            }
        }
        // 如果此时状态值不等于-1，则说明该轨道在占用中
        if (idx !== -1) {
            this.tracks[idx] = TRACK_STATUS.occupied;
        }
        return idx;
    }

    private _render = (item: pushItem, container: HTMLElement, track: number, styleOption: BulletStyle) => {
        this.target.appendChild(container);
        const {gap, trackHeight} = this.options;
        const {top, bottom} = styleOption;

        try {
            // 获取要渲染的内容
            const renderContent = this.getRenderDom(item);

            // 根据React版本选择不同的渲染方式
            if (createRoot) {
                try {
                    // React 18+
                    const root = createRoot(container);
                    root.render(renderContent);
                    // 设置样式和观察者
                    this._setupContainerAndObserver(container, track, trackHeight, top, bottom, gap);
                } catch (e) {
                    console.error('Error using createRoot:', e);
                    // 操作降级
                    this._renderWithLegacyAPI(renderContent, container, track, trackHeight, top, bottom, gap);
                }
            } else {
                // < React 18
                this._renderWithLegacyAPI(renderContent, container, track, trackHeight, top, bottom, gap);
            }
        } catch (e) {
            console.error('Error rendering bullet:', e);
        }
    };

    /**
     * 设置容器样式和观察者
     */
    private _setupContainerAndObserver(
        container: HTMLElement,
        track: number,
        trackHeight: number,
        top?: string,
        bottom?: string,
        gap?: string
    ) {
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

        // 创建并存储观察者
        const observer = new IntersectionObserver(entries => {
            for (const entry of entries) {
                const {intersectionRatio, target} = entry;
                const curTarget = target as HTMLElement;
                const trackIdx = curTarget.dataset.track === undefined ? undefined : +curTarget.dataset.track;

                if (intersectionRatio < 1) {
                    // 不完全可见时将轨道状态置为空闲，以便优先选取该轨道
                    if (trackIdx !== undefined) {
                        this.tracks[trackIdx] = TRACK_STATUS.free;
                    }
                    continue;
                }

                if (this.queues.length && trackIdx === undefined) {
                    const pushQueues = [...this.queues];
                    this.queues = [];
                    for (const queueInfo of pushQueues) {
                        const [item, container, customStyle] = queueInfo;
                        const currIdletrack = this._getTrack(); // 获取播放的弹幕轨道
                        if (currIdletrack !== -1) {
                            this._render(item, container, currIdletrack, customStyle || {});
                        } else {
                            // 如果没有可用轨道，重新加入队列
                            this.queues.push(queueInfo);
                        }
                    }
                } else {
                    if (trackIdx !== undefined) {
                        this.tracks[trackIdx] = TRACK_STATUS.feed;
                    }
                }
            }
        }, options);

        observer.observe(container);
        this._observers.set(container.id, observer);
    }

    /**
     * 使用旧版React API渲染
     */
    private _renderWithLegacyAPI(
        content: React.ReactElement,
        container: HTMLElement,
        track: number,
        trackHeight: number,
        top?: string,
        bottom?: string,
        gap?: string
    ) {
        ReactDOM.render(
            content,
            container,
            () => {
                this._setupContainerAndObserver(container, track, trackHeight, top, bottom, gap);
            }
        );
    }
}

export default BulletScreen;
