import BulletScreen from '@/bulletScreen';
import {ReactElement} from 'react';

type screenElement = string | HTMLElement;
type pushItem = string | pushItemObj | ReactElement;

interface ScreenOpsTypes {
    trackHeight: number;
    gap: string;
    animate: string;
    pauseOnHover: boolean;
    pauseOnClick: boolean;
    onStart?: (bulletId: string, screen: BulletScreen) => void;
    onEnd?: (bulletId: string, screen: BulletScreen) => void;
    top?: string;
    bottom?: string;
    loopCount: number;
    duration: number;
    delay: number;
    direction: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse' | 'initial' | 'inherit';
    animateTimeFun: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | `cubic-bezier(${number}, ${number}, ${number}, ${number})` | 'initial' | 'inherit';
}

interface pushItemObj {
    msg: string;
    head?: string;
    color?: string;
    size?: 'small' | 'normal' | 'large' | 'huge' | string;
    backgroundColor?: string;
}

interface BulletStyle {
    top?: string;
    bottom?: string;
}

export type {
    pushItem,
    screenElement,
    ScreenOpsTypes,
    pushItemObj,
    BulletStyle,
};
