# 代码

## deepClone

```javascript
export function deepClone(obj, hash = new WeakMap()) {
  // 处理null或者undefined
  if (obj === null) return obj;
  // 处理日期类型
  if (obj instanceof Date) return new Date(obj);
  // 处理正则类型
  if (obj instanceof RegExp) return new RegExp(obj);
  // 普通值或函数不需要深拷贝
  if (typeof obj !== "object") return obj;
  // 对象进行深拷贝
  if (hash.get(obj)) return hash.get(obj);
  let cloneObj = new obj.constructor();
  // 找到的是所属类原型上的constructor,而原型上的 constructor指向的是当前类本身
  hash.set(obj, cloneObj);
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      // 实现一个递归拷贝
      cloneObj[key] = deepClone(obj[key], hash);
    }
  }
  return cloneObj;
}
```

## debounce



在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时。

``` javascript
var timer; // 维护同一个timer
function debounce(fn, delay) {
    clearTimeout(timer);
    timer = setTimeout(function(){
        fn();
    }, delay);
}
```



优化

```javascript
function debounce(fn, delay) {
    var timer; // 维护一个 timer
    return function () {
        var _this = this; // 取debounce执行作用域的this
        var args = arguments;
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(function () {
            fn.apply(_this, args); // 用apply指向调用debounce的对象，相当于_this.fn(args);
        }, delay);
    };
}
```





## throttle

每隔一段时间，只执行一次函数。

```javascript
function throttle(fn, delay) {
    var timer;
    return function () {
        var _this = this;
        var args = arguments;
        if (timer) {
            return;
        }
        timer = setTimeout(function () {
            fn.apply(_this, args);
            timer = null; // 在delay后执行完fn之后清空timer，此时timer为假，throttle触发可以进入计时器
        }, delay)
    }
}
```



## debounce和throttle



### 异同比较

相同点：

- 都可以通过使用 setTimeout 实现。
- 目的都是，降低回调执行频率。节省计算资源。

不同点：

- 函数防抖，在一段连续操作结束后，处理回调，**利用clearTimeout 和 setTimeout实现**。函数节流，在一段连续操作中，**每一段时间只执行一次**，频率较高的事件中使用来提高性能。
- 函数防抖关注一定时间连续触发的事件只在最后执行一次，而函数节流侧重于一段时间内只执行一次。

### 常见应用场景

#### 函数防抖的应用场景

连续的事件，只需触发一次回调的场景有：

- 搜索框搜索输入。只需用户最后一次输入完，再发送请求
- 手机号、邮箱验证输入检测
- 窗口大小Resize。只需窗口调整完成后，计算窗口大小。防止重复渲染。

#### 函数节流的应用场景

间隔一段时间执行一次回调的场景有：

- 滚动加载，加载更多或滚到底部监听
- 谷歌搜索框，搜索联想功能
- 高频点击提交，表单重复提交





## 常用公共方法封装



