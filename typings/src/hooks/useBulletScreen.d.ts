import BulletScreen from '@/bulletScreen';
import { pushItem, screenElement } from '@/interface/screen';
declare const useBulletScreen: (ele: screenElement) => {
    screen: BulletScreen;
    sendBullet: (bullet: pushItem, opts?: {}) => void;
    count: number;
    pause: () => void;
    resume: () => void;
    reset: () => void;
    hide: () => void;
    show: () => void;
};
export default useBulletScreen;
