import React, { useEffect, useState } from 'react';

function Stats() {
  const [animated, setAnimated] = useState(false);

  // 统计数字动画
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimated(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">项目统计</h2>
          <p className="text-xl text-gray-600">开源社区的认可</p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg text-center hover-scale">
            <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-star text-white text-2xl"></i>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">
              {animated ? '⭐' : '...'}
            </div>
            <div className="text-gray-600">GitHub Stars</div>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-lg text-center hover-scale">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-code-branch text-white text-2xl"></i>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">
              {animated ? '🔀' : '...'}
            </div>
            <div className="text-gray-600">Forks</div>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-lg text-center hover-scale">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-download text-white text-2xl"></i>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">
              {animated ? '📦' : '...'}
            </div>
            <div className="text-gray-600">NPM Downloads</div>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-lg text-center hover-scale">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-users text-white text-2xl"></i>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">
              {animated ? '👥' : '...'}
            </div>
            <div className="text-gray-600">Contributors</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Stats;