```js
var Common = (function(NS, $) {
  NS["cookie"] = {
    /**
     * 设置cookie
     * @param name cookie名称
     * @param value cookie值
     * @param iDay cookie的时间
     */
    setCookie: function(name, value, iDay) {
      var oDate = new Date();
      oDate.setDate(oDate.getDate() + iDay);
      document.cookie = name + "=" + value + ";expires=" + oDate;
    },
    /**
     * 获取cookie
     * @param name cookie名称
     * @returns
     */
    getCookie: function(name) {
      var arr = document.cookie.split("; ");
      for (var i = 0; i < arr.length; i++) {
        var arr2 = arr[i].split("=");
        if (arr2[0] == name) {
          return arr2[1];
        }
      }
      return "";
    },
    /**
     * 删除cookie
     * @param name cookie名称
     */
    removeCookie: function(name) {
      setCookie(name, 1, -1);
    },
  };
  /**
   * 其他方法
   */
  NS["other"] = {
    /**
     * 检测密码强度
     * @param str 字符串
     * @returns 1：密码弱 2：密码中等 3：密码强 4：密码很强
     */
    checkPwd: function(str) {
      var nowLv = 0;
      if (str.length < 6) {
        return nowLv;
      }
      if (/[0-9]/.test(str)) {
        nowLv++;
      }
      if (/[a-z]/.test(str)) {
        nowLv++;
      }
      if (/[A-Z]/.test(str)) {
        nowLv++;
      }
      if (/[\.|-|_]/.test(str)) {
        nowLv++;
      }
      return nowLv;
    },
    /**
     * 获取URL参数
     * @param url 地址
     * @returns 例：getUrlPrmt("http://www.baidu.com?id=1&nam=张三&uid=12345654321&type=1,2,3")，结果{id: "1", nam: "张三", uid: "12345654321", type: "1,2,3"}
     */
    getUrlPrmt: function(url) {
      url = url ? url : window.location.href;
      let _pa = url.substring(url.indexOf("?") + 1),
        _arrS = _pa.split("&"),
        _rs = {};
      for (var i = 0, _len = _arrS.length; i < _len; i++) {
        let pos = _arrS[i].indexOf("=");
        if (pos == -1) {
          continue;
        }
        let name = _arrS[i].substring(0, pos),
          value = window.decodeURIComponent(_arrS[i].substring(pos + 1));
        _rs[name] = value;
      }
      return _rs;
    },
    /**
     * 返回指定某个区间的一个数字（可以不传参，不传就返回0-255之间的数；可以只传一个，返回0到传入的这个数字之间的某个值）
     * @param n1 开始区间 例：5
     * @param n2 结束区间 例：10
     * @returns 返回这个区间的某个随机值
     */
    randomNumber: function(n1, n2) {
      if (arguments.length === 2) {
        return Math.round(n1 + Math.random() * (n2 - n1));
      } else if (arguments.length === 1) {
        return Math.round(Math.random() * n1);
      } else {
        return Math.round(Math.random() * 255);
      }
    },
    /**
     * 随机产生某个颜色
     * @returns {String} 颜色 例：rgb(250,82,49)
     */
    randomColor: function() {
      //randomNumber是上面定义的函数
      //写法1
      return (
        "rgb(" +
        randomNumber(255) +
        "," +
        randomNumber(255) +
        "," +
        randomNumber(255) +
        ")"
      );

      //写法2
      return (
        "#" +
        Math.random()
          .toString(16)
          .substring(2)
          .substr(0, 6)
      );

      //写法3
      var color = "#";
      for (var i = 0; i < 6; i++) {
        color += "0123456789abcdef"[randomNumber(15)];
      }
      return color;
    },
  };
  /**
   * 数组相关方法
   */
  NS["arr"] = {
    /**
     * 数组去重
     * 用的是Array的from方法
     * @param arr 数组
     * @returns 去重后的数组
     */
    removeRepeatArray: function(arr) {
      return Array.from(new Set(arr));
    },
    /**
     * 将数组乱序输出
     * @param arr 数组
     * @returns 打乱后的数组
     */
    upsetArr: function(arr) {
      return arr.sort(function() {
        return Math.random() - 0.5;
      });
    },
    /**
     * 获取数组的最大值，最小值，只针对数字类型的数组
     * @param arr 数组
     * @param type 0：最小值，1：最大值
     * @returns
     */
    compareArr: function(arr, type) {
      if (type == 1) {
        return Math.max.apply(null, arr);
      } else {
        return Math.min.apply(null, arr);
      }
    },
    /**
     * 得到数组的和，只针对数字类型数组
     * @param arr 数组
     * @returns {Number} 和
     */
    sumArr: function(arr) {
      var sumText = 0;
      for (var i = 0, len = arr.length; i < len; i++) {
        sumText += arr[i];
      }
      return sumText;
    },
    /**
     * 数组的平均值,只针对数字类型数组，小数点可能会有很多位，这里不做处理，处理了使用就不灵活了！
     * @param arr 数组
     * @returns {Number} 平均值
     */
    covArr: function(arr) {
      var sumText = sumArr(arr);
      var covText = sumText / arr.length;
      return covText;
    },
    /**
     * 随机获取数组中的某个元素
     * @param arr 数组
     * @returns 随机获取的值
     */
    randomOne: function(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    },
    /**
     * 返回某个元素在数组中出现的次数
     * @param arr 数组
     * @param ele 要查找的元素
     * @returns {Number} 出现的次数
     */
    getEleCount: function(arr, ele) {
      var num = 0;
      for (var i = 0, len = arr.length; i < len; i++) {
        if (ele == arr[i]) {
          num++;
        }
      }
      return num;
    },
    /**
     * 简单数组排序，针对数字数组
     * @param type 1：降序，0：升序
     */
    sortArr: function(arr, type) {
      if (type == 1) {
        //降序
        arr.sort(function(a, b) {
          return b - a;
        });
      } else {
        arr.sort(function(a, b) {
          return a - b;
        });
      }
      return arr;
    },
    sortObjectArr: function(arr, type) {
      if (type == 1) {
        arr.sort(function(a, b) {
          if (a.age > b.age) return 1;
          if (a.age < b.age) return -1;
          if ((a.age = b.age)) return 0;
        });
      } else {
        arr.sort(function(a, b) {
          if (a.age > b.age) return -1;
          if (a.age < b.age) return 1;
          if ((a.age = b.age)) return 0;
        });
      }
      return arr;
    },
  };
  NS["time"] = {
    /**
     * 倒计时（默认开始时间为当前时间）
     * @param endTime 结束时间
     * @returns 例：剩余时间1天 16小时 45 分钟41 秒
     */
    getEndTime: function(endTime) {
      var startDate = new Date(); //开始时间，当前时间
      var endDate = new Date(endTime); //结束时间，需传入时间参数
      var t = endDate.getTime() - startDate.getTime(); //时间差的毫秒数
      var d = 0,
        h = 0,
        m = 0,
        s = 0;
      if (t >= 0) {
        d = Math.floor(t / 1000 / 3600 / 24);
        h = Math.floor((t / 1000 / 60 / 60) % 24);
        m = Math.floor((t / 1000 / 60) % 60);
        s = Math.floor((t / 1000) % 60);
      }
      return "剩余时间" + d + "天 " + h + "小时 " + m + " 分钟" + s + " 秒";
    },
  };
  /*
   * 加密解密Common.base64.base64Encode(input)
   */
  NS["base64"] = {
    //base64加密函数
    base64Encode: function(input) {
      var rv = encodeURIComponent(input);
      rv = unescape(rv);
      rv = window.btoa(rv);
      return rv;
    },
    //base64解密函数
    base64Decode: function(input) {
      var rv = window.atob(input);
      rv = escape(rv);
      rv = decodeURIComponent(rv);
      return rv;
    },
  };
  /*
   * 字符串处理的公共方法
   */
  NS["str"] = {
    /**
     * 去除字符串空格
     * @param str 要处理的字符串
     * @param type 1：所有空格 2：前后空格 3：前空格 4：后空格
     */
    strTrim: function(str, type) {
      switch (type) {
        case 1:
          return str.replace(/\s+/g, "");
        case 2:
          return str.replace(/(^\s*)|(\s*$)/g, "");
        case 3:
          return str.replace(/(^\s*)/g, "");
        case 4:
          return str.replace(/(\s*$)/g, "");
        default:
          return str;
      }
    },
    /**
     * 字母大小写切换
     * @param str 要处理的字符串
     * @param type 1:首字母大写 2：首页母小写 3：大小写转换 4：全部大写 5：全部小写
     */
    strChangeCase: function(str, type) {
      function ToggleCase(str) {
        var itemText = "";
        str.split("").forEach(function(item) {
          if (/^([a-z]+)/.test(item)) {
            itemText += item.toUpperCase();
          } else if (/^([A-Z]+)/.test(item)) {
            itemText += item.toLowerCase();
          } else {
            itemText += item;
          }
        });
        return itemText;
      }

      switch (type) {
        case 1:
          return str.replace(/^(\w)(\w+)/, function(v, v1, v2) {
            return v1.toUpperCase() + v2.toLowerCase();
          });
        case 2:
          return str.replace(/^(\w)(\w+)/, function(v, v1, v2) {
            return v1.toLowerCase() + v2.toUpperCase();
          });
        case 3:
          return ToggleCase(str);
        case 4:
          return str.toUpperCase();
        case 5:
          return str.toLowerCase();
        default:
          return str;
      }
    },
    /**
     * 字符串替换
     * @param str 字符串
     * @param aFindText 要替换的字符
     * @param aRepText 替换成什么
     */
    replaceAll: function(str, aFindText, aRepText) {
      raRegExp = new RegExp(aFindText, "g");
      return str.replace(raRegExp, aRepText);
    },
    /**
     * 查找某个字符或字符串在另一个字符串中出现的次数
     * @param str 字符串
     * @param strSplit 要查找的字符或字符串
     * @returns {Number} 返回出现的次数
     * 例：countStr("klsdjflds","s") 返回2
     */
    countStr: function(str, strSplit) {
      return str.split(strSplit).length - 1;
    },
  };
  /*
   * 价格模块
   */
  NS["price"] = {
    /*
     *@名称:  switch 切换价格
     *@参数:  float usAmount 美元价格
     *       float rate 汇率
     *@描述:  使用方法TT_GET('price').switch('价格', '汇率');
     *@返回:  float
     */
    switch: function(usAmount, rate) {
      var _curr = NS.cookie.get("TT_CURR");
      if (_curr == "JPY") {
        var price = Math.round((usAmount * rate * 10000 + 1) / 10000);
      } else {
        var price = (
          Math.round((usAmount * rate * 1000000 + 1) / 10000) / 100
        ).toFixed(2);
      }
      return price;
    },
  };
  /*
   * ajax 语言参数
   */
  NS["lactions"] = {
    /*
     *@名称:  getId 获取语言ID
     *@参数:  string code 语言代码
     *@描述:  使用方法TT_NS.lactions.lang();
     *@返回:  float
     */
    lang: function() {
      var locations = window.location.href;
      var lang = /\/es\/|\/ru\/|\/de\/|\/fr\/|\/it\/|\/ar\/|\/pl\/|\/jp\/|\/pt\/|\/en\//;
      lang = lang.test(locations);
      if (lang == true) {
        lang = locations.split("/");
        return "&lang=" + lang[3];
      } else {
        return "";
      }
    },
    /*
     *@名称:  getId 获取语言ID
     *@参数:  string code 语言代码
     *@描述:  使用方法TT_NS.lactions.langShort();
     *@返回:  float
     */
    langShort: function() {
      var locations = window.location.href;
      var lang = /\/es\/|\/ru\/|\/de\/|\/fr\/|\/it\/|\/ar\/|\/pl\/|\/jp\/|\/pt\/|\/en\//;
      lang = lang.test(locations);
      if (lang == true) {
        lang = locations.split("/");
        return lang[3];
      } else {
        return "";
      }
    },
  };
  NS["AD_TOP"] = {
    /**
     * @functionName: 底部提示框
     * @param:        无
     * @description:  底部广告条，当用户点击关闭按钮的时候,记录cookie值，关掉之后不再显示，cookie的有效时间为一天。
     * @return:       无
     */
    adCookie: "",
    init: function() {
      var _this = this;
      _this.showTopAD("#close_topad");
      _this.closeTopAd();
    },
    setCookie: function(name, value, day) {
      var _day = day || 7;
      var oDate = new Date();
      oDate.setDate(oDate.getDate() + _day);
      document.cookie = name + "=" + value + "; expires =" + oDate;
    },
    closeTopAd: function() {
      var _this = this;
      $("#close_topad").click(function() {
        _this.adCookie = $(this)
          .parent()
          .find("img")
          .attr("alt");
        _this.setCookie("topAD", _this.adCookie, 1);
        $(this)
          .parent()
          .hide();
      });
    },
    showTopAD: function(obj) {
      var _this = this;
      _this.adCookie = $(obj)
        .parent()
        .find("img")
        .attr("alt");
      var ckTopAd = NS["cookie"].get("topAD");
      if (ckTopAd == _this.adCookie) {
        $(obj)
          .parent()
          .hide();
      } else {
        $(obj)
          .parent()
          .show();
      }
    },
  };
  //检查email
  NS["check"] = {
    email: function(email) {
      var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
      var isok = reg.test(email);
      if (!isok) {
        return false;
      } else {
        return true;
      }
    },
  };

  return NS;
})(window.Common || {}, jQuery);

```







## 发布订阅者模式



```js
class EventEmitter {
  constructor() {
    this.arr = {}
  }

  on(name, fn) {
    this.arr[name] ? this.arr[name].push(fn) : this.arr[name] = [fn]
  }

  off(name, fn) {
    if(this.arr[name)) {
      if(fn) {
        this.arr[name] = this.arr[name].filter(o => o!==fn);
      } else {
        delete this.arr[name]
      }
    }
  }

  once(name, fn) {
   this.arr[name] = fn
  }

  emit(name, params) {
    // this.$emit('change', params)
    if(Array.isArray(this.arr[name]))
    {
      this.arr[name].forEach(fn => {
      fn(params)
    })
    } else{
      this.arr[name](params)
      off(name)
    }
  }
}
```

