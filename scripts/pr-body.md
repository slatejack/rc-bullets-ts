## 背景
`package.json` 中的 `npm test` 原先为占位脚本（直接 exit 1）。本 PR 引入真实单元测试套件，覆盖当前 master 已实现的公开 API / 行为。

## 改动
- 新增 **Jest 29 + ts-jest + jest-environment-jsdom + Testing Library**
- `npm test` → `jest`；另提供 `npm run test:coverage`
- 配置：`jest.config.js`、`jest.setup.ts`（含 IntersectionObserver mock、假定时器）
- 测试目录：`__tests__/`

## 覆盖范围
- **包导出** `BulletScreen` / `StyledBullet` / `useBulletScreen`
- **BulletScreen**：HTMLElement / selector 初始化、错误处理、轨道与 keyframes、`push`（string / ReactNode / 样式对象）、options（duration/delay/direction/animateTimeFun/loopCount/top/bottom/onStart/onEnd）、pauseOnHover、pauseOnClick、pause/resume/hide/show/clear/resize/destroy、等待队列与定时器、animationend 释放轨道
- **StyledBullet**：msg/head/size/color/backgroundColor
- **useBulletScreen**：sendBullet / count / pause / resume / hide / show / reset
- **utils / constants / defaultOptions**

## 自测
```
npm test
# Test Suites: 6 passed, 6 total
# Tests:       55 passed, 55 total
```

## 说明
- 未改动业务源码（仅测试与测试依赖/脚本）
- `pauseOnClick` 二次点击恢复：现实现检查 `dataset.click` 而写入 `dataset.clicked`，测试按当前行为只断言首次暂停
