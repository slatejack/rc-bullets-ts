import React from 'react';

function Usage() {
  // 代码示例
  const basicUsageCode = `import React from 'react';
import { BulletScreen } from 'rc-bullets-ts';

const App = () => {
  const [bullets, setBullets] = React.useState([]);

  const addBullet = (text) => {
    setBullets(prev => [...prev, {
      id: Date.now(),
      text,
      color: '#fff'
    }]);
  };

  return (
    <BulletScreen
      bullets={bullets}
      width={800}
      height={400}
    />
  );
};`;

  // 复制代码功能
  const copyCode = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      showToast('代码已复制到剪贴板!');
    }).catch(() => {
      showToast('复制失败，请手动复制');
    });
  };

  // 显示提示消息
  const showToast = (message) => {
    // 在实际React应用中，这里可以使用状态来显示提示消息
    alert(message);
  };

  return (
    <section id="usage" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">快速开始</h2>
          <p className="text-xl text-gray-600">几分钟内集成到您的项目</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">安装</h3>
            <div className="code-block text-green-400 font-mono text-sm mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400"># 使用 npm</span>
                <button onClick={() => copyCode('npm install rc-bullets-ts')}
                        className="text-blue-400 hover:text-blue-300">
                  <i className="fas fa-copy"></i>
                </button>
              </div>
              <div>npm install rc-bullets-ts</div>
              <br/>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400"># 使用 yarn</span>
                <button onClick={() => copyCode('yarn add rc-bullets-ts')}
                        className="text-blue-400 hover:text-blue-300">
                  <i className="fas fa-copy"></i>
                </button>
              </div>
              <div>yarn add rc-bullets-ts</div>
            </div>

            <h3 className="text-2xl font-semibold text-gray-800 mb-6">基础用法</h3>
            <div className="code-block text-blue-300 font-mono text-sm w-full">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400">{'// React 组件示例'}</span>
                <button onClick={() => copyCode(basicUsageCode)} className="text-blue-400 hover:text-blue-300">
                  <i className="fas fa-copy"></i>
                </button>
              </div>
              <pre className="leading-relaxed">
                {basicUsageCode}
              </pre>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">高级配置</h3>
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">🎨 样式定制</h4>
                <p className="text-gray-600">支持自定义弹幕颜色、字体大小、透明度等样式属性</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">⚡ 性能优化</h4>
                <p className="text-gray-600">内置虚拟化技术，支持数千条弹幕同时显示</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">🎯 事件处理</h4>
                <p className="text-gray-600">支持弹幕点击、悬停等交互事件</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">📱 响应式</h4>
                <p className="text-gray-600">自动适配不同屏幕尺寸，移动端友好</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Usage;
