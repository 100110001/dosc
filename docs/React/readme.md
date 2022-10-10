# React

## State

- state 为局部的或是封装

- 使用 setState 更新参数

- 因为 props 和 state 可能会异步更新，所以你不要依赖他们的值来更新下一个状态。要解决这个问题，可以让 setState() 接收一个函数而不是一个对象。这个函数用上一个 state 作为第一个参数，将此次更新被应用时的 props 做为第二个参数

  ```js
  // Correct
  this.setState((state, props) => ({
    counter: state.counter + props.increment,
  }));
  ```

- 当你调用 setState() 的时候，React 会把你提供的对象合并到当前的 state （浅合并）

---

## 生命周期

### 初始化阶段

- componentWillMount:：render 之前最后一次修改状态的机会
- render： 只能访问 props 和 state，不允许修改状态和 DOM 输出
- componentDidMount：成功 render 并渲染完成真是 DOM 之后触发，可以修改 DOM

### 运行中阶段

- componentWillReceiveProps：父组件修改属性出发
- shouldComponentUpdate：返回 false 会阻止 render 调用
- componentWillUpdate： 不能修改属性和状态
- render ： 只能访问 props 和 state，不允许修改状态和 DOM 输出
- componentDidUpdate：可以修改 DOM

### 销毁阶段

- componentWillUnmount：在删除组件之前进行清理操作，比如计时器和事件监听

### 老生命周期存在的问题

- componentWillMount，在 SSR 中这个方法会被多次调用，重复触发，同时如果其中绑定了事件，将无法解绑，导致内存泄漏
- componentWillReceiveProps，外部组件多次频繁更新，传入不同 props，导致不必要请求
- componentWillUpdate，更新前记录 DOM 状态，可能会做一些处理，与 componentDidUpdate 相隔时间如果过长，会导致状态不可信

### 新生命周期的替代

- getDerivedStateFromProps，第一次的 初始化组件以及后续的更新过程中（包括自身状态更新以及父传子），返回一个对象作为新的 state，返回 null 则说明不需要在这里更新 state

```js
    //老的生命周期的写法
    componentDidMount() {
      if (this.props.value !== undefined) {
        this.setState({ current: this.props.value });
      }
    },
    componentWillReceiveProps(nextProps) {
      if (nextProps.value !== undefined) {
        this.setState({ current: nextProps.value });
      }
    },
    // 新的生命周期写法
   	static getDerivedStateFromProps(nextProps) {
      if (nextProps.value !== undefined) {
        return { current: nextProps.value };
      }
      return null;
    },
```

- getSnapshotBeforeUpdate，取代了 componentWillupdate，触发时间为 update 发生的时候，在 render 之后 DOM 渲染之前返回一个值，作为 componentDidUpdate 的第三个参数

```js
getSnapshotBeforeUpdate(){ return this.refs.wrapper.scrollHeight }
```

---

## 组件通讯

- 父子组件通讯方式
  - Props
  - Instance Methods
  - Callback Functions
  - Event Bubbling
  - Parent Component

---

## Context

```js
// Context 可以让我们无须明确地传遍每一个组件，就能将值深入传递进组件树。
// 为当前的 theme 创建一个 context（“light”为默认值）。
const ThemeContext = React.createContext("light");
class App extends React.Component {
  render() {
    // 使用一个 Provider 来将当前的 theme 传递给以下的组件树。
    // 无论多深，任何组件都能读取这个值。
    // 在这个例子中，我们将 “dark” 作为当前的值传递下去。
    return (
      <ThemeContext.Provider value="dark">
        <Toolbar />
      </ThemeContext.Provider>
    );
  }
}

// 中间的组件再也不必指明往下传递 theme 了。
function Toolbar() {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

class ThemedButton extends React.Component {
  // 指定 contextType 读取当前的 theme context。
  // React 会往上找到最近的 theme Provider，然后使用它的值。
  // 在这个例子中，当前的 theme 值为 “dark”。
  static contextType = ThemeContext;
  render() {
    return <Button theme={this.context} />;
  }
}
```

### 使用问题

