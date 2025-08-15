import React, {useEffect, useRef} from 'react';
import BulletScreen, {StyledBullet} from 'rc-bullets-ts';

function Demo() {
  const isPause = useRef(false);
  const barrageScreen = useRef(null);
  useEffect(() => {
    // 给页面中某个元素初始化弹幕屏幕，一般为一个大区块。此处的配置项全局生效
    barrageScreen.current = new BulletScreen('#demoContainer', {duration: 10});
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) {
        console.log('page is visible');
        barrageScreen.current.resize();
      } else {
        console.log('page is invisible');
      }
    });
  }, []);

  /**
   * 发送弹幕
   * @param barrageInfo
   */
  const handleSend = (barrageInfo) => {
    if (barrageInfo) {
      setInterval(() => {
        barrageScreen.current.push(
          <StyledBullet
            head={barrageInfo.img}
            msg={barrageInfo.msg}
            backgroundColor="rgba(0,0,0,0.4)"
          />,
          {}
        );
      }, 500);
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
    <section id="demo" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">实时演示</h2>
          <p className="text-xl text-gray-600">体验弹幕效果的魅力</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="demo-container mb-6" id="demoContainer">
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => handleSend({
                img: 'https://t7.baidu.com/it/u=1595072465,3644073269&fm=193&f=GIF',
                msg: '欢迎使用 rc-bullets-ts! 🎉',
              })}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              发送弹幕1
            </button>
            <button
              onClick={() => handleSend({
                img: 'https://t7.baidu.com/it/u=1595072465,3644073269&fm=193&f=GIF',
                msg: 'TypeScript 支持真香! 💯',
              })}
              className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors"
            >
              发送弹幕2
            </button>
            <button
              onClick={handlePause}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              暂停弹幕
            </button>
            <button
              onClick={() => barrageScreen.current.clear()}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              清空弹幕
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Demo;
