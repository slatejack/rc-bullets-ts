import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-cente logo">
              </div>
              <h3 className="text-lg font-semibold">rc-bullets-ts</h3>
            </div>
            <p className="text-gray-400">轻量级 React 弹幕库</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">快速链接</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#features" className="hover:text-white transition-colors">特性</a></li>
              <li><a href="#changelog" className="hover:text-white transition-colors">更新日志</a></li>
              <li><a href="#usage" className="hover:text-white transition-colors">快速开始</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">资源</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="https://github.com/slatejack/rc-bullets-ts" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a></li>
              <li><a href="https://www.npmjs.com/package/rc-bullets-ts" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">NPM</a></li>
              <li><a href="https://github.com/slatejack/rc-bullets-ts/issues" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">问题反馈</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">社区</h4>
            <div className="flex space-x-4">
              <a href="https://github.com/slatejack/rc-bullets-ts" target="_blank" rel="noopener noreferrer"
                 className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-600 transition-colors">
                <i className="fab fa-github"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 rc-bullets-ts. MIT License. Made with ❤️ by the slatejack.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
