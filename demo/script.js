// 弹幕管理
class BulletManager {
    constructor(container) {
        this.container = container;
        this.bullets = [];
        this.isRunning = false;
        this.bulletId = 0;
    }

    // 添加弹幕
    addBullet(text, options = {}) {
        const bullet = {
            id: ++this.bulletId,
            text: text,
            color: options.color || this.getRandomColor(),
            fontSize: options.fontSize || '16px',
            speed: options.speed || (Math.random() * 3 + 2),
            top: Math.random() * (this.container.offsetHeight - 40),
            left: this.container.offsetWidth
        };

        this.bullets.push(bullet);
        this.createBulletElement(bullet);
    }

    // 创建弹幕DOM元素
    createBulletElement(bullet) {
        const element = document.createElement('div');
        element.className = 'absolute whitespace-nowrap pointer-events-none z-10';
        element.style.cssText = `
            color: ${bullet.color};
            font-size: ${bullet.fontSize};
            font-weight: bold;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
            top: ${bullet.top}px;
            left: ${bullet.left}px;
            transform: translateX(0);
            transition: transform linear;
        `;
        element.textContent = bullet.text;
        element.dataset.bulletId = bullet.id;

        this.container.appendChild(element);

        // 计算动画时间
        const distance = this.container.offsetWidth + element.offsetWidth;
        const duration = distance / (bullet.speed * 50);

        // 开始动画
        requestAnimationFrame(() => {
            element.style.transitionDuration = `${duration}s`;
            element.style.transform = `translateX(-${distance}px)`;
        });

        // 动画结束后移除元素
        setTimeout(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
            this.bullets = this.bullets.filter(b => b.id !== bullet.id);
        }, duration * 1000);
    }

    // 获取随机颜色
    getRandomColor() {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // 清空所有弹幕
    clear() {
        const bulletElements = this.container.querySelectorAll('[data-bullet-id]');
        bulletElements.forEach(element => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });
        this.bullets = [];
    }

    // 自动发送弹幕
    startAutoMode() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        const messages = [
            '欢迎使用 rc-bullets-ts! 🎉',
            'TypeScript 支持真香! 💯',
            '性能优化做得很棒! ⚡',
            '开源项目值得支持! ❤️',
            '弹幕效果太酷了! 🚀',
            '响应式设计很赞! 📱',
            '文档写得很详细! 📚',
            '社区很活跃! 👥',
            'MIT 许可证真良心! 🎁',
            '持续更新中... 🔄'
        ];

        const sendRandomBullet = () => {
            if (!this.isRunning) return;
            
            const message = messages[Math.floor(Math.random() * messages.length)];
            this.addBullet(message);
            
            // 随机间隔发送下一条弹幕
            setTimeout(sendRandomBullet, Math.random() * 3000 + 1000);
        };

        sendRandomBullet();
    }

    stopAutoMode() {
        this.isRunning = false;
    }
}

// 全局弹幕管理器
let bulletManager;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化弹幕管理器
    const demoContainer = document.getElementById('demoContainer');
    if (demoContainer) {
        bulletManager = new BulletManager(demoContainer);
        
        // 自动开始演示
        setTimeout(() => {
            bulletManager.startAutoMode();
        }, 1000);
    }

    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 添加滚动动画效果
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // 观察所有需要动画的元素
    document.querySelectorAll('.hover-scale, .bg-gradient-to-br').forEach(el => {
        observer.observe(el);
    });

    // 代码复制功能
    window.copyCode = function(code) {
        if (typeof code === 'string') {
            navigator.clipboard.writeText(code).then(() => {
                showToast('代码已复制到剪贴板!');
            }).catch(() => {
                showToast('复制失败，请手动复制');
            });
        }
    };

    // 显示提示消息
    window.showToast = function(message) {
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
        toast.textContent = message;
        document.body.appendChild(toast);

        // 显示动画
        setTimeout(() => {
            toast.classList.remove('translate-x-full');
        }, 100);

        // 隐藏动画
        setTimeout(() => {
            toast.classList.add('translate-x-full');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    };

    // 统计数字动画
    const animateNumbers = () => {
        const numberElements = document.querySelectorAll('.text-3xl.font-bold');
        numberElements.forEach((el, index) => {
            const finalNumbers = ['⭐', '🔀', '📦', '👥'];
            if (index < finalNumbers.length) {
                el.textContent = finalNumbers[index];
            }
        });
    };

    // 延迟执行数字动画
    setTimeout(animateNumbers, 2000);
});

// 弹幕操作函数
window.addBullet = function(text) {
    if (bulletManager) {
        bulletManager.addBullet(text);
    }
};

window.clearBullets = function() {
    if (bulletManager) {
        bulletManager.clear();
        bulletManager.stopAutoMode();
        
        // 3秒后重新开始自动模式
        setTimeout(() => {
            bulletManager.startAutoMode();
        }, 3000);
    }
};

// 基础用法代码字符串
window.basicUsageCode = `import React from 'react';
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

// 响应式处理
window.addEventListener('resize', function() {
    if (bulletManager) {
        // 清空现有弹幕，重新开始
        bulletManager.clear();
        setTimeout(() => {
            bulletManager.startAutoMode();
        }, 500);
    }
});

// 页面可见性变化处理
document.addEventListener('visibilitychange', function() {
    if (bulletManager) {
        if (document.hidden) {
            bulletManager.stopAutoMode();
        } else {
            setTimeout(() => {
                bulletManager.startAutoMode();
            }, 1000);
        }
    }
});

// 添加一些交互效果
document.addEventListener('mouseover', function(e) {
    if (e.target.classList.contains('hover-scale')) {
        e.target.style.transform = 'scale(1.05)';
    }
});

document.addEventListener('mouseout', function(e) {
    if (e.target.classList.contains('hover-scale')) {
        e.target.style.transform = 'scale(1)';
    }
});

// 键盘快捷键
document.addEventListener('keydown', function(e) {
    // 按空格键发送随机弹幕
    if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        const messages = [
            '快捷键发送弹幕! ⌨️',
            '空格键真方便! 🎯',
            '键盘操作很流畅! ✨'
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        addBullet(randomMessage);
    }
    
    // 按 C 键清空弹幕
    if (e.code === 'KeyC' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        clearBullets();
        showToast('弹幕已清空! 按空格键发送新弹幕');
    }
});

// 添加页面加载完成提示
window.addEventListener('load', function() {
    setTimeout(() => {
        showToast('页面加载完成! 按空格键发送弹幕，按 C 键清空');
    }, 2000);
});