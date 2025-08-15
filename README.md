<div align="center">

[![NPM](./demo/src/assets/img/logo.svg)](https://slatejack.github.io/rc-bullets-ts/)

</div>
<div align="center">
<h1>rc-bullets-ts</h1>
</div>
<div align="center">

[![NPM](https://img.shields.io/npm/v/rc-bullets-ts.svg)](https://www.npmjs.com/package/rc-bullets-ts)
[![NPM downloads](https://img.shields.io/npm/dm/rc-bullets-ts.svg)](http://npmjs.com/package/rc-bullets-ts)

</div>

> 🌈 基于 CSS3 Animation，使用 React 构建的高性能弹幕库，支持TypeScript，可扩展性强。  
> 👏 基于 [rc-bullets](https://github.com/zerosoul/rc-bullets) 库使用 `typescript` 结合 `webpack`
> 进行重构，为项目开发提供更安全的类型支持与拓展性支持。感谢原作者：[@zerosoul](https://github.com/zerosoul) 提供支持。

## 📢 项目官网

https://slatejack.github.io/rc-bullets-ts/

## 🎮 在线体验

> 下载 `demo` 文件夹，运行 `npm install` 完成依赖安装后，执行 `npm run start` 即可体验项目

## 📦 安装

```bash
# npm
npm install --save rc-bullets-ts

# yarn
yarn add rc-bullets-ts
```

## 🚀 快速开始

```jsx
import BulletScreen, {StyledBullet} from 'rc-bullets-ts'
import {useEffect, useRef, useState} from 'react'

const headUrl = 'https://zerosoul.github.io/rc-bullets/assets/img/heads/girl.jpg'

const Demo = () => {
  const screenElRef = useRef < HTMLDivElement > (null)
  const screenRef = useRef < InstanceType < typeof BulletScreen >> ()
  const [bullet, setBullet] = useState('')

  useEffect(() => {
    // 给页面中某个元素初始化弹幕屏幕，一般为一个大区块。此处的配置项全局生效
    screenRef.current = new BulletScreen(screenElRef.current, {duration: 20})
  }, [])

  return (
    <main>
      <div ref={screenElRef} style={{width: '100vw', height: '80vh'}}/>
      <input
        value={bullet}
        onChange={({target: {value}}) => {
          // 弹幕内容输入事件处理
          setBullet(value)
        }}
      />
      <button
        onClick={() => {
          // 发送弹幕
          if (bullet && screenRef.current) {
            // 纯文本调用形式
            screenRef.current.push(bullet)

            // StyledBullet 调用形式
            screenRef.current.push(
              <StyledBullet
                head={headUrl}
                msg={bullet}
                backgroundColor={'#fff'}
                size="large"
              />
            )

            // 对象调用形式
            screenRef.current.push({
              msg: bullet,
              head: headUrl,
              color: '#eee',
              size: 'large',
              backgroundColor: 'rgba(2, 2, 2, .3)',
            })
          }
        }}
      >
        发送
      </button>
    </main>
  )
}

export default Demo
```

## ✨ 特性

- 💪 支持传入 React 组件，灵活控制弹幕内容和 UI，并提供默认样式组件：`<StyledBullet/>`
- 🎛️ 弹幕屏幕管理：清屏、暂停、隐藏
- ⚙️ 弹幕动画参数化：运动函数（匀速/ease/步进/cubic-bezier）、时长、循环次数、延迟等
- 🖱️ 鼠标悬浮弹幕暂停

## 📚 API 文档

### 初始化弹幕屏幕

```typescript
const element: string | HTMLElement = '.bullets-container';
const screen = new BulletScreen(element, {...options});
```

此处的 `options` 和下面的一致，偏向全局初始化，没有则使用默认值。每次发送弹幕不传则使用默认或全局设置，传了则该条弹幕覆盖全局设置。

### 发送弹幕

```js
const value: string | ReactElement | pushItemObj = '弹幕内容';
const bulletId = screen.push(value, {...options});
```

### 配置选项options

| 选项             | 含义         | 值类型           | 默认值       | 备注                                                                                                             |
|----------------|------------|---------------|-----------|----------------------------------------------------------------------------------------------------------------|
| top            | 弹幕位置       | string        | undefined | 强制指定距离容器顶部的高度，格式同 CSS 中的 top                                                                                   |
| bottom         | 弹幕距离容器底部位置 | string        | undefined | 强制指定距离容器底部的高度，格式同 CSS 中的 bottom                                                                                |
| trackHeight    | 轨道高度       | number        | 50        | 均分轨道的高度                                                                                                        |
| onStart        | 自定义动画开始函数  | function      | null      | e.g. (bulletId, screen) => { /* 自定义动作 */ }                                                                     |
| onEnd          | 自定义动画结束函数  | function      | null      | e.g. (bulletId, screen) => { /* 自定义动作 */ }                                                                     |
| pauseOnClick   | 鼠标点击暂停     | boolean       | false     | 再次点击继续                                                                                                         |
| pauseOnHover   | 鼠标悬停暂停     | boolean       | true      | 鼠标进入暂停，离开继续                                                                                                    |
| loopCount      | 循环次数       | number/string | 1         | 值为 'infinite' 时，表示无限循环                                                                                         |
| duration       | 滚动时长       | number/string | 10        | 数字则单位为'秒'，字符串则支持 '10s' 和 '300ms' 两种单位                                                                          |
| delay          | 延迟         | number/string | 0         | 数字则单位为'秒'，字符串则支持 '10s' 和 '300ms' 两种单位                                                                          |
| direction      | 动画方向       | string        | normal    | [animation-direction](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-direction) 支持的所有值             |
| animateTimeFun | 动画函数       | string        | linear    | [animation-timing-function](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timing-function) 支持的所有值 |

### 弹幕控制方法

- **清屏**：`screen.clear([<bulletId>])` - 无参则清除全部
- **暂停**：`screen.pause([<bulletId>])` - 无参则暂停全部
- **继续**：`screen.resume([<bulletId>])` - 无参则继续全部
- **隐藏**：`screen.hide([<bulletId>])` - 无参则隐藏全部（滚动继续）
- **显示**：`screen.show([<bulletId>])` - 无参则显示全部
- **重新计算尺寸**：`screen.resize()` - 重新计算展示窗口尺寸及弹幕动画起始位置

### 内置样式组件

```jsx
<StyledBullet
  msg="弹幕内容"
  head="头像地址"
  color="字体颜色"
  backgroundColor="背景色"
  size="尺寸" // small|normal|large|huge|自定义大小，基于em机制，默认normal
/>
```

## 🔜 未来计划

- ✅ React Hook
- 📝 欢迎提交 issues 提供更多功能建议！

## 🛠️ 本地开发指引

```bash
# 1. 克隆仓库
git clone https://github.com/slatejack/rc-bullets-ts

# 2. 安装依赖
npm install

# 3. 启动测试环境
npm run dev

# 4. 打包正式版本
npm run build
```

## 📄 License

MIT © [slatejack](https://github.com/slatejack)
