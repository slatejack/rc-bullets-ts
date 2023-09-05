import React, {useEffect, useRef} from 'react';
import './App.css';
import BulletScreen, {StyledBullet} from 'rc-bullets-ts';

function App() {
  const isPause = useRef(false);
  const barrageScreen = useRef(null);
  useEffect(() => {
    // 给页面中某个元素初始化弹幕屏幕，一般为一个大区块。此处的配置项全局生效
    barrageScreen.current = new BulletScreen('.screen-container', {duration: 10});
  }, []);

  /**
   * 发送弹幕
   * @param barrageInfo
   */
  const handleSend = (barrageInfo) => {
    if (barrageInfo) {
      barrageScreen.current.push(
        <StyledBullet
          head={barrageInfo.img}
          msg={barrageInfo.msg}
          backgroundColor="rgba(0,0,0,0.4)"
        />,
      );
    }
  };

  /**
   * 暂停/继续播放弹幕
   */
  const handlePause = () => {
    if (isPause.current) {
      barrageScreen.current.resume();
      isPause.current = false;
    } else {
      barrageScreen.current.pause();
      isPause.current = true;
    }
  };
  return (
    <div className="screen-container">
      <div className="tools">
        <button
          className="bt"
          onClick={() => handleSend({
            img: 'https://t7.baidu.com/it/u=1595072465,3644073269&fm=193&f=GIF',
            msg: '测试弹幕123',
          })}
        >
          发送弹幕
        </button>
        <button className="bt" onClick={() => barrageScreen.current.clear()}>清空弹幕</button>
        <button className="bt" onClick={handlePause}>暂停弹幕</button>
      </div>
    </div>
  );
}

export default App;
