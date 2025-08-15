import React from 'react';

function Navbar() {
  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center logo">
            </div>
            <h1 className="text-xl font-bold text-gray-800">rc-bullets-ts</h1>
          </div>
          <div className="flex items-center space-x-6">
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">特性</a>
            <a href="#changelog" className="text-gray-600 hover:text-blue-600 transition-colors">更新日志</a>
            {/* <a href="#demo" className="text-gray-600 hover:text-blue-600 transition-colors">演示</a> */}
            <a href="#usage" className="text-gray-600 hover:text-blue-600 transition-colors">快速开始</a>
            <a href="https://github.com/slatejack/rc-bullets-ts" target="_blank" rel="noopener noreferrer"
               className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2">
              <i className="fab fa-github"></i>
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
