# 原型链

## 概念

上图中的复杂关系，实际上来源就两行代码

```javascript
function Foo() {}
var f1 = new Foo();
```

### 【构造函数】

用来初始化新创建的对象的函数是构造函数。在例子中，Foo()函数是构造函数

### 【实例对象】

通过构造函数的 new 操作创建的对象是实例对象。可以用一个构造函数，构造多个实例对象

```javascript
function Foo() {}
var f1 = new Foo();
var f2 = new Foo();
console.log(f1 === f2); //false
```

### 【原型对象及 prototype】

构造函数有一个 prototype 属性，指向实例对象的原型对象。通过同一个构造函数实例化的多个对象具有相同的原型对象。经常使用原型对象来实现继承

```javascript
function Foo() {}
Foo.prototype.a = 1;
var f1 = new Foo();
var f2 = new Foo();

console.log(Foo.prototype.a); //1
console.log(f1.a); //1
console.log(f2.a); //1
```

### 【constructor】

原型对象有一个 constructor 属性，指向该原型对象对应的构造函数

```javascript
function Foo() {}
console.log(Foo.prototype.constructor === Foo); //true
```

由于实例对象可以继承原型对象的属性，所以实例对象也拥有 constructor 属性，同样指向原型对象对应的构造函数

```javascript
function Foo() {}
var f1 = new Foo();
console.log(f1.constructor === Foo); //true
```

### 【proto】

实例对象有一个 proto 属性，指向该实例对象对应的原型对象

```javascript
function Foo() {}
var f1 = new Foo();
console.log(f1.__proto__ === Foo.prototype); //true
```

### 【总结】

```javascript
function Foo() {}
Foo.prototype.a = 1;
var f1 = new Foo();
var f2 = new Foo();

console.log(f1 === f2); //false
console.log(Foo.prototype.a); //1
console.log(f1.a); //1
console.log(f2.a); //1
console.log(Foo.prototype.constructor === Foo); //true
console.log(f1.constructor === Foo); //true
console.log(f1.__proto__ === Foo.prototype); //true
```

## **说明**

![img](https://images2015.cnblogs.com/blog/740839/201607/740839-20160730193902825-154724878.jpg)
