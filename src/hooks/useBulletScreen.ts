import {useEffect, useState} from 'react';
import BulletScreen from '@/bulletScreen';
import {pushItem, screenElement} from '@/interface/screen';

let screen: BulletScreen;
const useBulletScreen = (ele: screenElement) => {
    const [bullets, setBullets] = useState<string[]>([]);
    useEffect(() => {
        screen = new BulletScreen(ele);
    }, [ele]);
    const sendBullet = (bullet: pushItem, opts = {}) => {
        const curr = screen.push(bullet, opts);
        setBullets(prev => [...prev, curr]);
    };
    const pause = () => {
        screen.pause();
    };
    const resume = () => {
        screen.resume();
    };
    const hide = () => {
        screen.hide();
    };
    const show = () => {
        screen.show();
    };
    const reset = () => {
        setBullets([]);
        screen.clear();
    };
    return {screen, sendBullet, count: bullets.length, pause, resume, reset, hide, show};
};

export default useBulletScreen;
