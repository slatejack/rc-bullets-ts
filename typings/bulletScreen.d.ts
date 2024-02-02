import { BulletStyle, pushItem, screenElement, ScreenOpsTypes } from '@/interface/screen';
declare type queueType = [pushItem, HTMLElement, (BulletStyle | undefined)];
declare class BulletScreen {
    target: HTMLElement;
    options: ScreenOpsTypes;
    bullets: HTMLElement[];
    allPaused: boolean;
    allHide: boolean;
    tracks: string[];
    queues: queueType[];
    constructor(ele: screenElement, opts?: ScreenOpsTypes | object);
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
    _toggleAnimateStatus: (id: string | null, status?: string) => void;
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
     * 获取播放轨道
     * @returns
     */
    private _getTrack;
    private _render;
}
export default BulletScreen;
