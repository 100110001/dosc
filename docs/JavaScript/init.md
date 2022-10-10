# 继承

继承的方式分为

- 原型链继承 `Child.prototype = new Parent();`

  - 引用类型的属性被所有实例共享
  - 创建实例时，不能向原型传参

- 构造函数(经典继承) `Parent.call(this);`

  - 避免了引用类型的属性被所有实例共享
  - .可以在实例中向原型传参
  - 方法都在构造函数中定义，每次创建实例都会创建一遍方法。

- 组合继承

  - ```
    Child.prototype = new Parent();
    Child.prototype.constructor = Child;
    ```

- 原型式继承 `Object.create`

  - 包含引用类型的属性值始终都会共享相应的值，这点跟原型链继承一样

- 寄生式继承

  - 创建一个仅用于封装继承过程的函数，该函数在内部以某种形式来做增强对象，最后返回对象。
  - 跟借用构造函数模式一样，每次创建对象都会创建一遍方法。

- 寄生组合式继承

  - ```js
    function object(o) {
      function F() {}
      F.prototype = o;
      return new F();
    }

    function prototype(child, parent) {
      var prototype = object(parent.prototype);
      prototype.constructor = child;
      child.prototype = prototype;
    }

    // 当我们使用的时候：
    prototype(Child, Parent);
    ```

# call apply bind

> call() 方法在使用一个指定的 this 值和若干个指定的参数值的前提下调用某个函数或方法。

## call

```js
Function.prototype.call2 = function(context) {
  var context = context || window;
  context.fn = this;

  var args = [];
  for (var i = 1, len = arguments.length; i < len; i++) {
    args.push("arguments[" + i + "]");
  }

  var result = eval("context.fn(" + args + ")");

  delete context.fn;
  return result;
};
```

## apply

```js
Function.prototype.apply = function(context, arr) {
  var context = Object(context) || window;
  context.fn = this;

  var result;
  if (!arr) {
    result = context.fn();
  } else {
    var args = [];
    for (var i = 0, len = arr.length; i < len; i++) {
      args.push("arr[" + i + "]");
    }
    result = eval("context.fn(" + args + ")");
  }
  delete context.fn;
  return result;
};
```

## bind

> bind() 方法会创建一个新函数。当这个新函数被调用时，bind 的第一个参数将作为它运行时的 this，之后的一序列参数将会在传递的实参前传入作为它的参数。返回一个函数

```js
Function.prototype.bind2 = function(context) {
  if (typeof this !== "function") {
    throw new Error(
      "Function.prototype.bind - what is trying to be bound is not callable"
    );
  }

  var self = this;
  var args = Array.prototype.slice.call(arguments, 1);
  var fNOP = function() {};

  var fBound = function() {
    var bindArgs = Array.prototype.slice.call(arguments);
    return self.apply(
      this instanceof fNOP ? this : context,
      args.concat(bindArgs)
    );
  };

  fNOP.prototype = this.prototype;
  fBound.prototype = new fNOP();
  return fBound;
};
```

# new

> new 运算符创建一个用户定义的对象类型的实例或具有构造函数的内置对象类型之一

## 模拟

```js
function objectFactory() {
  var obj = new Object(),
    Constructor = [].shift.call(arguments);

  obj.__proto__ = Constructor.prototype;

  var ret = Constructor.apply(obj, arguments);

  return typeof ret === "object" ? ret : obj;
}
```

# 立即调用函数表达式（IIFE）

JavaScript 里 函数被调用时，会创建一个新的执行上下文。因为在函数中定义的变量和函数是唯一在内部被访问的变量和函数是唯一在内部被访问的变量，而不是在外部被访问的变量。当函数被调用时，函数提供的上下文提供了一个创建私有变量的方法

# 柯里化

参数复用。本质上是降低通用性，提高适用性

# Event Loop

在 node 中，事件循环表现出的状态与浏览器中大致相同。不同的是 node 中有一套自己的模型。node 中事件循环的实现是依靠的 libuv 引擎。我们知道 node 选择 chrome v8 引擎作为 js 解释器，v8 引擎将 js 代码分析后去调用对应的 node api，而这些 api 最后则由 libuv 引擎驱动，执行对应的任务，并把不同的事件放在不同的队列中等待主线程执行。 因此实际上 node 中的事件循环存在于 libuv 引擎中。

libuv 引擎中的事件循环的模型:

```
 ┌───────────────────────┐
┌─>│        timers         │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
│  │     I/O callbacks     │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
│  │     idle, prepare     │
│  └──────────┬────────────┘      ┌───────────────┐
│  ┌──────────┴────────────┐      │   incoming:   │
│  │         poll          │<──connections───     │
│  └──────────┬────────────┘      │   data, etc.  │
│  ┌──────────┴────────────┐      └───────────────┘
│  │        check          │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
└──┤    close callbacks    │
   └───────────────────────┘
```

外部输入数据-->轮询阶段(poll)-->检查阶段(check)-->关闭事件回调阶段(close callback)-->定时器检测阶段(timer)-->I/O 事件回调阶段(I/O callbacks)-->闲置阶段(idle, prepare)-->轮询阶段...

这些阶段大致的功能如下：

- timers: 这个阶段执行定时器队列中的回调如 `setTimeout()` 和 `setInterval()`。
- I/O callbacks: 这个阶段执行几乎所有的回调。但是不包括 close 事件，定时器和`setImmediate()`的回调。
- idle, prepare: 这个阶段仅在内部使用，可以不必理会。
- poll: 等待新的 I/O 事件，node 在一些特殊情况下会阻塞在这里。
- check: `setImmediate()`的回调会在这个阶段执行。
- close callbacks: 例如`socket.on('close', ...)`这种 close 事件的回调。

