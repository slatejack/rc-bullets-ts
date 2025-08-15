import React from 'react';

function Features() {
  const featureItems = [
    {
      icon: "fas fa-code",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
      iconBg: "bg-blue-500",
      title: "TypeScript 支持",
      description: "完整的 TypeScript 类型定义，提供更好的开发体验和代码提示"
    },
    {
      icon: "fas fa-rocket",
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
      iconBg: "bg-purple-500",
      title: "高性能",
      description: "优化的渲染机制，支持大量弹幕同时显示而不影响性能"
    },
    {
      icon: "fas fa-cogs",
      bgColor: "bg-gradient-to-br from-green-50 to-green-100",
      iconBg: "bg-green-500",
      title: "高度可定制",
      description: "丰富的配置选项，支持自定义样式、动画和行为"
    },
    {
      icon: "fas fa-mobile-alt",
      bgColor: "bg-gradient-to-br from-red-50 to-red-100",
      iconBg: "bg-red-500",
      title: "响应式设计",
      description: "完美适配各种屏幕尺寸，移动端和桌面端都有优秀体验"
    },
    {
      icon: "fas fa-plug",
      bgColor: "bg-gradient-to-br from-yellow-50 to-yellow-100",
      iconBg: "bg-yellow-500",
      title: "易于集成",
      description: "简单的 API 设计，几行代码即可集成到现有项目中"
    },
    {
      icon: "fas fa-heart",
      bgColor: "bg-gradient-to-br from-indigo-50 to-indigo-100",
      iconBg: "bg-indigo-500",
      title: "开源免费",
      description: "MIT 许可证，完全开源免费，社区驱动持续更新"
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">核心特性</h2>
          <p className="text-xl text-gray-600">为什么选择 rc-bullets-ts？</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureItems.map((feature, index) => (
            <div key={index} className={`${feature.bgColor} p-8 rounded-xl hover-scale`}>
              <div className={`w-12 h-12 ${feature.iconBg} rounded-lg flex items-center justify-center mb-4`}>
                <i className={`${feature.icon} text-white text-xl`}></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
