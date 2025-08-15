import React from 'react';

function Hero() {
  return (
    <section className="gradient-bg text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="fade-in">
          <h1 className="text-5xl font-bold mb-6">rc-bullets-ts</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            基于 CSS3 Animation，使用 React 构建，可扩展，高性能的弹幕组件库
          </p>
          <div className="flex justify-center space-x-4 mb-12">
            <a href="#usage"
               className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              查看用法
            </a>
            <a href="https://github.com/slatejack/rc-bullets-ts" target="_blank" rel="noopener noreferrer"
               className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              开始使用
            </a>
          </div>

          {/* 技术标签 */}
          <div className="flex justify-center flex-wrap gap-3">
            <a href="https://www.npmjs.com/package/rc-bullets-ts" target="_blank" rel="noopener noreferrer">
              <img src="https://img.shields.io/npm/v/rc-bullets-ts.svg" alt=""/>
            </a>
            <a href="https://www.npmjs.com/package/rc-bullets-ts" target="_blank" rel="noopener noreferrer">
              <img src="https://img.shields.io/npm/dm/rc-bullets-ts.svg" alt=""/>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
