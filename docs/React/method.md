# React

## 概览

### 组件

使用 React 组件可以将 UI 拆分为独立且复用的代码片段，每部分都可独立维护。你可以通过子类 `React.Component` 或 `React.PureComponent` 来定义 React 组件。

- [`React.Component`](https://zh-hans.reactjs.org/docs/react-api.html#reactcomponent)
- [`React.PureComponent`](https://zh-hans.reactjs.org/docs/react-api.html#reactpurecomponent)

如果你不使用 ES6 的 class，则可以使用 `create-react-class` 模块来替代。请参阅[不使用 ES6](https://zh-hans.reactjs.org/docs/react-without-es6.html) 以获取更多详细信息。

React 组件也可以被定义为可被包装的函数：

- [`React.memo`](https://zh-hans.reactjs.org/docs/react-api.html#reactmemo)

### 创建 React 元素

我们建议[使用 JSX](https://zh-hans.reactjs.org/docs/introducing-jsx.html) 来编写你的 UI 组件。每个 JSX 元素都是调用 [`React.createElement()`](https://zh-hans.reactjs.org/docs/react-api.html#createelement) 的语法糖。一般来说，如果你使用了 JSX，就不再需要调用以下方法。

- [`createElement()`](https://zh-hans.reactjs.org/docs/react-api.html#createelement)
- [`createFactory()`](https://zh-hans.reactjs.org/docs/react-api.html#createfactory)

请参阅[不使用 JSX](https://zh-hans.reactjs.org/docs/react-without-jsx.html) 以获取更多详细信息。

### 转换元素

`React` 提供了几个用于操作元素的 API：

- [`cloneElement()`](https://zh-hans.reactjs.org/docs/react-api.html#cloneelement)
- [`isValidElement()`](https://zh-hans.reactjs.org/docs/react-api.html#isvalidelement)
- [`React.Children`](https://zh-hans.reactjs.org/docs/react-api.html#reactchildren)

### Fragments

`React` 还提供了用于减少不必要嵌套的组件。

- [`React.Fragment`](https://zh-hans.reactjs.org/docs/react-api.html#reactfragment)

### Refs

- [`React.createRef`](https://zh-hans.reactjs.org/docs/react-api.html#reactcreateref)
- [`React.forwardRef`](https://zh-hans.reactjs.org/docs/react-api.html#reactforwardref)

### Suspense

Suspense 使得组件可以“等待”某些操作结束后，再进行渲染。目前，Suspense 仅支持的使用场景是：[通过 `React.lazy` 动态加载组件](https://zh-hans.reactjs.org/docs/code-splitting.html#reactlazy)。它将在未来支持其它使用场景，如数据获取等。

- [`React.lazy`](https://zh-hans.reactjs.org/docs/react-api.html#reactlazy)
- [`React.Suspense`](https://zh-hans.reactjs.org/docs/react-api.html#reactsuspense)

### Hook

_Hook_ 是 React 16.8 的新增特性。它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性。Hook 拥有[专属文档章节](https://zh-hans.reactjs.org/docs/hooks-intro.html)和单独的 API 参考文档：

- [基础 Hook](https://zh-hans.reactjs.org/docs/hooks-reference.html#basic-hooks)
  - [`useState`](https://zh-hans.reactjs.org/docs/hooks-reference.html#usestate)
  - [`useEffect`](https://zh-hans.reactjs.org/docs/hooks-reference.html#useeffect)
  - [`useContext`](https://zh-hans.reactjs.org/docs/hooks-reference.html#usecontext)
- [额外的 Hook](https://zh-hans.reactjs.org/docs/hooks-reference.html#additional-hooks)
  - [`useReducer`](https://zh-hans.reactjs.org/docs/hooks-reference.html#usereducer)
  - [`useCallback`](https://zh-hans.reactjs.org/docs/hooks-reference.html#usecallback)
  - [`useMemo`](https://zh-hans.reactjs.org/docs/hooks-reference.html#usememo)
  - [`useRef`](https://zh-hans.reactjs.org/docs/hooks-reference.html#useref)
  - [`useImperativeHandle`](https://zh-hans.reactjs.org/docs/hooks-reference.html#useimperativehandle)
  - [`useLayoutEffect`](https://zh-hans.reactjs.org/docs/hooks-reference.html#uselayouteffect)
  - [`useDebugValue`](https://zh-hans.reactjs.org/docs/hooks-reference.html#usedebugvalue)

---

## 参考

### `React.Component`

`React.Component` 是使用 [ES6 classes](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes) 方式定义 React 组件的基类：

```
class Greeting extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

请参阅 [React.Component API 参考](https://zh-hans.reactjs.org/docs/react-component.html)，获取与基类 `React.Component` 相关方法和属性的详细列表。

---

### `React.PureComponent`

`React.PureComponent` 与 [`React.Component`](https://zh-hans.reactjs.org/docs/react-api.html#reactcomponent) 很相似。两者的区别在于 [`React.Component`](https://zh-hans.reactjs.org/docs/react-api.html#reactcomponent) 并未实现 [`shouldComponentUpdate()`](https://zh-hans.reactjs.org/docs/react-component.html#shouldcomponentupdate)，而 `React.PureComponent` 中以浅层对比 prop 和 state 的方式来实现了该函数。

如果赋予 React 组件相同的 props 和 state，`render()` 函数会渲染相同的内容，那么在某些情况下使用 `React.PureComponent` 可提高性能。

> 注意
>
> `React.PureComponent` 中的 `shouldComponentUpdate()` 仅作对象的浅层比较。如果对象中包含复杂的数据结构，则有可能因为无法检查深层的差别，产生错误的比对结果。仅在你的 props 和 state 较为简单时，才使用 `React.PureComponent`，或者在深层数据结构发生变化时调用 [`forceUpdate()`](https://zh-hans.reactjs.org/docs/react-component.html#forceupdate) 来确保组件被正确地更新。你也可以考虑使用 [immutable 对象](https://facebook.github.io/immutable-js/)加速嵌套数据的比较。
>
> 此外，`React.PureComponent` 中的 `shouldComponentUpdate()` 将跳过所有子组件树的 prop 更新。因此，请确保所有子组件也都是“纯”的组件。

---

### `React.memo`

```
const MyComponent = React.memo(function MyComponent(props) {
  /* 使用 props 渲染 */
});
```

`React.memo` 为[高阶组件](https://zh-hans.reactjs.org/docs/higher-order-components.html)。

如果你的组件在相同 props 的情况下渲染相同的结果，那么你可以通过将其包装在 `React.memo` 中调用，以此通过记忆组件渲染结果的方式来提高组件的性能表现。这意味着在这种情况下，React 将跳过渲染组件的操作并直接复用最近一次渲染的结果。

`React.memo` 仅检查 props 变更。如果函数组件被 `React.memo` 包裹，且其实现中拥有 [`useState`](https://zh-hans.reactjs.org/docs/hooks-state.html)，[`useReducer`](https://zh-hans.reactjs.org/docs/hooks-reference.html#usereducer) 或 [`useContext`](https://zh-hans.reactjs.org/docs/hooks-reference.html#usecontext) 的 Hook，当 state 或 context 发生变化时，它仍会重新渲染。

默认情况下其只会对复杂对象做浅层对比，如果你想要控制对比过程，那么请将自定义的比较函数通过第二个参数传入来实现。

```
function MyComponent(props) {
  /* 使用 props 渲染 */
}
function areEqual(prevProps, nextProps) {
  /*
  如果把 nextProps 传入 render 方法的返回结果与
  将 prevProps 传入 render 方法的返回结果一致则返回 true，
  否则返回 false
  */
}
export default React.memo(MyComponent, areEqual);
```

此方法仅作为**[性能优化](https://zh-hans.reactjs.org/docs/optimizing-performance.html)**的方式而存在。但请不要依赖它来“阻止”渲染，因为这会产生 bug。

> 注意
>
> 与 class 组件中 [`shouldComponentUpdate()`](https://zh-hans.reactjs.org/docs/react-component.html#shouldcomponentupdate) 方法不同的是，如果 props 相等，`areEqual` 会返回 `true`；如果 props 不相等，则返回 `false`。这与 `shouldComponentUpdate` 方法的返回值相反。

---

### `createElement()`

```
React.createElement(
  type,
  [props],
  [...children]
)
```

创建并返回指定类型的新 [React 元素](https://zh-hans.reactjs.org/docs/rendering-elements.html)。其中的类型参数既可以是标签名字符串（如 `'div'` 或 `'span'`），也可以是 [React 组件](https://zh-hans.reactjs.org/docs/components-and-props.html) 类型 （class 组件或函数组件），或是 [React fragment](https://zh-hans.reactjs.org/docs/react-api.html#reactfragment) 类型。

使用 [JSX](https://zh-hans.reactjs.org/docs/introducing-jsx.html) 编写的代码将会被转换成使用 `React.createElement()` 的形式。如果使用了 JSX 方式，那么一般来说就不需要直接调用 `React.createElement()`。请查阅[不使用 JSX](https://zh-hans.reactjs.org/docs/react-without-jsx.html) 章节获得更多信息。

---

### `cloneElement()`

```
React.cloneElement(
  element,
  [config],
  [...children]
)
```

以 `element` 元素为样板克隆并返回新的 React 元素。`config` 中应包含新的 props，`key` 或 `ref`。返回元素的 props 是将新的 props 与原始元素的 props 浅层合并后的结果。新的子元素将取代现有的子元素，如果在 `config` 中未出现 `key` 或 `ref`，那么原始元素的 `key` 和 `ref` 将被保留。

`React.cloneElement()` 几乎等同于：

```
<element.type {...element.props} {...props}>{children}</element.type>
```

但是，这也保留了组件的 `ref`。这意味着当通过 `ref` 获取子节点时，你将不会意外地从你祖先节点上窃取它。相同的 `ref` 将添加到克隆后的新元素中。如果存在新的 `ref` 或 `key` 将覆盖之前的。

引入此 API 是为了替换已弃用的 `React.addons.cloneWithProps()`。

---

### `createFactory()`

```
React.createFactory(type)
```

返回用于生成指定类型 React 元素的函数。与 [`React.createElement()`](https://zh-hans.reactjs.org/docs/react-api.html#createelement) 相似的是，类型参数既可以是标签名字符串（像是 `'div'` 或 `'span'`），也可以是 [React 组件](https://zh-hans.reactjs.org/docs/components-and-props.html) 类型 （class 组件或函数组件），或是 [React fragment](https://zh-hans.reactjs.org/docs/react-api.html#reactfragment) 类型。

此辅助函数已废弃，建议使用 JSX 或直接调用 `React.createElement()` 来替代它。

如果你使用 JSX，通常不会直接调用 `React.createFactory()`。请参阅[不使用 JSX](https://zh-hans.reactjs.org/docs/react-without-jsx.html) 以获得更多信息。

---

### `isValidElement()`

```
React.isValidElement(object)
```

验证对象是否为 React 元素，返回值为 `true` 或 `false`。

---

### `React.Children`

`React.Children` 提供了用于处理 `this.props.children` 不透明数据结构的实用方法。

#### `React.Children.map`

```
React.Children.map(children, function[(thisArg)])
```

在 `children` 里的每个直接子节点上调用一个函数，并将 `this` 设置为 `thisArg`。如果 `children` 是一个数组，它将被遍历并为数组中的每个子节点调用该函数。如果子节点为 `null` 或是 `undefined`，则此方法将返回 `null` 或是 `undefined`，而不会返回数组。

> 注意
>
> 如果 `children` 是一个 `Fragment` 对象，它将被视为单一子节点的情况处理，而不会被遍历。

#### `React.Children.forEach`

```
React.Children.forEach(children, function[(thisArg)])
```

与 [`React.Children.map()`](https://zh-hans.reactjs.org/docs/react-api.html#reactchildrenmap) 类似，但它不会返回一个数组。

#### `React.Children.count`

```
React.Children.count(children)
```

返回 `children` 中的组件总数量，等同于通过 `map` 或 `forEach` 调用回调函数的次数。

#### `React.Children.only`

```
React.Children.only(children)
```

验证 `children` 是否只有一个子节点（一个 React 元素），如果有则返回它，否则此方法会抛出错误。

> 注意：
>
> `React.Children.only()` 不接受 [`React.Children.map()`](https://zh-hans.reactjs.org/docs/react-api.html#reactchildrenmap) 的返回值，因为它是一个数组而并不是 React 元素。

#### `React.Children.toArray`

```
React.Children.toArray(children)
```

将 `children` 这个复杂的数据结构以数组的方式扁平展开并返回，并为每个子节点分配一个 key。当你想要在渲染函数中操作子节点的集合时，它会非常实用，特别是当你想要在向下传递 `this.props.children` 之前对内容重新排序或获取子集时。

> 注意：
>
> `React.Children.toArray()` 在拉平展开子节点列表时，更改 key 值以保留嵌套数组的语义。也就是说，`toArray` 会为返回数组中的每个 key 添加前缀，以使得每个元素 key 的范围都限定在此函数入参数组的对象内。

---

### `React.Fragment`

`React.Fragment` 组件能够在不额外创建 DOM 元素的情况下，让 `render()` 方法中返回多个元素。

```
render() {
  return (
    <React.Fragment>
      Some text.
      <h2>A heading</h2>
    </React.Fragment>
  );
}
```

你也可以使用其简写语法 `<></>`。欲了解更多相关信息，请参阅 [React v16.2.0: Fragments 支持改进](https://zh-hans.reactjs.org/blog/2017/11/28/react-v16.2.0-fragment-support.html)。

### `React.createRef`

`React.createRef` 创建一个能够通过 ref 属性附加到 React 元素的 [ref](https://zh-hans.reactjs.org/docs/refs-and-the-dom.html)。

```
class MyComponent extends React.Component {
  constructor(props) {
    super(props);

    this.inputRef = React.createRef();  }

  render() {
    return <input type="text" ref={this.inputRef} />;  }

  componentDidMount() {
    this.inputRef.current.focus();  }
}
```

### `React.forwardRef`

`React.forwardRef` 会创建一个 React 组件，这个组件能够将其接受的 [ref](https://zh-hans.reactjs.org/docs/refs-and-the-dom.html) 属性转发到其组件树下的另一个组件中。这种技术并不常见，但在以下两种场景中特别有用：

- [转发 refs 到 DOM 组件](https://zh-hans.reactjs.org/docs/forwarding-refs.html#forwarding-refs-to-dom-components)
- [在高阶组件中转发 refs](https://zh-hans.reactjs.org/docs/forwarding-refs.html#forwarding-refs-in-higher-order-components)

`React.forwardRef` 接受渲染函数作为参数。React 将使用 `props` 和 `ref` 作为参数来调用此函数。此函数应返回 React 节点。

```
const FancyButton = React.forwardRef((props, ref) => (  <button ref={ref} className="FancyButton">    {props.children}
  </button>
));

// You can now get a ref directly to the DOM button:
const ref = React.createRef();
<FancyButton ref={ref}>Click me!</FancyButton>;
```

在上述的示例中，React 会将 `<FancyButton ref={ref}>` 元素的 `ref` 作为第二个参数传递给 `React.forwardRef` 函数中的渲染函数。该渲染函数会将 `ref` 传递给 `<button ref={ref}>` 元素。

因此，当 React 附加了 ref 属性之后，`ref.current` 将直接指向 `<button>` DOM 元素实例。

欲了解更多相关信息，请参阅 [refs 转发](https://zh-hans.reactjs.org/docs/forwarding-refs.html)。

### `React.lazy`

`React.lazy()` 允许你定义一个动态加载的组件。这有助于缩减 bundle 的体积，并延迟加载在初次渲染时未用到的组件。

你可以在[代码分割文档](https://zh-hans.reactjs.org/docs/code-splitting.html#reactlazy)中学习如何使用它。查阅[此文章](https://medium.com/@pomber/lazy-loading-and-preloading-components-in-react-16-6-804de091c82d)可以了解更多用法细节。

```
// 这个组件是动态加载的
const SomeComponent = React.lazy(() => import('./SomeComponent'));
```

请注意，渲染 `lazy` 组件依赖该组件渲染树上层的 `<React.Suspense>` 组件。这是指定加载指示器（loading indicator）的方式。

> **注意**
>
> 使用 `React.lazy` 的动态引入特性需要 JS 环境支持 Promise。在 IE11 及以下版本的浏览器中需要通过引入 polyfill 来使用该特性。

### `React.Suspense`

`React.Suspense` 可以指定加载指示器（loading indicator），以防其组件树中的某些子组件尚未具备渲染条件。目前，懒加载组件是 `<React.Suspense>` 支持的**唯一**用例：

```
// 该组件是动态加载的
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    // 显示 <Spinner> 组件直至 OtherComponent 加载完成
    <React.Suspense fallback={<Spinner />}>
      <div>
        <OtherComponent />
      </div>
    </React.Suspense>
  );
}
```

它已被收录在了我们的[代码分割指南](https://zh-hans.reactjs.org/docs/code-splitting.html#reactlazy)中。请注意，`lazy` 组件可以位于 `Suspense` 组件树的深处——它不必包装树中的每一个延迟加载组件。最佳实践是将 `<Suspense>` 置于你想展示加载指示器（loading indicator）的位置，而 `lazy()` 则可被放置于任何你想要做代码分割的地方。

虽然目前尚未支持其它特性，但未来我们计划让 `Suspense` 支持包括数据获取在内的更多场景。你可以在 [roadmap](https://zh-hans.reactjs.org/blog/2018/11/27/react-16-roadmap.html) 中了解相关信息。

> 注意:
>
> `React.lazy()` 和 `<React.Suspense>` 尚未在 `ReactDOMServer` 中支持。这是已知问题，将会在未来解决。

# React.Component

在 React 组件中，代码重用的主要方式是组合而不是继承。

## 生命周期

![image-20220321165406807](C:\Users\ll\AppData\Roaming\Typora\typora-user-images\image-20220321165406807.png)

**[生命周期图谱](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)**

## 常用的生命周期方法

### render()

```
render()
```

render() 方法是 class 组件中唯一必须实现的方法。

当 render 被调用时，它会检查 this.props 和 this.state 的变化并返回以下类型之一：

- React 元素。通常通过 JSX 创建。例如，`<div />` 会被 React 渲染为 DOM 节点，`<MyComponent />` 会被 React 渲染为自定义组件，无论是 `<div />` 还是 `<MyComponent />`均为 React 元素。
- 数组或 fragments。 使得 render 方法可以返回多个元素。欲了解更多详细信息，请参阅 fragments 文档。
- Portals。可以渲染子节点到不同的 DOM 子树中。欲了解更多详细信息，请参阅有关 portals 的文档
- 字符串或数值类型。它们在 DOM 中会被渲染为文本节点
- 布尔类型或 null。什么都不渲染。（主要用于支持返回 test && `<Child />` 的模式，其中 test 为布尔类型。)

render() 函数应该为纯函数，这意味着在不修改组件 state 的情况下，每次调用时都返回相同的结果，并且它不会直接与浏览器交互。

如需与浏览器进行交互，请在 componentDidMount() 或其他生命周期方法中执行你的操作。保持 render() 为纯函数，可以使组件更容易思考。

> 注意
>
> 如果 shouldComponentUpdate() 返回 false，则不会调用 render()。

### constructor()

**如果不初始化 state 或不进行方法绑定，则不需要为 React 组件实现构造函数。**

在 React 组件挂载之前，会调用它的构造函数。在为 React.Component 子类实现构造函数时，应在其他语句之前调用 super(props)。否则，this.props 在构造函数中可能会出现未定义的 bug。

通常，在 React 中，构造函数仅用于以下两种情况：

- 通过给 this.state 赋值对象来初始化内部 state。
- 为事件处理函数绑定实例

在 constructor() 函数中不要调用 setState() 方法。如果你的组件需要使用内部 state，请直接在构造函数中为 this.state 赋值初始 state：

```
constructor(props) {
  super(props);
  // 不要在这里调用 this.setState()
  this.state = { counter: 0 };
  this.handleClick = this.handleClick.bind(this);
}
```

只能在构造函数中直接为 this.state 赋值。如需在其他方法中赋值，你应使用 this.setState() 替代。

要避免在构造函数中引入任何副作用或订阅。如遇到此场景，请将对应的操作放置在 componentDidMount 中。

> 注意
>
> 避免将 props 的值复制给 state！这是一个常见的错误：
>
> ```
> constructor(props) {
> super(props);
> // 不要这样做
> this.state = { color: props.color };
> }
> ```
>
> 如此做毫无必要（你可以直接使用 this.props.color），同时还产生了 bug（更新 prop 中的 color 时，并不会影响 state）。
>
> 只有在你刻意忽略 prop 更新的情况下使用。此时，应将 prop 重命名为 initialColor 或 defaultColor。必要时，你可以修改它的 key，以强制“重置”其内部 state。
>
> 请参阅关于避免派生状态的博文，以了解出现 state 依赖 props 的情况该如何处理。

### componentDidMount()

componentDidMount() 会在组件挂载后（插入 DOM 树中）立即调用。依赖于 DOM 节点的初始化应该放在这里。如需通过网络请求获取数据，此处是实例化请求的好地方。

这个方法是比较适合添加订阅的地方。如果添加了订阅，请不要忘记在 componentWillUnmount() 里取消订阅

你可以在 componentDidMount() 里直接调用 setState()。它将触发额外渲染，但此渲染会发生在浏览器更新屏幕之前。如此保证了即使在 render() 两次调用的情况下，用户也不会看到中间状态。请谨慎使用该模式，因为它会导致性能问题。通常，你应该在 constructor() 中初始化 state。如果你的渲染依赖于 DOM 节点的大小或位置，比如实现 modals 和 tooltips 等情况下，你可以使用此方式处理

---

### componentDidUpdate()

componentDidUpdate() 会在更新后会被立即调用。首次渲染不会执行此方法。

当组件更新后，可以在此处对 DOM 进行操作。如果你对更新前后的 props 进行了比较，也可以选择在此处进行网络请求。（例如，当 props 未发生变化时，则不会执行网络请求）。

```
componentDidUpdate(prevProps) {
  // 典型用法（不要忘记比较 props）：
  if (this.props.userID !== prevProps.userID) {
    this.fetchData(this.props.userID);
  }
}
```

你也可以在 componentDidUpdate() 中直接调用 setState()，但请注意它必须被包裹在一个条件语句里，正如上述的例子那样进行处理，否则会导致死循环。它还会导致额外的重新渲染，虽然用户不可见，但会影响组件性能。不要将 props “镜像”给 state，请考虑直接使用 props。 欲了解更多有关内容，请参阅为什么 props 复制给 state 会产生 bug。

如果组件实现了 getSnapshotBeforeUpdate() 生命周期（不常用），则它的返回值将作为 componentDidUpdate() 的第三个参数 “snapshot” 参数传递。否则此参数将为 undefined。

> 注意
>
> 如果 shouldComponentUpdate() 返回值为 false，则不会调用 componentDidUpdate()。

---

### componentWillUnmount()

componentWillUnmount() 会在组件卸载及销毁之前直接调用。在此方法中执行必要的清理操作，例如，清除 timer，取消网络请求或清除在 componentDidMount() 中创建的订阅等。

componentWillUnmount() 中不应调用 setState()，因为该组件将永远不会重新渲染。组件实例卸载后，将永远不会再挂载它。

---

## 不常用的生命周期方法

### shouldComponentUpdate()

```
shouldComponentUpdate(nextProps, nextState)
```

根据 shouldComponentUpdate() 的返回值，判断 React 组件的输出是否受当前 state 或 props 更改的影响。默认行为是 state 每次发生变化组件都会重新渲染。大部分情况下，你应该遵循默认行为。

当 props 或 state 发生变化时，shouldComponentUpdate() 会在渲染执行之前被调用。返回值默认为 true。首次渲染或使用 forceUpdate() 时不会调用该方法。

此方法仅作为性能优化的方式而存在。不要企图依靠此方法来“阻止”渲染，因为这可能会产生 bug。你应该考虑使用内置的 PureComponent 组件，而不是手动编写 shouldComponentUpdate()。PureComponent 会对 props 和 state 进行浅层比较，并减少了跳过必要更新的可能性。

如果你一定要手动编写此函数，可以将 this.props 与 nextProps 以及 this.state 与 nextState 进行比较，并返回 false 以告知 React 可以跳过更新。请注意，返回 false 并不会阻止子组件在 state 更改时重新渲染。

我们不建议在 shouldComponentUpdate() 中进行深层比较或使用 JSON.stringify()。这样非常影响效率，且会损害性能。

目前，如果 shouldComponentUpdate() 返回 false，则不会调用 UNSAFE_componentWillUpdate()，render() 和 componentDidUpdate()。后续版本，React 可能会将 shouldComponentUpdate 视为提示而不是严格的指令，并且，当返回 false 时，仍可能导致组件重新渲染。

---

### static getDerivedStateFromProps()

```
static getDerivedStateFromProps(props, state)
```

getDerivedStateFromProps 会在调用 render 方法之前调用，并且在初始挂载及后续更新时都会被调用。它应返回一个对象来更新 state，如果返回 null 则不更新任何内容。

此方法适用于罕见的用例，即 state 的值在任何时候都取决于 props。例如，实现 `<Transition>` 组件可能很方便，该组件会比较当前组件与下一组件，以决定针对哪些组件进行转场动画。

派生状态会导致代码冗余，并使组件难以维护。 确保你已熟悉这些简单的替代方案：

- 如果你需要执行副作用（例如，数据提取或动画）以响应 props 中的更改，请改用 componentDidUpdate。
- 如果只想在 prop 更改时重新计算某些数据，请使用 memoization helper 代替。
- 如果你想在 prop 更改时“重置”某些 state，请考虑使组件完全受控或使用 key 使组件完全不受控 代替。

此方法无权访问组件实例。如果你需要，可以通过提取组件 props 的纯函数及 class 之外的状态，在 getDerivedStateFromProps()和其他 class 方法之间重用代码。

请注意，不管原因是什么，都会在每次渲染前触发此方法。这与 UNSAFE_componentWillReceiveProps 形成对比，后者仅在父组件重新渲染时触发，而不是在内部调用 setState 时。

---

### getSnapshotBeforeUpdate()

```
getSnapshotBeforeUpdate(prevProps, prevState)
```

getSnapshotBeforeUpdate() 在最近一次渲染输出（提交到 DOM 节点）之前调用。它使得组件能在发生更改之前从 DOM 中捕获一些信息（例如，滚动位置）。此生命周期方法的任何返回值将作为参数传递给 componentDidUpdate()。

此用法并不常见，但它可能出现在 UI 处理中，如需要以特殊方式处理滚动位置的聊天线程等。

应返回 snapshot 的值（或 null）。

例如：

```
class ScrollingList extends React.Component {
  constructor(props) {
    super(props);
    this.listRef = React.createRef();
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // 我们是否在 list 中添加新的 items ？
    // 捕获滚动位置以便我们稍后调整滚动位置。
    if (prevProps.list.length < this.props.list.length) {
      const list = this.listRef.current;
      return list.scrollHeight - list.scrollTop;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // 如果我们 snapshot 有值，说明我们刚刚添加了新的 items，
    // 调整滚动位置使得这些新 items 不会将旧的 items 推出视图。
    //（这里的 snapshot 是 getSnapshotBeforeUpdate 的返回值）
    if (snapshot !== null) {
      const list = this.listRef.current;
      list.scrollTop = list.scrollHeight - snapshot;
    }
  }

  render() {
    return (
      <div ref={this.listRef}>{/* ...contents... */}</div>
    );
  }
}
```

在上述示例中，重点是从 getSnapshotBeforeUpdate 读取 scrollHeight 属性，因为 “render” 阶段生命周期（如 render）和 “commit” 阶段生命周期（如 getSnapshotBeforeUpdate 和 componentDidUpdate）之间可能存在延迟。

---

### Error boundaries

Error boundaries 是 React 组件，它会在其子组件树中的任何位置捕获 JavaScript 错误，并记录这些错误，展示降级 UI 而不是崩溃的组件树。Error boundaries 组件会捕获在渲染期间，在生命周期方法以及其整个树的构造函数中发生的错误。

如果 class 组件定义了生命周期方法 static getDerivedStateFromError() 或 componentDidCatch() 中的任何一个（或两者），它就成为了 Error boundaries。通过生命周期更新 state 可让组件捕获树中未处理的 JavaScript 错误并展示降级 UI。

仅使用 Error boundaries 组件来从意外异常中恢复的情况；不要将它们用于流程控制。

欲了解更多详细信息，请参阅 React 16 中的错误处理。

> 注意
>
> Error boundaries 仅捕获组件树中以下组件中的错误。但它本身的错误无法捕获。

### static getDerivedStateFromError()

```
static getDerivedStateFromError(error)
```

此生命周期会在后代组件抛出错误后被调用。 它将抛出的错误作为参数，并返回一个值以更新 state

```
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {    // 更新 state 使下一次渲染可以显降级 UI    return { hasError: true };  }
  render() {
    if (this.state.hasError) {      // 你可以渲染任何自定义的降级  UI      return <h1>Something went wrong.</h1>;    }
    return this.props.children;
  }
}
```

> 注意
>
> getDerivedStateFromError() 会在渲染阶段调用，因此不允许出现副作用。 如遇此类情况，请改用 componentDidCatch()。

---

### componentDidCatch()

```
componentDidCatch(error, info)
```

此生命周期在后代组件抛出错误后被调用。 它接收两个参数：

1. error —— 抛出的错误。
2. info —— 带有 componentStack key 的对象，其中包含有关组件引发错误的栈信息。

componentDidCatch() 会在“提交”阶段被调用，因此允许执行副作用。 它应该用于记录错误之类的情况：

```
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染可以显示降级 UI
    return { hasError: true };
  }

  componentDidCatch(error, info) {    // "组件堆栈" 例子:    //   in ComponentThatThrows (created by App)    //   in ErrorBoundary (created by App)    //   in div (created by App)    //   in App    logComponentStackToMyService(info.componentStack);  }
  render() {
    if (this.state.hasError) {
      // 你可以渲染任何自定义的降级 UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```

React 的开发和生产构建版本在 componentDidCatch() 的方式上有轻微差别。

在开发模式下，错误会冒泡至 window，这意味着任何 window.onerror 或 window.addEventListener('error', callback) 会中断这些已经被 componentDidCatch() 捕获的错误。

相反，在生产模式下，错误不会冒泡，这意味着任何根错误处理器只会接受那些没有显式地被 componentDidCatch() 捕获的错误。

> 注意
>
> 如果发生错误，你可以通过调用 setState 使用 componentDidCatch() 渲染降级 UI，但在未来的版本中将不推荐这样做。 可以使用静态 getDerivedStateFromError() 来处理降级渲染。

---

---

---

## 其他 API

不同于上述生命周期方法（React 主动调用），以下方法是你可以在组件中调用的方法。

只有两个方法：setState() 和 forceUpdate()。

### setState()

```
setState(updater, [callback])
```

setState() 将对组件 state 的更改排入队列，并通知 React 需要使用更新后的 state 重新渲染此组件及其子组件。这是用于更新用户界面以响应事件处理器和处理服务器数据的主要方式

将 setState() 视为请求而不是立即更新组件的命令。为了更好的感知性能，React 会延迟调用它，然后通过一次传递更新多个组件。React 并不会保证 state 的变更会立即生效。

setState() 并不总是立即更新组件。它会批量推迟更新。这使得在调用 setState() 后立即读取 this.state 成为了隐患。为了消除隐患，请使用 componentDidUpdate 或者 setState 的回调函数（setState(updater, callback)），这两种方式都可以保证在应用更新后触发。如需基于之前的 state 来设置当前的 state，请阅读下述关于参数 updater 的内容。

除非 shouldComponentUpdate() 返回 false，否则 setState() 将始终执行重新渲染操作。如果可变对象被使用，且无法在 shouldComponentUpdate() 中实现条件渲染，那么仅在新旧状态不一时调用 setState()可以避免不必要的重新渲染

参数一为带有形式参数的 updater 函数：

```
(state, props) => stateChange
```

state 是对应用变化时组件状态的引用。当然，它不应直接被修改。你应该使用基于 state 和 props 构建的新对象来表示变化。例如，假设我们想根据 props.step 来增加 state：

```
this.setState((state, props) => {
  return {counter: state.counter + props.step};
});
```

updater 函数中接收的 state 和 props 都保证为最新。updater 的返回值会与 state 进行浅合并。

setState() 的第二个参数为可选的回调函数，它将在 setState 完成合并并重新渲染组件后执行。通常，我们建议使用 componentDidUpdate() 来代替此方式。

setState() 的第一个参数除了接受函数外，还可以接受对象类型：

```
setState(stateChange[, callback])
```

stateChange 会将传入的对象浅层合并到新的 state 中，例如，调整购物车商品数：

```
this.setState({quantity: 2})
```

这种形式的 setState() 也是异步的，并且在同一周期内会对多个 setState 进行批处理。例如，如果在同一周期内多次设置商品数量增加，则相当于：

```
Object.assign(
  previousState,
  {quantity: state.quantity + 1},
  {quantity: state.quantity + 1},
  ...
)
```

后调用的 setState() 将覆盖同一周期内先调用 setState 的值，因此商品数仅增加一次。如果后续状态取决于当前状态，我们建议使用 updater 函数的形式代替：

```
this.setState((state) => {
  return {quantity: state.quantity + 1};
});
```

有关更多详细信息，请参阅：

- State 和生命周期指南
- 深入学习：何时以及为什么 setState() 会批量执行？
- 深入：为什么不直接更新 this.state？

---

### forceUpdate()

```
component.forceUpdate(callback)
```

默认情况下，当组件的 state 或 props 发生变化时，组件将重新渲染。如果 render() 方法依赖于其他数据，则可以调用 forceUpdate() 强制让组件重新渲染。

调用 forceUpdate() 将致使组件调用 render() 方法，此操作会跳过该组件的 shouldComponentUpdate()。但其子组件会触发正常的生命周期方法，包括 shouldComponentUpdate() 方法。如果标记发生变化，React 仍将只更新 DOM。

通常你应该避免使用 forceUpdate()，尽量在 render() 中使用 this.props 和 this.state。

---

## Class 属性

### defaultProps

defaultProps 可以为 Class 组件添加默认 props。这一般用于 props 未赋值，但又不能为 null 的情况。例如：

```
class CustomButton extends React.Component {
  // ...
}

CustomButton.defaultProps = {
  color: 'blue'
};
```

如果未提供 props.color，则默认设置为 'blue'

```
  render() {
    return <CustomButton /> ; // props.color 将设置为 'blue'
  }
```

如果 props.color 被设置为 null，则它将保持为 null

```
  render() {
    return <CustomButton color={null} /> ; // props.color 将保持是 null
  }
```

---

### displayName

displayName 字符串多用于调试消息。通常，你不需要设置它，因为它可以根据函数组件或 class 组件的名称推断出来。如果调试时需要显示不同的名称或创建高阶组件，请参阅使用 displayname 轻松进行调试了解更多。

## 实例属性

### props

this.props 包括被该组件调用者定义的 props。欲了解 props 的详细介绍，请参阅组件 & Props。

需特别注意，this.props.children 是一个特殊的 prop，通常由 JSX 表达式中的子组件组成，而非组件本身定义。

### state

组件中的 state 包含了随时可能发生变化的数据。state 由用户自定义，它是一个普通 JavaScript 对象。

如果某些值未用于渲染或数据流（例如，计时器 ID），则不必将其设置为 state。此类值可以在组件实例上定义。

欲了解关于 state 的更多信息，请参阅 State & 生命周期。

永远不要直接改变 this.state，因为后续调用的 setState() 可能会替换掉你的改变。请把 this.state 看作是不可变的。

# ReactDOM

## 概览

`react-dom` 的 package 提供了可在应用顶层使用的 DOM（DOM-specific）方法，如果有需要，你可以把这些方法用于 React 模型以外的地方。不过一般情况下，大部分组件都不需要使用这个模块。

- [`render()`](https://zh-hans.reactjs.org/docs/react-dom.html#render)
- [`hydrate()`](https://zh-hans.reactjs.org/docs/react-dom.html#hydrate)
- [`unmountComponentAtNode()`](https://zh-hans.reactjs.org/docs/react-dom.html#unmountcomponentatnode)
- [`findDOMNode()`](https://zh-hans.reactjs.org/docs/react-dom.html#finddomnode)
- [`createPortal()`](https://zh-hans.reactjs.org/docs/react-dom.html#createportal)

### 浏览器支持

React 支持所有的现代浏览器，包括 IE9 及以上版本，但是需要为旧版浏览器比如 IE9 和 IE10 引入[相关的 polyfills 依赖](https://zh-hans.reactjs.org/docs/javascript-environment-requirements.html)。

## 参考

### `render()`

```
ReactDOM.render(element, container[, callback])
```

在提供的 `container` 里渲染一个 React 元素，并返回对该组件的[引用](https://zh-hans.reactjs.org/docs/more-about-refs.html)（或者针对[无状态组件](https://zh-hans.reactjs.org/docs/components-and-props.html#function-and-class-components)返回 `null`）。

如果 React 元素之前已经在 `container` 里渲染过，这将会对其执行更新操作，并仅会在必要时改变 DOM 以映射最新的 React 元素。

如果提供了可选的回调函数，该回调将在组件被渲染或更新之后被执行。

> 注意：
>
> `ReactDOM.render()` 会控制你传入容器节点里的内容。当首次调用时，容器节点里的所有 DOM 元素都会被替换，后续的调用则会使用 React 的 DOM 差分算法（DOM diffing algorithm）进行高效的更新。
>
> `ReactDOM.render()` 不会修改容器节点（只会修改容器的子节点）。可以在不覆盖现有子节点的情况下，将组件插入已有的 DOM 节点中。
>
> `ReactDOM.render()` 目前会返回对根组件 `ReactComponent` 实例的引用。 但是，目前应该避免使用返回的引用，因为它是历史遗留下来的内容，而且在未来版本的 React 中，组件渲染在某些情况下可能会是异步的。 如果你真的需要获得对根组件 `ReactComponent` 实例的引用，那么推荐为根元素添加 [callback ref](https://zh-hans.reactjs.org/docs/refs-and-the-dom.html#callback-refs)。
>
> 使用 `ReactDOM.render()` 对服务端渲染容器进行 hydrate 操作的方式已经被废弃，并且会在 React 17 被移除。作为替代，请使用 [`hydrate()`](https://zh-hans.reactjs.org/docs/react-dom.html#hydrate)。

---

### `hydrate()`

```
ReactDOM.hydrate(element, container[, callback])
```

与 [`render()`](https://zh-hans.reactjs.org/docs/react-dom.html#render) 相同，但它用于在 [`ReactDOMServer`](https://zh-hans.reactjs.org/docs/react-dom-server.html) 渲染的容器中对 HTML 的内容进行 hydrate 操作。React 会尝试在已有标记上绑定事件监听器。

React 希望服务端与客户端渲染的内容完全一致。React 可以弥补文本内容的差异，但是你需要将不匹配的地方作为 bug 进行修复。在开发者模式下，React 会对 hydration 操作过程中的不匹配进行警告。但并不能保证在不匹配的情况下，修补属性的差异。由于性能的关系，这一点非常重要，因为大多是应用中不匹配的情况很少见，并且验证所有标记的成本非常昂贵。

如果单个元素的属性或者文本内容，在服务端和客户端之间有无法避免差异（比如：时间戳），则可以为元素添加 `suppressHydrationWarning={true}` 来消除警告。这种方式只在一级深度上有效，应只作为一种应急方案（escape hatch）。请不要过度使用！除非它是文本内容，否则 React 仍不会尝试修补差异，因此在未来的更新之前，仍会保持不一致。

如果你执意要在服务端与客户端渲染不同内容，你可以采用双重（two-pass）渲染。在客户端渲染不同内容的组件可以读取类似于 `this.state.isClient` 的 state 变量，你可以在 `componentDidMount()` 里将它设置为 `true`。这种方式在初始渲染过程中会与服务端渲染相同的内容，从而避免不匹配的情况出现，但在 hydration 操作之后，会同步进行额外的渲染操作。注意，因为进行了两次渲染，这种方式会使得组件渲染变慢，请小心使用。

记得保证弱网环境下的用户体验。JavaScript 代码的加载要比最初的 HTML 渲染晚的多。因此如果你只在客户端渲染不同的内容，其转换可能会不稳定。但是，如果执行顺利，那么在服务端负责渲染的 shell 会对渲染提供帮助，并且只显示客户端上额外的小组件。欲了解如何在不出现标记不匹配的情况下执行此操作，请参考上一段的解释。

---

### `unmountComponentAtNode()`

```
ReactDOM.unmountComponentAtNode(container)
```

从 DOM 中卸载组件，会将其事件处理器（event handlers）和 state 一并清除。如果指定容器上没有对应已挂载的组件，这个函数什么也不会做。如果组件被移除将会返回 `true`，如果没有组件可被移除将会返回 `false`。

---

### `findDOMNode()`

> 注意:
>
> `findDOMNode` 是一个访问底层 DOM 节点的应急方案（escape hatch）。在大多数情况下，不推荐使用该方法，因为它会破坏组件的抽象结构。[严格模式下该方法已弃用。](https://zh-hans.reactjs.org/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)

```
ReactDOM.findDOMNode(component)
```

如果组件已经被挂载到 DOM 上，此方法会返回浏览器中相应的原生 DOM 元素。此方法对于从 DOM 中读取值很有用，例如获取表单字段的值或者执行 DOM 检测（performing DOM measurements）。**大多数情况下，你可以绑定一个 ref 到 DOM 节点上，可以完全避免使用 findDOMNode。**

当组件渲染的内容为 `null` 或 `false` 时，`findDOMNode` 也会返回 `null`。当组件渲染的是字符串时，`findDOMNode` 返回的是字符串对应的 DOM 节点。从 React 16 开始，组件可能会返回有多个子节点的 fragment，在这种情况下，`findDOMNode` 会返回第一个非空子节点对应的 DOM 节点。

> 注意:
>
> `findDOMNode` 只在已挂载的组件上可用（即，已经放置在 DOM 中的组件）。如果你尝试调用未挂载的组件（例如在一个还未创建的组件上调用 `render()` 中的 `findDOMNode()`）将会引发异常。
>
> `findDOMNode` 不能用于函数组件。

---

### `createPortal()`

```
ReactDOM.createPortal(child, container)
```

创建 portal。[Portal](https://zh-hans.reactjs.org/docs/portals.html) 将提供一种将子节点渲染到 DOM 节点中的方式，该节点存在于 DOM 组件的层次结构之外。

# ReactDOMServer

`ReactDOMServer` 对象允许你将组件渲染成静态标记。通常，它被使用在 Node 服务端上：

```
// ES modules
import ReactDOMServer from 'react-dom/server';
// CommonJS
var ReactDOMServer = require('react-dom/server');
```

## 概览

下述方法可以被使用在服务端和浏览器环境。

- [`renderToString()`](https://zh-hans.reactjs.org/docs/react-dom-server.html#rendertostring)
- [`renderToStaticMarkup()`](https://zh-hans.reactjs.org/docs/react-dom-server.html#rendertostaticmarkup)

下述附加方法依赖一个**只能在服务端使用**的 package（`stream`）。它们在浏览器中不起作用。

- [`renderToNodeStream()`](https://zh-hans.reactjs.org/docs/react-dom-server.html#rendertonodestream)
- [`renderToStaticNodeStream()`](https://zh-hans.reactjs.org/docs/react-dom-server.html#rendertostaticnodestream)

---

## 参考

### `renderToString()`

```
ReactDOMServer.renderToString(element)
```

将 React 元素渲染为初始 HTML。React 将返回一个 HTML 字符串。你可以使用此方法在服务端生成 HTML，并在首次请求时将标记下发，以加快页面加载速度，并允许搜索引擎爬取你的页面以达到 SEO 优化的目的。

如果你在已有服务端渲染标记的节点上调用 [`ReactDOM.hydrate()`](https://zh-hans.reactjs.org/docs/react-dom.html#hydrate) 方法，React 将会保留该节点且只进行事件处理绑定，从而让你有一个非常高性能的首次加载体验。

---

### `renderToStaticMarkup()`

```
ReactDOMServer.renderToStaticMarkup(element)
```

此方法与 [`renderToString`](https://zh-hans.reactjs.org/docs/react-dom-server.html#rendertostring) 相似，但此方法不会在 React 内部创建的额外 DOM 属性，例如 `data-reactroot`。如果你希望把 React 当作静态页面生成器来使用，此方法会非常有用，因为去除额外的属性可以节省一些字节。

如果你计划在前端使用 React 以使得标记可交互，请不要使用此方法。你可以在服务端上使用 [`renderToString`](https://zh-hans.reactjs.org/docs/react-dom-server.html#rendertostring) 或在前端上使用 [`ReactDOM.hydrate()`](https://zh-hans.reactjs.org/docs/react-dom.html#hydrate) 来代替此方法。

---

### `renderToNodeStream()`

```
ReactDOMServer.renderToNodeStream(element)
```

将一个 React 元素渲染成其初始 HTML。返回一个可输出 HTML 字符串的[可读流](https://nodejs.org/api/stream.html#stream_readable_streams)。通过可读流输出的 HTML 完全等同于 [`ReactDOMServer.renderToString`](https://zh-hans.reactjs.org/docs/react-dom-server.html#rendertostring) 返回的 HTML。你可以使用本方法在服务器上生成 HTML，并在初始请求时将标记下发，以加快页面加载速度，并允许搜索引擎抓取你的页面以达到 SEO 优化的目的。

如果你在已有服务端渲染标记的节点上调用 [`ReactDOM.hydrate()`](https://zh-hans.reactjs.org/docs/react-dom.html#hydrate) 方法，React 将会保留该节点且只进行事件处理绑定，从而让你有一个非常高性能的首次加载体验。

> 注意:
>
> 这个 API 仅允许在服务端使用。不允许在浏览器使用。
>
> 通过本方法返回的流会返回一个由 utf-8 编码的字节流。如果你需要另一种编码的流，请查看像 [iconv-lite](https://www.npmjs.com/package/iconv-lite) 这样的项目，它为转换文本提供了转换流。

---

### `renderToStaticNodeStream()`

```
ReactDOMServer.renderToStaticNodeStream(element)
```

此方法与 [`renderToNodeStream`](https://zh-hans.reactjs.org/docs/react-dom-server.html#rendertonodestream) 相似，但此方法不会在 React 内部创建的额外 DOM 属性，例如 `data-reactroot`。如果你希望把 React 当作静态页面生成器来使用，此方法会非常有用，因为去除额外的属性可以节省一些字节。

通过可读流输出的 HTML，完全等同于 [`ReactDOMServer.renderToStaticMarkup`](https://zh-hans.reactjs.org/docs/react-dom-server.html#rendertostaticmarkup) 返回的 HTML。

如果你计划在前端使用 React 以使得标记可交互，请不要使用此方法。你可以在服务端上使用 [`renderToNodeStream`](https://zh-hans.reactjs.org/docs/react-dom-server.html#rendertonodestream) 或在前端上使用 [`ReactDOM.hydrate()`](https://zh-hans.reactjs.org/docs/react-dom.html#hydrate) 来代替此方法。

> 注意:
>
> 此 API 仅限于服务端使用，在浏览器中是不可用的。
>
> 通过本方法返回的流会返回一个由 utf-8 编码的字节流。如果你需要另一种编码的流，请查看像 [iconv-lite](https://www.npmjs.com/package/iconv-lite) 这样的项目，它为转换文本提供了转换流。