**如果你只是想避免层层传递一些属性，[组件组合（component composition）](https://zh-hans.reactjs.org/docs/composition-vs-inheritance.html)有时候是一个比 context 更好的解决方案。**

### API

- `React.createContext`
- `Context.Provider`
- `Class.contextType`
- `Context.Consumer`
- `Context.displayName`

---

## React.FC

1. `React.FC`是函数式组件，是在[TypeScript](https://so.csdn.net/so/search?q=TypeScript&spm=1001.2101.3001.7020)使用的一个泛型，FC 就是`FunctionComponent`的缩写，事实上`React.FC`可以写成`React.FunctionComponent`

```js
const App: React.FunctionComponent<{ message: string }> = ({ message }) => (
  <div>{message}</div>
);
```

2. React.FC 包含了 PropsWithChildren 的泛型，不用显式的声明 props.children 的类型。React.FC<> 对于返回类型是显式的，而普通函数版本是隐式的（否则需要附加注释）。
3. React.FC 提供了类型检查和自动完成的静态属性：displayName，propTypes 和 defaultProps（注意：defaultProps 与 React.FC 结合使用会存在一些问题）。
4. 我们使用 React.FC 来写 React 组件的时候，是不能用 setState 的，取而代之的是 useState()、useEffect 等 Hook API。

---

## 错误边界

​ **可以捕获发生在其子组件树任何位置的 JavaScript 错误，并打印这些错误，同时展示降级 UI**,而并不会渲染那些发生崩溃的子组件树。错误边界可以捕获发生在整个子组件树的渲染期间、生命周期方法以及构造函数中的错误。

> 注意
>
> 错误边界**无法**捕获以下场景中产生的错误：
>
> - 事件处理（[了解更多](https://zh-hans.reactjs.org/docs/error-boundaries.html#how-about-event-handlers)）
> - 异步代码（例如 `setTimeout` 或 `requestAnimationFrame` 回调函数）
> - 服务端渲染
> - 它自身抛出来的错误（并非它的子组件）

注意**错误边界仅可以捕获其子组件的错误**，它无法捕获其自身的错误。如果一个错误边界无法渲染错误信息，则错误会冒泡至最近的上层错误边界，这也类似于 JavaScript 中 `catch {}` 的工作机制。

# 组件

使用 React 组件可以将 UI 拆分为独立且复用的代码片段，每部分都可独立维护。你可以通过子类 React.Component 或 React.PureComponent 来定义 React 组件。

- React.Component
- React.PureComponent

如果你不使用 ES6 的 class，则可以使用 create-react-class 模块来替代。请参阅不使用 ES6 以获取更多详细信息。

React 组件也可以被定义为可被包装的函数：

- React.memo

## React.Component

在 React 组件中，代码重用的主要方式是组合而不是继承。

## 生命周期

![image-20220321165406807](C:\Users\ll\AppData\Roaming\Typora\typora-user-images\image-20220321165406807.png)

**[生命周期图谱](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)**

## render()

render() 方法是 class 组件中唯一必须实现的方法。

当 render 被调用时，它会检查 this.props 和 this.state 的变化并返回以下类型之一：

- React 元素。通常通过 JSX 创建。例如，`<div />` 会被 React 渲染为 DOM 节点，`<MyComponent />` 会被 React 渲染为自定义组件，无论是 `<div />` 还是 `<MyComponent />` 均为 React 元素。
- 数组或 fragments。 使得 render 方法可以返回多个元素。欲了解更多详细信息，请参阅 fragments 文档。
- Portals。可以渲染子节点到不同的 DOM 子树中。欲了解更多详细信息，请参阅有关 portals 的文档
- 字符串或数值类型。它们在 DOM 中会被渲染为文本节点
- 布尔类型或 null。什么都不渲染。（主要用于支持返回 test && `<Child />` 的模式，其中 test 为布尔类型。)

render() 函数应该为纯函数，这意味着在不修改组件 state 的情况下，每次调用时都返回相同的结果，并且它不会直接与浏览器交互。

如需与浏览器进行交互，请在 componentDidMount() 或其他生命周期方法中执行你的操作。保持 render() 为纯函数，可以使组件更容易思考。

> 注意
>
> 如果 shouldComponentUpdate() 返回 false，则不会调用 render()。

---

---

---

## 创建 React 元素

我们建议使用 JSX 来编写你的 UI 组件。每个 JSX 元素都是调用 React.createElement() 的语法糖。一般来说，如果你使用了 JSX，就不再需要调用以下方法。

- createElement()
- createFactory()

请参阅不使用 JSX 以获取更多详细信息。

## 转换元素

React 提供了几个用于操作元素的 API：

- cloneElement()
- isValidElement()
- React.Children

## Fragments

React 还提供了用于减少不必要嵌套的组件。

- React.Fragment

## Refs

- React.createRef
- React.forwardRef

Ref 转发是一个可选特性，其允许某些组件接收 ref，并将其向下传递（换句话说，“转发”它）给子组件。

## Suspense

Suspense 使得组件可以“等待”某些操作结束后，再进行渲染。目前，Suspense 仅支持的使用场景是：通过 React.lazy 动态加载组件。它将在未来支持其它使用场景，如数据获取等。

- React.lazy
- React.Suspense

```js
const LazyCom = React.lazy(() => import("./lazy"));
```

- React.lazy 目前只支持默认导出（default exports）。

## Hook

Hook 是 React 16.8 的新增特性。它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性。Hook 拥有专属文档章节和单独的 API 参考文档：

- 基础 Hook
  - useState
  - useEffect
  - useContext
- 额外的 Hook
  - useReducer
  - useCallback
  - useMemo
  - useRef
  - useImperativeHandle
  - useLayoutEffect
  - useDebugValue
