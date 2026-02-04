import React, {useState} from 'react';

// 定义单个版本更新日志组件
const VersionItem = ({item}) => {
  // 根据类型获取背景颜色
  const getVersionBgColor = (isMajor) => {
    return isMajor ? 'bg-purple-500' : item.isLatest ? 'bg-green-500' : 'bg-gray-500';
  };

  // 根据类型获取标签
  const getTagInfo = (isMajor, isLatest) => {
    if (isMajor) {
      return {
        bg: 'bg-purple-100',
        text: 'text-purple-800',
        label: '重大更新'
      };
    }
    if (isLatest) {
      return {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        label: '最新版本'
      };
    }
    return null;
  };

  // 根据变更类型获取图标和颜色
  const getCategoryInfo = (type) => {
    switch (type) {
      case 'feature':
        return {
          bg: 'bg-green-100',
          icon: 'fas fa-plus',
          iconColor: 'text-green-600',
          title: '新增功能'
        };
      case 'improvement':
        return {
          bg: 'bg-blue-100',
          icon: 'fas fa-wrench',
          iconColor: 'text-blue-600',
          title: '优化改进'
        };
      case 'bugfix':
        return {
          bg: 'bg-red-100',
          icon: 'fas fa-bug',
          iconColor: 'text-red-600',
          title: '问题修复'
        };
      case 'breaking':
        return {
          bg: 'bg-yellow-100',
          icon: 'fas fa-exclamation-triangle',
          iconColor: 'text-yellow-600',
          title: '破坏性变更'
        };
      default:
        return {
          bg: 'bg-gray-100',
          icon: 'fas fa-info-circle',
          iconColor: 'text-gray-600',
          title: '其他变更'
        };
    }
  };

  const tagInfo = getTagInfo(item.isMajor, item.isLatest);

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-8 hover-scale">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <span
            className={`${getVersionBgColor(item.isMajor)} text-white px-4 py-2 rounded-full text-sm font-semibold`}>
            {item.version}
          </span>
          <span className="text-gray-500">{item.date}</span>
        </div>
        {tagInfo && (
          <span className={`${tagInfo.bg} ${tagInfo.text} px-3 py-1 rounded-full text-sm`}>
            {tagInfo.label}
          </span>
        )}
      </div>

      <div className="space-y-4">
        {item.changes.map((category, idx) => {
          const categoryInfo = getCategoryInfo(category.type);
          return (
            <div key={idx} className="flex items-start space-x-3">
              <div className={`w-6 h-6 ${categoryInfo.bg} rounded-full flex items-center justify-center mt-0.5`}>
                <i className={`${categoryInfo.icon} ${categoryInfo.iconColor} text-xs`}></i>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">{category.title || categoryInfo.title}</h4>
                <ul className="text-gray-600 space-y-1">
                  {category.items.map((item, itemIdx) => (
                    <li key={itemIdx}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Changelog = () => {
  // 使用状态管理更新日志数据
  const [changelogItems] = useState([
    {
      version: 'v1.6.1',
      date: '2026-02-04',
      isLatest: true,
      changes: [
        {
          type: 'bugfix',
          title: '问题修复',
          items: [
            '修复 弹幕等待队列消费问题\n',
          ]
        }
      ]
    },
    {
      version: 'v1.6.0',
      date: '2025-08-15',
      isLatest: false,
      changes: [
        {
          type: 'feature',
          title: '新增功能',
          items: [
            '新增 destroy()，支持销毁弹幕资源',
          ]
        },
        {
          type: 'improvement',
          title: '优化改进',
          items: [
            '优化 轨道选择逻辑，减少默认轨道选择逻辑下弹幕重叠的情况',
            '优化 弹幕渲染逻辑，优化动画性能',
            '更新 TypeScript 类型定义',
            '支持 React18+ 新api',
          ]
        },
        {
          type: 'bugfix',
          title: '问题修复',
          items: [
            '修复 弹幕移除时没有被清理，可能导致内存泄漏',
          ]
        }
      ]
    },
    {
      version: 'v1.5.0',
      date: '2024-12-03',
      changes: [
        {
          type: 'improvement',
          title: '优化改进',
          items: [
            '优化 弹幕轨道选择逻辑',
          ]
        }
      ]
    },
    {
      version: 'v1.4.1',
      date: '2024-10-15',
      changes: [
        {
          type: 'improvement',
          title: '优化改进',
          items: [
            '更新 依赖包版本',
          ]
        }
      ]
    }
  ]);

  return (
    <section id="changelog" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">更新日志</h2>
          <p className="text-xl text-gray-600">最新版本功能与改进</p>
        </div>

        <div className="max-w-4xl mx-auto">
          {changelogItems.map((item, index) => (
            <VersionItem key={index} item={item}/>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="https://github.com/slatejack/rc-bullets-ts/releases"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center space-x-2 bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <i className="fab fa-github"></i>
            <span>查看完整更新日志</span>
            <i className="fas fa-external-link-alt text-sm"></i>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Changelog;
