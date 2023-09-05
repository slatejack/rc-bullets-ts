import { pushItem, screenElement, ScreenOpsTypes } from '@/interface/screen';
declare type queueType = [pushItem, HTMLElement, (string | undefined)];
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
    push(item: pushItem, opts?: ScreenOpsTypes | object): string;
    getRenderDom(Item: pushItem): JSX.Element;
    _toggleAnimateStatus: (id: string | null, status?: string) => void;
    pause(id?: string | null): void;
    resume(id?: string | null): void;
    hide(): void;
    show(): void;
    clear(id?: null): void;
    /**
     * 获取播放轨道
     * @returns
     */
    private _getTrack;
    private _render;
}
export default BulletScreen;
