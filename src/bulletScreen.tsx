import React from 'react';
import ReactDOM from 'react-dom';
import { defaultOptions, getContainer } from '@/utils/bulletHelper';
import { AnimationPlayState, BulletStyle, pushItem, screenElement, ScreenOpsTypes } from '@/interface/screen';
import { isPlainObject } from '@/utils/utils';
import { ANIMATION_PLAY_STATE, SAFE_DISTANCE, TRACK_STATUS } from '@/constants/common';
import StyledBullet from './styleBullet';

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
    _queueCheckTimer: number | null = null; // 队列检查定时器

    constructor(ele: screenElement, opts: Partial<ScreenOpsTypes> = {}) {
        this.options = { ...this.options, ...opts };
        const { trackHeight } = this.options;
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
        this._startQueueCheckTimer();
    }

    /**
     * 初始化弹幕轨道
     * @param trackHeight
     */
    initBulletTrack(trackHeight: number) {
        const { height } = this.target.getBoundingClientRect();
        this.tracks = new Array(Math.floor(height / trackHeight)).fill(TRACK_STATUS.free);
        const { position } = getComputedStyle(this.target);
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

        const { width } = screen.getBoundingClientRect();
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
        const options = { ...this.options, ...opts };
        const { onStart, onEnd, top, bottom } = options;
        const bulletContainer = getContainer({
            ...options,
            currScreen: this,
        });
        const bulletStyle = {
            top,
            bottom,
        };

        const currIdletrack = this._getTrack(); // 获取播放的弹幕轨道
        if (currIdletrack === -1 || this.allPaused) {
            // 全部暂停或通道全被占用的情况，加入等待队列
            this.queues.push([item, bulletContainer, bulletStyle]);
        } else {
            // 只有在真正渲染时才加入弹幕列表
            this.bullets.push(bulletContainer);
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

            // 释放轨道
            const trackIdx = bulletContainer.dataset.track;
            if (trackIdx !== undefined) {
                const trackIndex = +trackIdx;
                if (trackIndex >= 0 && trackIndex < this.tracks.length) {
                    this.tracks[trackIndex] = TRACK_STATUS.free;
                }
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

            // 动画结束后立即处理等待队列
            this._processQueue();
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
        // 保存暂停状态
        const wasAllPaused = this.allPaused;
        
        this._toggleAnimateStatus(id, ANIMATION_PLAY_STATE.running as AnimationPlayState);

        // 恢复全部弹幕时，处理等待队列
        if (id === null && wasAllPaused) {
            this._processQueue();
        }
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
            // 释放轨道
            const trackIdx = currItem.dataset.track;
            if (trackIdx !== undefined) {
                const trackIndex = +trackIdx;
                if (trackIndex >= 0 && trackIndex < this.tracks.length) {
                    this.tracks[trackIndex] = TRACK_STATUS.free;
                }
            }

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
            
            // 释放轨道后处理队列
            this._processQueue();
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

        const { height } = this.target.getBoundingClientRect();
        this.tracks = new Array(Math.floor(height / this.options.trackHeight)).fill(TRACK_STATUS.free);
        this.queues = [];
        this.bullets = [];
        this._observers.clear();
    }

    /**
     * 样式重置
     */
    resize() {
        const { trackHeight } = this.options;
        this.initBulletTrack(trackHeight);
        this.initBulletAnimate(this.target);
    }

    /**
     * 销毁方法，清理所有资源
     */
    destroy() {
        // 清理所有弹幕
        this.clear();

        // 清理定时器
        this._stopQueueCheckTimer();

        // 清理样式元素
        if (this._styleElement) {
            this._styleElement.remove();
            this._styleElement = null;
        }
    }

    /**
     * 获取播放轨道
     * @returns 可用的轨道索引，如果没有可用轨道则返回-1
     */
    private _getTrack() {

        // 获取容器尺寸
        const containerRect = this.target.getBoundingClientRect();
        const containerWidth = containerRect.width;

        // 创建轨道分组
        const emptyTracks: number[] = [];      // 完全空闲的轨道
        const goodTracks: number[] = [];       // 有足够空间的轨道
        const acceptableTracks: number[] = []; // 可接受但不理想的轨道

        // 计算每个轨道的状态
        for (let i = 0; i < this.tracks.length; i++) {
            let isEmpty = true;
            // 最新一条弹幕距离右侧的距离
            let lastBulletRight = 0;
            // 最新一条弹幕的宽度
            let lastBulletWidth = 0;

            // 查找该轨道上的所有弹幕
            this.bullets.forEach(bullet => {
                const trackIdx = bullet.dataset.track === undefined ? undefined : +bullet.dataset.track;
                if (trackIdx === i) {
                    isEmpty = false;
                    const bulletRect = bullet.getBoundingClientRect();
                    const bulletRight = bulletRect.right - containerRect.left;
                    const bulletWidth = bulletRect.width;

                    // 更新最新一条弹幕的信息
                    if (bulletRight > lastBulletRight) {
                        lastBulletRight = bulletRight;
                        lastBulletWidth = bulletWidth;
                    }
                }
            });

            // 根据轨道状态分类
            if (isEmpty) {
                emptyTracks.push(i);
            } else {
                const distanceToLastBullet = containerWidth - lastBulletRight;

                // 有足够空间的轨道
                if (distanceToLastBullet > SAFE_DISTANCE + lastBulletWidth) {
                    goodTracks.push(i);
                }
                // 可接受但不理想的轨道
                else if (distanceToLastBullet > lastBulletWidth / 2) {
                    acceptableTracks.push(i);
                }
            }
        }

        // 选择轨道，加入随机性
        let selectedTrackIdx = -1;
        const randomValue = Math.random();

        // 随机选择逻辑
        if (emptyTracks.length > 0 && randomValue < 0.8) {
            // 80%概率从空轨道中随机选择
            selectedTrackIdx = emptyTracks[Math.floor(Math.random() * emptyTracks.length)];
        } else if (goodTracks.length > 0 && randomValue < 0.95) {
            // 15%概率从良好轨道中随机选择
            selectedTrackIdx = goodTracks[Math.floor(Math.random() * goodTracks.length)];
        } else if (acceptableTracks.length > 0) {
            // 5%概率从可接受轨道中随机选择
            selectedTrackIdx = acceptableTracks[Math.floor(Math.random() * acceptableTracks.length)];
        }

        // 如果随机选择没有成功，按优先级选择
        if (selectedTrackIdx === -1) {
            if (emptyTracks.length > 0) {
                // 优先选择空轨道
                selectedTrackIdx = emptyTracks[Math.floor(Math.random() * emptyTracks.length)];
            } else if (goodTracks.length > 0) {
                // 其次选择良好轨道
                selectedTrackIdx = goodTracks[Math.floor(Math.random() * goodTracks.length)];
            } else if (acceptableTracks.length > 0) {
                // 最后选择可接受轨道
                selectedTrackIdx = acceptableTracks[Math.floor(Math.random() * acceptableTracks.length)];
            }
        }

        // 如果找到了可用轨道，标记轨道占用
        if (selectedTrackIdx !== -1) {
            this.tracks[selectedTrackIdx] = TRACK_STATUS.occupied;
        }

        return selectedTrackIdx;
    }

    private _render = (item: pushItem, container: HTMLElement, track: number, styleOption: BulletStyle) => {
        this.target.appendChild(container);
        const { gap, trackHeight } = this.options;
        const { top, bottom } = styleOption;

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
                const { intersectionRatio, target } = entry;
                const curTarget = target as HTMLElement;
                const trackIdx = curTarget.dataset.track === undefined ? undefined : +curTarget.dataset.track;

                if (intersectionRatio < 1) {
                    // 不完全可见时将轨道状态置为空闲，以便优先选取该轨道
                    if (trackIdx !== undefined) {
                        this.tracks[trackIdx] = TRACK_STATUS.free;
                        // 轨道释放后，处理等待队列
                        this._processQueue();
                    }
                    continue;
                }

                // 弹幕完全可见时处理队列
                if (this.queues.length > 0) {
                    this._processQueue();
                }

                if (trackIdx !== undefined) {
                    this.tracks[trackIdx] = TRACK_STATUS.feed;
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

    /**
     * 处理等待队列
     */
    private _processQueue() {
        if (this.queues.length === 0 || this.allPaused) {
            return;
        }

        const pushQueues = [...this.queues];
        this.queues = [];

        for (const queueInfo of pushQueues) {
            const [item, container, customStyle] = queueInfo;
            const currIdletrack = this._getTrack();
            if (currIdletrack !== -1) {
                // 从队列中取出并渲染时，加入弹幕列表
                this.bullets.push(container);
                this._render(item, container, currIdletrack, customStyle || {});
            } else {
                // 如果没有可用轨道，重新加入队列
                this.queues.push(queueInfo);
            }
        }
    }

    /**
     * 启动队列检查定时器
     */
    private _startQueueCheckTimer() {
        // 清理已存在的定时器
        this._stopQueueCheckTimer();

        // 每100ms检查一次队列
        this._queueCheckTimer = window.setInterval(() => {
            this._processQueue();
        }, 100);
    }

    /**
     * 停止队列检查定时器
     */
    private _stopQueueCheckTimer() {
        if (this._queueCheckTimer !== null) {
            clearInterval(this._queueCheckTimer);
            this._queueCheckTimer = null;
        }
    }
}

export default BulletScreen;
