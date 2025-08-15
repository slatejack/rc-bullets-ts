import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

// 弹幕管理器组件
const BulletManager = forwardRef(({ children }, ref) => {
  const [bullets, setBullets] = useState([]);
  const containerRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const bulletIdRef = useRef(0);
  const timeoutRef = useRef(null);
  const autoStartedRef = useRef(false);

  // 获取随机颜色
  const getRandomColor = () => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // 添加弹幕
  const addBullet = (text, options = {}) => {
    const bullet = {
      id: ++bulletIdRef.current,
      text: text,
      color: options.color || getRandomColor(),
      fontSize: options.fontSize || '16px',
      speed: options.speed || (Math.random() * 3 + 2),
      top: Math.random() * (containerRef.current?.offsetHeight - 40 || 260),
      left: containerRef.current?.offsetWidth || window.innerWidth
    };

    setBullets(prev => [...prev, bullet]);
  };

  // 清空所有弹幕
  const clearBullets = () => {
    setBullets([]);
  };

  // 自动发送弹幕
  const startAutoMode = () => {
    if (isRunning) return;
    setIsRunning(true);
  };

  const stopAutoMode = () => {
    setIsRunning(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // 自动发送弹幕的效果
  useEffect(() => {
    if (!isRunning) return;

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
      if (!isRunning) return;
      
      const message = messages[Math.floor(Math.random() * messages.length)];
      addBullet(message);
      
      // 随机间隔发送下一条弹幕
      timeoutRef.current = setTimeout(sendRandomBullet, Math.random() * 3000 + 1000);
    };

    timeoutRef.current = setTimeout(sendRandomBullet, 1000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isRunning]);

  // 页面加载后自动开始 - 只执行一次
  useEffect(() => {
    if (!autoStartedRef.current) {
      const timer = setTimeout(() => {
        startAutoMode();
        autoStartedRef.current = true;
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    addBullet,
    clearBullets,
    startAutoMode,
    stopAutoMode
  }), []);  // 空依赖数组确保这些方法只创建一次

  // 页面可见性变化处理
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAutoMode();
      } else if (autoStartedRef.current) {
        setTimeout(() => {
          startAutoMode();
        }, 1000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // 响应式处理
  useEffect(() => {
    const handleResize = () => {
      clearBullets();
      if (isRunning) {
        stopAutoMode();
        setTimeout(() => {
          startAutoMode();
        }, 500);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isRunning]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {children}
      
      {bullets.map((bullet) => (
        <BulletItem key={bullet.id} bullet={bullet} containerWidth={containerRef.current?.offsetWidth || window.innerWidth} />
      ))}
    </div>
  );
});

// 单个弹幕项组件
const BulletItem = React.memo(({ bullet, containerWidth }) => {
  const [removed, setRemoved] = useState(false);
  const elementRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;
    
    // 计算动画时间
    const width = element.offsetWidth;
    const distance = containerWidth + width;
    const duration = distance / (bullet.speed * 50);

    // 设置动画结束后移除元素
    timerRef.current = setTimeout(() => {
      setRemoved(true);
    }, duration * 1000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [bullet.speed, containerWidth]);

  if (removed) return null;

  const bulletStyle = {
    color: bullet.color,
    fontSize: bullet.fontSize,
    fontWeight: 'bold',
    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
    top: `${bullet.top}px`,
    left: `${bullet.left}px`,
    animation: `bulletMove ${10 / bullet.speed}s linear forwards`
  };

  return (
    <div 
      ref={elementRef}
      className="absolute whitespace-nowrap pointer-events-none z-10 bullet-animation"
      style={bulletStyle}
    >
      {bullet.text}
    </div>
  );
});

export { BulletManager, BulletItem };