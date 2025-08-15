import React from 'react';

function CallToAction() {
  return (
    <section className="gradient-bg text-white py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold mb-6">准备开始了吗？</h2>
        <p className="text-xl mb-8">立即为您的项目添加可自定义的弹幕效果</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="https://github.com/slatejack/rc-bullets-ts" target="_blank" rel="noopener noreferrer"
             className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2">
            <i className="fab fa-github"></i>
            <span>查看源码</span>
          </a>
          <a href="https://www.npmjs.com/package/rc-bullets-ts" target="_blank" rel="noopener noreferrer"
             className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors flex items-center justify-center space-x-2">
            <i className="fab fa-npm"></i>
            <span>NPM 安装</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default CallToAction;
