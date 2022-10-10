# Vue

## 虚拟 DOM

Virtual DOM 是对 DOM 的抽象，本质上是 JavaScript 对象，这个对象就是更加轻量级的对 DOM 的描述.

### 优缺点

- 减少 DOM 操作。DOM 相对较慢，更因为频繁变动 DOM 会造成浏览器的回流或者重回，这些都是性能的杀手，因此我们需要这一层抽象，在 patch 过程中尽可能地一次性将差异更新到 DOM 中，这样保证了 DOM 不会出现性能很差的情况.
- 无须手动操作 DOM。一方面是因为手动操作 DOM 无法保证程序性能，多人协作的项目中如果 review 不严格，可能会有开发者写出性能较低的代码，另一方面更重要的是省略手动 DOM 操作可以大大提高开发效率.
- 更好的跨平台。比如 Node.js 就没有 DOM，如果想实现 SSR(服务端渲染)，那么一个方式就是借助 Virtual DOM，因为 Virtual DOM 本身是 JavaScript 对象。
- 内存占用较高，因为需要模拟整个网页的真实 DOM。
- 高性能应用场景存在难以优化的情况，类似像 Google Earth 一类的高性能前端应用在技术选型上往往不会选择 React。

## diff 算法

Diff 算法是一种对比算法。对比两者是旧虚拟 DOM 和新虚拟 DOM，对比出是哪个虚拟节点更改了，找出这个虚拟节点，并只更新这个虚拟节点所对应的真实节点，而不用更新其他数据没发生改变的节点，实现精准地更新真实 DOM，进而提高效率。

- 使用虚拟 DOM 算法的损耗计算： 总损耗 = 虚拟 DOM 增删改+（与 Diff 算法效率有关）真实 DOM 差异增删改+（较少的节点）排版与重绘
- 直接操作真实 DOM 的损耗计算： 总损耗 = 真实 DOM 完全增删改+（可能较多的节点）排版与重绘

### vue2.x，vue3.x，React 中的 diff 有区别吗？

- vue2.x 的核心 diff 算法采用双端比较的算法，同时从新旧 children 的两端开始进行比较，借助 key 可以复用的节点。
- vue3.x 借鉴了一些别的算法 inferno([github.com/infernojs/i…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Finfernojs%2Finferno)) 解决：1、处理相同的前置和后置元素的预处理；2、一旦需要进行 DOM 移动，我们首先要做的就是找到 source 的最长递增子序列。

在创建 VNode 就确定类型，以及在 mount/patch 的过程中采用位运算来判断一个 VNode 的类型，在这个优化的基础上再配合 Diff 算法，性能得到提升。

- react 通过 key 和 tag 来对节点进行取舍，可直接将复杂的比对拦截掉，然后降级成节点的移动和增删这样比较简单的操作。

对 oldFiber 和新的 ReactElement 节点的比对，将会生成新的 fiber 节点，同时标记上 effectTag，这些 fiber 会被连到 workInProgress 树中，作为新的 WIP 节点。树的结构因此被一点点地确定，而新的 workInProgress 节点也基本定型。在 diff 过后，workInProgress 节点的 beginWork 节点就完成了，接下来会进入 completeWork 阶段。

## nextTick

### Event Loop

macro task 宏任务和 micro task 微任务

在浏览器环境下，macro task 和 micro task 对应如下：

- macro task 宏任务：MessageChannel、postMessage、setImmediate 和 setTimeout。
- micro task 微任务：Promise.then 和 MutationObsever。

### MutationObserver

创建并返回一个新的 MutationObserver 实例，它会在指定的 DOM 发生变化时被调用。

```js
const callback = () => {
  console.log("text node data change");
};
const observer = new MutationObserver(callback);
let count = 1;
const textNode = document.createTextNode(count);
observer.observe(textNode, {
  characterData: true,
});

function func() {
  count++;
  textNode.data = count;
}
func(); // text node data change
```

代码分析：

