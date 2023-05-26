import BindScreen from '@/bulletScreen';
import { ScreenOpsTypes } from '@/interface/screen';
declare type containerOpsType = ScreenOpsTypes & {
    currScreen: BindScreen;
};
declare const defaultOptions: ScreenOpsTypes;
declare const getContainer: (opts: containerOpsType) => HTMLElement;
export { defaultOptions, getContainer, };