## **poll 阶段**

当个 v8 引擎将 js 代码解析后传入 libuv 引擎后，循环首先进入 poll 阶段。poll 阶段的执行逻辑如下： 先查看 poll queue 中是否有事件，有任务就按先进先出的顺序依次执行回调。 当 queue 为空时，会检查是否有 setImmediate() 的 callback，如果有就进入 check 阶段执行这些 callback。但同时也会检查是否有到期的 timer，如果有，就把这些到期的 timer 的 callback 按照调用顺序放到 timer queue 中，之后循环会进入 timer 阶段执行 queue 中的 callback。 这两者的顺序是不固定的，收到代码运行的环境的影响。如果两者的 queue 都是空的，那么 loop 会在 poll 阶段停留，直到有一个 i/o 事件返回，循环会进入 i/o callback 阶段并立即执行这个事件的 callback。

值得注意的是，poll 阶段在执行 poll queue 中的回调时实际上不会无限的执行下去。有两种情况 poll 阶段会终止执行 poll queue 中的下一个回调：1.所有回调执行完毕。2.执行数超过了 node 的限制。

## **check 阶段**

check 阶段专门用来执行`setImmediate()`方法的回调，当 poll 阶段进入空闲状态，并且 setImmediate queue 中有 callback 时，事件循环进入这个阶段。

## **close 阶段**

当一个 socket 连接或者一个 handle 被突然关闭时（例如调用了`socket.destroy()`方法），close 事件会被发送到这个阶段执行回调。否则事件会用`process.nextTick（）`方法发送出去。

## **timer 阶段**

这个阶段以先进先出的方式执行所有到期的 timer 加入 timer 队列里的 callback，一个 timer callback 指得是一个通过 setTimeout 或者 setInterval 函数设置的回调函数。

## **I/O callback 阶段**

如上文所言，这个阶段主要执行大部分 I/O 事件的回调，包括一些为操作系统执行的回调。例如一个 TCP 连接生错误时，系统需要执行回调来获得这个错误的报告。

# process.nextTick, setTimeout 与 setImmediate 的区别与使用场景

在 node 中有三个常用的用来推迟任务执行的方法：process.nextTick,setTimeout（setInterval 与之相同）与 setImmediate

这三者间存在着一些非常不同的区别：

## **process.nextTick()**

尽管没有提及，但是实际上 node 中存在着一个特殊的队列，即 nextTick queue。这个队列中的回调执行虽然没有被表示为一个阶段，当时这些事件却会在每一个阶段执行完毕准备进入下一个阶段时优先执行。当事件循环准备进入下一个阶段之前，会先检查 nextTick queue 中是否有任务，如果有，那么会先清空这个队列。与执行 poll queue 中的任务不同的是，这个操作在队列清空前是不会停止的。这也就意味着，错误的使用`process.nextTick()`方法会导致 node 进入一个死循环。。直到内存泄漏。

那么合适使用这个方法比较合适呢？下面有一个例子：

```js
const server = net.createServer(() => {}).listen(8080);

server.on("listening", () => {});
```

这个例子中当，当 listen 方法被调用时，除非端口被占用，否则会立刻绑定在对应的端口上。这意味着此时这个端口可以立刻触发 listening 事件并执行其回调。然而，这时候`on('listening)`还没有将 callback 设置好，自然没有 callback 可以执行。为了避免出现这种情况，node 会在 listen 事件中使用`process.nextTick()`方法，确保事件在回调函数绑定后被触发。

## **setTimeout()和 setImmediate()**

在三个方法中，这两个方法最容易被弄混。实际上，某些情况下这两个方法的表现也非常相似。然而实际上，这两个方法的意义却大为不同。

`setTimeout()`方法是定义一个回调，并且希望这个回调在我们所指定的时间间隔后第一时间去执行。注意这个“第一时间执行”，这意味着，受到操作系统和当前执行任务的诸多影响，该回调并不会在我们预期的时间间隔后精准的执行。执行的时间存在一定的延迟和误差，这是不可避免的。node 会在可以执行 timer 回调的第一时间去执行你所设定的任务。

`setImmediate()`方法从意义上将是立刻执行的意思，但是实际上它却是在一个固定的阶段才会执行回调，即 poll 阶段之后。有趣的是，这个名字的意义和之前提到过的`process.nextTick()`方法才是最匹配的。node 的开发者们也清楚这两个方法的命名上存在一定的混淆，他们表示不会把这两个方法的名字调换过来---因为有大量的 node 程序使用着这两个方法，调换命名所带来的好处与它的影响相比不值一提。

`setTimeout()`和不设置时间间隔的`setImmediate()`表现上及其相似。猜猜下面这段代码的结果是什么？

```js
setTimeout(() => {
  console.log("timeout");
}, 0);

setImmediate(() => {
  console.log("immediate");
});
```

实际上，答案是不一定。没错，就连 node 的开发者都无法准确的判断这两者的顺序谁前谁后。这取决于这段代码的运行环境。运行环境中的各种复杂的情况会导致在同步队列里两个方法的顺序随机决定。但是，在一种情况下可以准确判断两个方法回调的执行顺序，那就是在一个 I/O 事件的回调中。下面这段代码的顺序永远是固定的：

```js
const fs = require("fs");

fs.readFile(__filename, () => {
  setTimeout(() => {
    console.log("timeout");
  }, 0);
  setImmediate(() => {
    console.log("immediate");
  });
});
```

答案永远是：

```text
immediate
timeout
```

因为在 I/O 事件的回调中，setImmediate 方法的回调永远在 timer 的回调前执行。