- 首先定义了 callback 回调函数和 MutationObserver 的实例对象，其中构造函数传递的参数是我们的 callback。
- 然后创建一个文本节点并传入文本节点的初始文本，接着调用 MutationObserver 实例的 observe 方法，传入我们创建的文本节点和一个 config 观察配置对象，其中 characterData:true 的意思是：我们要观察 textNode 节点的文本变动。config 还有其他选项属性，你可以在 MDN 文档中查看到。
- 接着，我们定义一个 func 函数，这个函数主要做的事情就是修改 textNode 文本节点中的文本内容，当文本内容变动后，callback 会自动被调用，因此输出 text node data change。

### nextTick 实现原理

将传入的回调函数包装成异步任务，异步任务又分微任务和宏任务，为了尽快执行所以优先选择微任务；
nextTick 提供了四种异步方法 Promise.then、MutationObserver、setImmediate、setTimeOut(fn,0)

### 源码解读

> 源码位置 core/util/next-tick
> 源码并不复杂，三个函数，60 几行代码，沉下心去看！
> Tips:为了便于理解我调整了源码中 nextTick、timerFunc、flushCallbacks 三个函数的书写顺序

```jsx
import { noop } from "shared/util";
import { handleError } from "./error";
import { isIE, isIOS, isNative } from "./env";

//  上面三行与核心代码关系不大，了解即可
//  noop 表示一个无操作空函数，用作函数默认值，防止传入 undefined 导致报错
//  handleError 错误处理函数
//  isIE, isIOS, isNative 环境判断函数，
//  isNative 判断是否原生支持，如果通过第三方实现支持也会返回 false

export let isUsingMicroTask = false; // nextTick 最终是否以微任务执行

const callbacks = []; // 存放调用 nextTick 时传入的回调函数
let pending = false; // 标识当前是否有 nextTick 在执行，同一时间只能有一个执行

// 声明 nextTick 函数，接收一个回调函数和一个执行上下文作为参数
export function nextTick(cb?: Function, ctx?: Object) {
  let _resolve;
  // 将传入的回调函数存放到数组中，后面会遍历执行其中的回调
  callbacks.push(() => {
    if (cb) {
      // 对传入的回调进行 try catch 错误捕获
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, "nextTick");
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });

  // 如果当前没有在 pending 的回调，就执行 timeFunc 函数选择当前环境优先支持的异步方法
  if (!pending) {
    pending = true;
    timerFunc();
  }

  // 如果没有传入回调，并且当前环境支持 promise，就返回一个 promise
  if (!cb && typeof Promise !== "undefined") {
    return new Promise((resolve) => {
      _resolve = resolve;
    });
  }
}

// 判断当前环境优先支持的异步方法，优先选择微任务
// 优先级：Promise---> MutationObserver---> setImmediate---> setTimeout
// setTimeOut 最小延迟也要4ms，而 setImmediate 会在主线程执行完后立刻执行
// setImmediate 在 IE10 和 node 中支持

// 多次调用 nextTick 时 ,timerFunc 只会执行一次

let timerFunc;
// 判断当前环境是否支持 promise
if (typeof Promise !== "undefined" && isNative(Promise)) {
  // 支持 promise
  const p = Promise.resolve();
  timerFunc = () => {
    // 用 promise.then 把 flushCallbacks 函数包裹成一个异步微任务
    p.then(flushCallbacks);
    if (isIOS) setTimeout(noop);
  };
  // 标记当前 nextTick 使用的微任务
  isUsingMicroTask = true;

  // 如果不支持 promise，就判断是否支持 MutationObserver
  // 不是IE环境，并且原生支持 MutationObserver，那也是一个微任务
} else if (
  !isIE &&
  typeof MutationObserver !== "undefined" &&
  (isNative(MutationObserver) ||
    MutationObserver.toString() === "[object MutationObserverConstructor]")
) {
  let counter = 1;
  // new 一个 MutationObserver 类
  const observer = new MutationObserver(flushCallbacks);
  // 创建一个文本节点
  const textNode = document.createTextNode(String(counter));
  // 监听这个文本节点，当数据发生变化就执行 flushCallbacks
  observer.observe(textNode, { characterData: true });
  timerFunc = () => {
    counter = (counter + 1) % 2;
    textNode.data = String(counter); // 数据更新
  };
  isUsingMicroTask = true; // 标记当前 nextTick 使用的微任务

  // 判断当前环境是否原生支持 setImmediate
} else if (typeof setImmediate !== "undefined" && isNative(setImmediate)) {
  timerFunc = () => {
    setImmediate(flushCallbacks);
  };
} else {
  // 以上三种都不支持就选择 setTimeout
  timerFunc = () => {
    setTimeout(flushCallbacks, 0);
  };
}

// 如果多次调用 nextTick，会依次执行上面的方法，将 nextTick 的回调放在 callbacks 数组中
// 最后通过 flushCallbacks 函数遍历 callbacks 数组的拷贝并执行其中的回调
function flushCallbacks() {
  pending = false;
  const copies = callbacks.slice(0); // 拷贝一份
  callbacks.length = 0; // 清空 callbacks
  for (let i = 0; i < copies.length; i++) {
    // 遍历执行传入的回调
    copies[i]();
  }
}

// 为什么要拷贝一份 callbacks

// callbacks.slice(0) 将 callbacks 拷贝出来一份，
// 是因为考虑到 nextTick 回调中可能还会调用 nextTick 的情况,
// 如果 nextTick 回调中又调用了一次 nextTick，则又会向 callbacks 中添加回调，
// nextTick 回调中的 nextTick 应该放在下一轮执行，
// 如果不将 callbacks 复制一份就可能一直循环
```

