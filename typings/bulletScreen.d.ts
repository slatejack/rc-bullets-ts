/// <reference types="react" />
import { AnimationPlayState, BulletStyle, pushItem, screenElement, ScreenOpsTypes } from '@/interface/screen';
declare type queueType = [pushItem, HTMLElement, (BulletStyle | undefined)];
declare type ObserverMap = Map<string, IntersectionObserver>;
declare class BulletScreen {
    target: HTMLElement;
    options: ScreenOpsTypes;
    bullets: HTMLElement[];
    allPaused: boolean;
    allHide: boolean;
    tracks: string[];
    queues: queueType[];
    _observers: ObserverMap;
    _styleElement: HTMLStyleElement | null;
    _queueCheckTimer: number | null;
    constructor(ele: screenElement, opts?: Partial<ScreenOpsTypes>);
    /**
     * 初始化弹幕轨道
     * @param trackHeight
     */
    initBulletTrack(trackHeight: number): void;
    /**
     * 初始化弹幕动画
     * @param screen
     */
    initBulletAnimate(screen: HTMLElement): void;
    /**
     * 发送弹幕
     * @param item
     * @param opts
     */
    push(item: pushItem, opts: Partial<ScreenOpsTypes>): string;
    /**
     * 获取需要渲染的dom样式
     * @param Item
     */
    getRenderDom(Item: pushItem): JSX.Element;
    _toggleAnimateStatus: (id: string | null, status?: AnimationPlayState) => void;
    pause(id?: string | null): void;
    resume(id?: string | null): void;
    hide(): void;
    show(): void;
    clear(id?: null): void;
    /**
     * 样式重置
     */
    resize(): void;
    /**
     * 销毁方法，清理所有资源
     */
    destroy(): void;
    /**
     * 获取播放轨道
     * @returns 可用的轨道索引，如果没有可用轨道则返回-1
     */
    private _getTrack;
    private _render;
    /**
     * 设置容器样式和观察者
     */
    private _setupContainerAndObserver;
    /**
     * 使用旧版React API渲染
     */
    private _renderWithLegacyAPI;
    /**
     * 处理等待队列
     */
    private _processQueue;
    /**
     * 启动队列检查定时器
     */
    private _startQueueCheckTimer;
    /**
     * 停止队列检查定时器
     */
    private _stopQueueCheckTimer;
}
export default BulletScreen;
