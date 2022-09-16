import BindScreen from '@/bulletScreen';
import { ScreenOpsTypes } from '@/interface/screen';

type containerOpsType = ScreenOpsTypes & { currScreen: BindScreen }
const defaultOptions: ScreenOpsTypes = {
  // 轨道高度
  trackHeight: 50,
  // 弹幕之间的间距
  gap: '10px',
  animate: 'RightToLeft',
  pauseOnHover: true,
  pauseOnClick: false,
  loopCount: 1,
  duration: 10,
  delay: 0,
  direction: 'normal',
  animateTimeFun: 'linear'
};

const getContainer = (opts: containerOpsType) => {
  const {
    currScreen,
    pauseOnHover,
    pauseOnClick,
    animate,
    loopCount,
    direction,
    delay,
    duration,
    animateTimeFun,
  } = opts;
  // 创建单条弹幕容器
  const bulletContainer = <HTMLDivElement>document.createElement('div');
  bulletContainer.id = Math.random()
    .toString(36)
    .substring(2);
  // 设置弹幕容器的初始样式
  bulletContainer.style.transitionProperty = 'opacity';
  bulletContainer.style.transitionDuration = '0.5s';
  bulletContainer.style.cursor = 'pointer';
  bulletContainer.style.position = 'absolute';
  bulletContainer.style.left = '0';
  bulletContainer.style.visibility = 'hidden';
  bulletContainer.style.animationName = animate;
  bulletContainer.style.animationIterationCount = `${loopCount}`;
  bulletContainer.style.animationDelay = isNaN(+delay) ? `${delay}` : `${delay}s`;
  bulletContainer.style.animationDirection = direction;
  bulletContainer.style.animationDuration = isNaN(+duration) ? `${duration}` : `${duration}s`;
  bulletContainer.style.animationTimingFunction = animateTimeFun;

  // 性能小优化
  bulletContainer.style.willChange = 'transform';
  // 隐藏
  if (currScreen.allHide) {
    bulletContainer.style.opacity = '0';
  }

  // onPause
  if (pauseOnHover) {
    bulletContainer.addEventListener(
      'mouseenter',
      () => {
        bulletContainer.style.animationPlayState = 'paused';
      },
      false);
    bulletContainer.addEventListener(
      'mouseleave',
      () => {
        bulletContainer.style.animationPlayState = 'running';
      },
      false
    );
  }

  // onClick
  if (pauseOnClick) {
    bulletContainer.addEventListener(
      'click',
      () => {
        const currStatus = bulletContainer.style.animationPlayState;
        if (currStatus === 'paused' && bulletContainer.dataset.click) {
          bulletContainer.dataset.clicked = '';
          bulletContainer.style.animationPlayState = 'running';
        } else {
          bulletContainer.dataset.clicked = 'true';
          bulletContainer.style.animationPlayState = 'paused';
        }
      },
      false,
    );
  }

  return bulletContainer;
};

export {
  defaultOptions,
  getContainer,
};