## 组件设计

#### 单一职责

你的组件是否符合**只实现一个职责，并且只有一个改变状态的理由**？

#### 通用性

放弃对 DOM 的掌控，只提供最基础的 DOM、交互逻辑，将 DOM 的结构转移给开发者。

- 存在代码重复吗？如果只使用一次，或者只是某个特定用例，可能嵌入组件中更好。

* 如果它只是几行代码，分隔它反而需要更多的代码，那是否可以直接嵌入组件中？

* 性能会收到影响吗？更改 state/props 会导致重新渲染，当发生这种情况时，你需要的是 只是重新去渲染经过 diff 之后得到的相关元素节点。在较大的、关联很紧密的组件中，你可能会发现状态更改会导致在不需要它的许多地方重新呈现，这时应用的性能就可能会开始受到影响。

* 你是否有一个明确的理由？分离代码我想要实现什么？更松散的耦合、可以被复用等，如果回答不了这个问题，那最好先不要从组件中抽离。

* 这些好处是否超过了成本？分离代码需要花费一定的时间和精力，我们要在业务中去衡量，有所取舍。

#### 封装

良好的组件封装应该**隐藏内部细节和实现意义**，并通过**props**来控制行为和输出。

**减少访问全局变量**：因为它们打破了封装，创造了不可预测的行为，并且使测试变得困难。可以将全局变量作为组件的 props，而不是直接引用。

#### 组合

- 具有多个功能的组件，应该转换为多个小组件。
- 单一责任原则描述了如何将需求拆分为组件，封装描述了如何组织这些组件，组合描述了如何将整个系统粘合在一起。

#### 纯组件和非纯组件

- 非纯组件有显示的副作用，我们要尽量隔离非纯代码。
- 将全局变量作为 props 传递给组件，而非将其注入到组件的作用域中。
- 将网络请求和组件渲染分离，只将数据传递给组件，保证组件职责的单一性，也能将非纯代码从组件中隔离。

#### 可测试

- 测试不仅仅是自动检测错误，更是检测组件的逻辑。
- 如果一个组件测试不易于测试，很大可能是你的组件设计存在问题。

#### 富有意义

- 开发人员大部分时间都在阅读和理解代码，而不是实际编写代码。
- 有意义的函数、变量命名，可以让代码具有良好的可读性。
