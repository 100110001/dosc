# Web

## HTTP 1.0/1.1/2.0 的区别

### HTTP1.0

HTTP 1.0 浏览器与服务器只保持短暂的连接，每次请求都需要与服务器建立一个 TCP 连接

服务器完成请求处理后立即断开 TCP 连接，服务器不跟踪每个客户也不记录过去的请求

如果需要建立长连接，需要设置一个非标准的 Connection 字段 `Connection: keep-alive`

### HTTP1.1

在`HTTP1.1`中，默认支持长连接（`Connection: keep-alive`），即在一个 TCP 连接上可以传送多个`HTTP`请求和响应，减少了建立和关闭连接的消耗和延迟

`HTTP 1.1`还允许客户端不用等待上一次请求结果返回，就可以发出下一次请求，但服务器端必须按照接收到客户端请求的先后顺序依次回送响应结果，以保证客户端能够区分出每次请求的响应内容，这样也显著地减少了整个下载过程所需要的时间

`HTTP1.1`在`HTTP1.0`的基础上，增加更多的请求头和响应头来完善的功能，如下：

- 引入了更多的缓存控制策略，如`If-Unmodified-Since`,`If-Match`, `If-None-Match`等缓存头来控制缓存策略
- 引入`range`，允许值请求资源某个部分
- 引入`host`，实现了在一台 WEB 服务器上可以在同一个 IP 地址和端口号上使用不同的主机名来创建多个虚拟 WEB 站点
- 其他的请求方法：`put`、`delete`、`options`

### HTTP2.0

而`HTTP2.0`在相比之前版本，性能上有很大的提升，如添加了一个特性：

- 多路复用
  - `HTTP/2` 复用`TCP`连接，在一个连接里，客户端和浏览器都可以**同时**发送多个请求或回应，而且不用按照顺序一一对应，这样就避免了”队头堵塞”
- 二进制分帧

  - 帧是`HTTP2`通信中最小单位信息。`HTTP/2` 采用二进制格式传输数据，而非 `HTTP 1.x`的文本格式，解析起来更高效。将请求和响应数据分割为更小的帧，并且它们采用二进制编码。
  - `HTTP2`中，同域名下所有通信都在单个连接上完成，该连接可以承载任意数量的双向数据流
  - 每个数据流都以消息的形式发送，而消息又由一个或多个帧组成。多个帧之间可以乱序发送，根据帧首部的流标识可以重新组装，这也是多路复用同时发送数据的实现条件

- 首部压缩
  - `HTTP/2`在客户端和服务器端使用“首部表”来跟踪和存储之前发送的键值对，对于相同的数据，不再通过每次请求和响应发送
- 服务器推送
  - `HTTP2`引入服务器推送，允许服务端推送资源给客户端

### 总结

- HTTP1.0

  - 浏览器与服务器只保持短暂的连接，浏览器的每次请求都需要与服务器建立一个 TCP 连接

- HTTP1.1：

  - 引入了持久连接，即 TCP 连接默认不关闭，可以被多个请求复用

  - 在同一个 TCP 连接里面，客户端可以同时发送多个请求

  - 虽然允许复用 TCP 连接，但是同一个 TCP 连接里面，所有的数据通信是按次序进行的，服务器只有处理完一个请求，才会接着处理下一个请求。如果前面的处理特别慢，后面就会有许多请求排队等着

  - 新增了一些请求方法

  - 新增了一些请求头和响应头

- HTTP2.0：

  - 采用二进制格式而非文本格式

  - 完全多路复用，而非有序并阻塞的、只需一个连接即可实现并行

  - 使用报头压缩，降低开销

  - 服务器推送

## 缓存

![An image](@assets/25c0f1f233a3d92110e53babda04f4d.jpg)

### HTTP 报文中与缓存相关的首部字段

| 通用首部字段        |                                                  |
| ------------------- | ------------------------------------------------ |
| 字段名稱            | 说明                                             |
| Cache-Control       | 控制缓存的行为                                   |
| Pragma              | http1.0 的旧社会遗留物，值为`no-cache`时禁用缓存 |
|                     |                                                  |
| **请求首部字段**    |                                                  |
| if-Match            | 比较`eTag`是否一致                               |
| if-None-Match       | 比较`eTag`是否不一致                             |
| if-Modified-Since   | 比较资源最后更新的时间是否一致                   |
| if-Unmodified-Since | 比较资源最后更新的时间是否不一致                 |
|                     |                                                  |
| **响应首部字段**    |                                                  |
| ETag                | 资源的匹配信息                                   |
|                     |                                                  |
| **实体首部字段**    |                                                  |
| Expires             | `http1.0` 的遗留物，实体主体过期的时间           |
| Last-Modified       | 资源的最后一次修改的时间                         |

### 缓存机制

浏览器中缓存可分为强缓存和协商缓存，强缓存与协商缓存的

- 共同点是：如果命中，都是从客户端缓存中加载资源，而不是从服务器加载资源数据；
- 区别是：强缓存不发请求到服务器，协商缓存会发请求到服务器。

#### 强缓存：Expires&Cache-Control

**Expires 是 HTTP 1.0 提出的一个表示资源过期时间的 header，它描述的是一个绝对时间，由服务器返回，用 GMT 格式的字符串表示**，如：Expires:Thu, 31 Dec 2037 23:55:55 GMT，包含了 Expires 头标签的文件，就说明浏览器对于该文件缓存具有非常大的控制权。

**Cache-Control，这是一个相对时间，在配置缓存的时候，以秒为单位，用数值表示**,在进行缓存命中的时候，**都是利用客户端时间进行判断**，

**当 response header 中，Expires 和 Cache-Control 同时存在时，Cache-Control 优先级高于 Expires**

可以为 Cache-Control 指定 `public` 或 `private` 标记。**如果使用 private，则表示该资源仅仅属于发出请求的最终用户，这将禁止中间服务器（如代理服务器）缓存此类资源**。**对于 public，则允许所有服务器缓存该资源**。通常情况下，对于所有人都可以访问的资源（例如网站的 logo、图片、脚本等），**Cache-Control 默认设为 public 是合理的**。

#### 协商缓存：Last-Modified&Etag

**协商缓存是利用的是【Last-Modified，If-Modified-Since】和【ETag、If-None-Match】这两对 Header 来管理的**。

**【Last-Modified，If-Modified-Since】的控制缓存的原理，如下**：

1. 浏览器第一次跟服务器请求一个资源，服务器在返回这个资源的同时，**在 response 的 header 加上 Last-Modified 的 header，这个 header 表示这个资源在服务器上的最后修改时间**
2. 浏览器再次跟服务器请求这个资源时，**在 request 的 header 上加上 If-Modified-Since 的 header**，这个 header 的值就是上一次请求时返回的 Last-Modified 的值
3. 服务器再次收到资源请求时，**根据浏览器传过来 If-Modified-Since 和资源在服务器上的最后修改时间判断资源是否有变化**，如果没有变化则返回 304 Not Modified，但是不会返回资源内容；如果有变化，就正常返回资源内容。**当服务器返回 304 Not Modified 的响应时，response header 中不会再添加 Last-Modified 的 header**，因为既然资源没有变化，那么 Last-Modified 也就不会改变，

【Last-Modified，If-Modified-Since】都是根据服务器时间返回的 header，一般来说，**在没有调整服务器时间和篡改客户端缓存的情况下，这两个 header 配合起来管理协商缓存是非常可靠的，但是有时候也会服务器上资源其实有变化，但是最后修改时间却没有变化的情况**，而这种问题又很不容易被定位出来，而当这种情况出现的时候，就会影响协商缓存的可靠性。**所以就有了另外一对 header 来管理协商缓存，这对 header 就是【ETag、If-None-Match】**。它们的缓存管理的方式是：

1. 浏览器第一次跟服务器请求一个资源，**服务器在返回这个资源的同时，在 response 的 header 加上 ETag 的 header**，这个 header 是服务器根据当前请求的资源生成的一个唯一标识，**这个唯一标识是一个字符串，只要资源有变化这个串就不同**，跟最后修改时间没有关系，所以能很好的补充 Last-Modified 的问题
2. 浏览器再次跟服务器请求这个资源时，**在 request 的 header 上加上 If-None-Match 的 header**，这个 header 的值就是上一次请求时返回的 ETag 的值
3. 服务器再次收到资源请求时，**根据浏览器传过来 If-None-Match 和然后再根据资源生成一个新的 ETag**，如果这两个值相同就说明资源没有变化，否则就是有变化；如果没有变化则返回 304 Not Modified，但是不会返回资源内容；如果有变化，就正常返回资源内容。与 Last-Modified 不一样的是，当服务器返回 304 Not Modified 的响应时，**由于 ETag 重新生成过，response header 中还会把这个 ETag 返回**，即使这个 ETag 跟之前的没有变化

【Last-Modified，If-Modified-Since】和【ETag、If-None-Match】一般都是同时启用，这是为了处理 Last-Modified 不可靠的情况。有一种场景需要注意：

> **分布式系统里多台机器间文件的 Last-Modified 必须保持一致，以免负载均衡到不同机器导致比对失败**；
>
> **分布式系统尽量关闭掉 ETag(每台机器生成的 ETag 都会不一样）**；

协商缓存需要配合强缓存使用，上面这个截图中，除了 Last-Modified 这个 header，还有强缓存的相关 header，**因为如果不启用强缓存的话，协商缓存根本没有意义**。

![img](@assets/f285e1d9379a8a9378d273425751279.jpg)

## 网络安全

### XSS 攻击（跨站脚本攻击）

一种代码注入方式，为了与 CSS 区分所以被称为 XSS。早期常见于网络论坛，起因是网站没有对用户的输入行严格的限制，使得攻击者可以将脚本上传到帖子让其他啊人在浏览到有恶意脚本的页面。其注入方式很简单，包括但不限于 JavaScript / VBScript / CSS / Flash 等。XSS 的本质是：恶意代码未经过滤，与网站正常的代码混在一起；浏览器无法分辨哪些脚本是可信的，导致恶意脚本被执行。

以下内容都不可信：

- 来自用户的 UGC 信息
- 来自第三方的链接
- URL 参数
- POST 参数
- Referer （可能来自不可信的来源）
- Cookie （可能来自其他子域注入）

#### 注入的方法

- 在 HTML 中内嵌的文本中，恶意内容以 `script` 标签形成注入。
- 在内联的 JavaScript 中，拼接的数据突破了原本的限制（字符串，变量，方法名等）。
- 在标签属性中，恶意内容包含引号，从而突破属性值的限制，注入其他属性或者标签。
- 在标签的 href、src 等属性中，包含 `javascript:` 等可执行代码。
- 在 onload、onerror、onclick 等事件中，注入不受控制代码。
- 在 style 属性和标签中，包含类似 `background-image:url("javascript:...");` 的代码（新版本浏览器已经可以防范）。
- 在 style 属性和标签中，包含类似 `expression(...)` 的 CSS 表达式代码（新版本浏览器已经可以防范）。

#### XSS 分类

根据攻击的来源，XSS 攻击可分为存储型、反射型和 DOM 型三种。

| 类型       | 存储区                  | 插入点          |
| ---------- | ----------------------- | --------------- |
| 存储型 XSS | 后端数据库              | HTML            |
| 反射型 XSS | URL                     | HTML            |
| DOM 型 XSS | 后端数据库/前端存储/URL | 前端 JavaScript |

- 存储区：恶意代码存放的位置。
- 插入点：由谁取得恶意代码，并插入到网页上。

##### 存储型 XSS

存储型 XSS 的攻击步骤：

1. 攻击者将恶意代码提交到目标网站的数据库中。
2. 用户打开目标网站时，网站服务端将恶意代码从数据库取出，拼接在 HTML 中返回给浏览器。
3. 用户浏览器接收到响应后解析执行，混在其中的恶意代码也被执行。
4. 恶意代码窃取用户数据并发送到攻击者的网站，或者冒充用户的行为，调用目标网站接口执行攻击者指定的操作。

这种攻击常见于带有用户保存数据的网站功能，如论坛发帖、商品评论、用户私信等。

##### 反射型 XSS

反射型 XSS 的攻击步骤：

1. 攻击者构造出特殊的 URL，其中包含恶意代码。
2. 用户打开带有恶意代码的 URL 时，网站服务端将恶意代码从 URL 中取出，拼接在 HTML 中返回给浏览器。
3. 用户浏览器接收到响应后解析执行，混在其中的恶意代码也被执行。
4. 恶意代码窃取用户数据并发送到攻击者的网站，或者冒充用户的行为，调用目标网站接口执行攻击者指定的操作。

反射型 XSS 跟存储型 XSS 的区别是：存储型 XSS 的恶意代码存在数据库里，反射型 XSS 的恶意代码存在 URL 里。

反射型 XSS 漏洞常见于通过 URL 传递参数的功能，如网站搜索、跳转等。

由于需要用户主动打开恶意的 URL 才能生效，攻击者往往会结合多种手段诱导用户点击。

POST 的内容也可以触发反射型 XSS，只不过其触发条件比较苛刻（需要构造表单提交页面，并引导用户点击），所以非常少见。

##### DOM 型 XSS

DOM 型 XSS 的攻击步骤：

1. 攻击者构造出特殊的 URL，其中包含恶意代码。
2. 用户打开带有恶意代码的 URL。
3. 用户浏览器接收到响应后解析执行，前端 JavaScript 取出 URL 中的恶意代码并执行。
4. 恶意代码窃取用户数据并发送到攻击者的网站，或者冒充用户的行为，调用目标网站接口执行攻击者指定的操作。

DOM 型 XSS 跟前两种 XSS 的区别：DOM 型 XSS 攻击中，取出和执行恶意代码由浏览器端完成，属于前端 JavaScript 自身的安全漏洞，而其他两种 XSS 都属于服务端的安全漏洞。

#### 解决方法

- **利用模板引擎** 开启模板引擎自带的 HTML 转义功能。例如： 在 ejs 中，尽量使用 `<%= data %>` 而不是 `<%- data %>`； 在 doT.js 中，尽量使用 `{{! data }` 而不是 `{{= data }`； 在 FreeMarker 中，确保引擎版本高于 2.3.24，并且选择正确的 `freemarker.core.OutputFormat`。
- **避免内联事件** 尽量不要使用 `onLoad="onload('{{data}}')"`、`onClick="go('{{action}}')"` 这种拼接内联事件的写法。在 JavaScript 中通过 `.addEventlistener()` 事件绑定会更安全。
- **避免拼接 HTML** 前端采用拼接 HTML 的方法比较危险，如果框架允许，使用 `createElement`、`setAttribute` 之类的方法实现。或者采用比较成熟的渲染框架，如 Vue/React 等。
- **时刻保持警惕** 在插入位置为 DOM 属性、链接等位置时，要打起精神，严加防范。
- **增加攻击难度，降低攻击后果** 通过 CSP、输入长度配置、接口安全措施等方法，增加攻击的难度，降低攻击的后果。
- **主动检测和发现** 可使用 XSS 攻击字符串和自动扫描工具寻找潜在的 XSS 漏洞。

### CSRF「Cross-site request forgery」

> 跨站请求伪造，冒用 Cookie 中的信息，发起请求攻击。
>
> CSRF（Cross-site request forgery）跨站请求伪造：攻击者诱导受害者进入第三方网站，在第三方网站中，向被攻击网站发送跨站请求。利用受害者在被攻击网站已经获取的注册凭证，绕过后台的用户验证，达到冒充用户对被攻击的网站执行某项操作的目的。

#### 过程

1. 当用户已经登录成功了一个网站
2. 然后通过被诱导进了第三方网站「钓鱼网站」
3. 跳转过去了自动提交表单，冒用受害者信息
4. 后台则正常走逻辑将用户提交的表单信息进行处理

#### 攻击类型

- GET 类型 img 标签 script。
- POST 类型 表单中的 post 请求
- 引诱用户点击 a 标签

#### 必要条件才能触发 CSRF

与 XSS 不同的是，CSRF 攻击不需要将恶意代码注入用户的页面，仅仅是利用服务器的漏洞和用户的登录状态来实施攻击

- 目标站点一定要有 CSRF 漏洞；

  后台接口一定是有问题的，[www.bank.com/withdraw?pa…](https://link.juejin.cn?target=https%3A%2F%2Fwww.bank.com%2Fwithdraw%3Fpay%3D100bitcon%3FuserId%3D1),这样的话攻击者才有机会。

- 用户要登录过目标站点，并且在浏览器上保持有该站点的登录状态；

- 需要用户打开一个第三方站点，可以是黑客的站点，也可以是一些论坛。

#### 防护策略

##### 同源检测

**Origin Header**

在部分与 CSRF 有关的请求中，请求的 Header 中会携带 Origin 字段。字段内包含请求的域名（不包含 path 及 query），如果 Origin 存在，那么直接使用 Origin 中的字段确认来源域名就可以。

但是 Origin 在以下两种情况下并不存在： IE11 同源策略： IE 11 不会在跨站 CORS 请求上添加 Origin 标头，Referer 头将仍然是唯一的标识。最根本原因是因为 IE 11 对同源的定义和其他浏览器有不同，有两个主要的区别，可以参考 MDN Same-origin_policy#IE_Exceptions 302 重定向： 在 302 重定向之后 Origin 不包含在重定向的请求中，因为 Origin 可能会被认为是其他来源的敏感信息。对于 302 重定向的情况来说都是定向到新的服务器上的 URL，因此浏览器不想将 Origin 泄漏到新的服务器上。

**Referer Header**

根据 HTTP 协议，在 HTTP 头中有一个字段叫 Referer，记录了该 HTTP 请求的来源地址。 对于 Ajax 请求，图片和 script 等资源请求，Referer 为发起请求的页面地址。对于页面跳转，Referer 为打开页面历史记录的前一个页面地址。因此我们使用 Referer 中链接的 Origin 部分可以得知请求的来源域名。

因此，服务器的策略是优先判断 Origin，如果请求头中没有包含 Origin 属性，再根据实际情况判断是否使用 Referer 值，从而增加攻击难度。

##### Samesite Cookie

为了从源头上解决这个问题，Google 起草了一份草案来改进 HTTP 协议，那就是为 Set-Cookie 响应头新增 Samesite 属性，它用来标明这个 Cookie 是个“同站 Cookie”，同站 Cookie 只能作为第一方 Cookie，不能作为第三方 Cookie，Samesite 有三个属性值，分别是 Strict 和 Lax，None 下面分别讲解：

**Samesite=Strict**

这种称为严格模式，表明这个 Cookie 在任何情况下都不可能作为第三方 Cookie，绝无例外。比如说 b.com 设置了如下 Cookie：

我们在 a.com 下发起对 b.com 的任意请求，foo 这个 Cookie 都不会被包含在 Cookie 请求头中，但 bar 会。举个实际的例子就是，假如淘宝网站用来识别用户登录与否的 Cookie 被设置成了 Samesite=Strict，那么用户从百度搜索页面甚至天猫页面的链接点击进入淘宝后，淘宝都不会是登录状态，因为淘宝的服务器不会接受到那个 Cookie，其它网站发起的对淘宝的任意请求都不会带上那个 Cookie。

```ini
Set-Cookie: foo=1; Samesite=Strict
Set-Cookie: bar=2; Samesite=Lax
Set-Cookie: baz=3
复制代码
```

**Samesite=Lax** 这种称为宽松模式，比 Strict 放宽了点限制：假如这个请求是这种请求（改变了当前页面或者打开了新页面）且同时是个 GET 请求，则这个 Cookie 可以作为第三方 Cookie。比如说 b.com 设置了如下 Cookie：

```ini
Set-Cookie: foo=1; Samesite=Strict
Set-Cookie: bar=2; Samesite=Lax
Set-Cookie: baz=3
当用户从 a.com 点击链接进入 b.com 时，foo 这个 Cookie 不会被包含在 Cookie 请求头中，但 bar 和 baz 会，也就是说用户在不同网站之间通过链接跳转是不受影响了。但假如这个请求是从 a.com 发起的对 b.com 的异步请求，或者页面跳转是通过表单的 post 提交触发的，则bar也不会发送。
复制代码
```

**我们应该如何使用 SamesiteCookie** 如果 SamesiteCookie 被设置为 Strict，浏览器在任何跨域请求中都不会携带 Cookie，新标签重新打开也不携带，所以说 CSRF 攻击基本没有机会。

而且跳转子域名或者是新标签重新打开刚登陆的网站，之前的 Cookie 都不会存在。尤其是有登录的网站，那么我们新打开一个标签进入，或者跳转到子域名的网站，都需要重新登录。对于用户来讲，可能体验不会很好。

如果 SamesiteCookie 被设置为 Lax，那么其他网站通过页面跳转过来的时候可以使用 Cookie，可以保障外域连接打开页面时用户的登录状态。但相应的，其安全性也比较低。

总之，SamesiteCookie 是一个可能替代同源验证的方案，但是需要合理使用 Strict Lax。

##### Token：存在本地 local strage 中的加密数据

token 是一个比较有效的 CSRF 防护方法，只要页面没有 XSS 漏洞泄露 Token，那么接口的 CSRF 攻击就无法成功，也是现在主流的解决方案。

##### 双重 Cookie 验证

利用 CSRF 攻击不能获取到用户 Cookie 的特点，我们可以要求 Ajax 和表单请求携带一个 Cookie 中的值。

双重 Cookie 采用以下流程： 在用户访问网站页面时，向请求域名注入一个 Cookie，内容为随机字符串（例如 csrfcookie=v8g9e4ksfhw）。 在前端向后端发起请求时，取出 Cookie，并添加到 URL 的参数中（接上例 POST [www.a.com/comment?csr…](https://link.juejin.cn?target=https%3A%2F%2Fwww.a.com%2Fcomment%3Fcsrfcookie%3Dv8g9e4ksfhw)）。 后端接口验证 Cookie 中的字段与 URL 参数中的字段是否一致，不一致则拒绝。

如果用户访问的网站为[www.a.com](https://link.juejin.cn?target=www.a.com)，而后端的 api 域名为 api.a.com。那么在[www.a.com](https://link.juejin.cn?target=www.a.com)下，前端拿不到 api.a.com 的 Cookie，也就无法完成双重 Cookie 认证。 于是这个认证 Cookie 必须被种在 a.com 下，这样每个子域都可以访问。 任何一个子域都可以修改 a.com 下的 Cookie。 某个子域名存在漏洞被 XSS 攻击（例如 upload.a.com）。虽然这个子域下并没有什么值得窃取的信息。但攻击者修改了 a.com 下的 Cookie。 攻击者可以直接使用自己配置的 Cookie，对 XSS 中招的用户再向[www.a.com](https://link.juejin.cn?target=www.a.com)下，发起 CSRF 攻击。

有时候也会造成 xsrf 的攻击，所以并不是一个好的解决方案。

##### 后端接口防止 XSRF 漏洞

- 严格管理所有的上传接口，防止任何预期之外的上传内容（例如 HTML）。
- 添加 Header `X-Content-Type-Options: nosniff` 防止黑客上传 HTML 内容的资源（例如图片）被解析为网页。
- 对于用户上传的图片，进行转存或者校验。不要直接使用用户填写的图片链接。

##### 前端提示

当前用户打开其他用户填写的链接时，需告知风险（知乎跳转外链，等等都会告知风险）。

### 防止 cookie 被窃取？

**1.设置 Cookie 的 HttpOnly 属性为 true。**

一般来说，跨站脚本攻击（XSS）最常见的攻击方式就是通过在交互式网站（例如论坛、微博等）中嵌入 javascript 脚本，当其他用户访问嵌有脚本的网页时，攻击者就能通过 document.cookie 窃取到用户 cookie 信息。如果网站开发者将 cookie 的 httponly 属性设置为 true，那么浏览器客户端就不允许嵌在网页中的 javascript 脚本去读取用户的 cookie 信息。

**2.设置 cookie 的 secure 属性为 true。**

虽然方式 1 能防止攻击者通过 javascript 脚本的方式窃取 cookie，但是没办法防止攻击者通过 fiddler 等抓包工具直接截取请求数据包的方式获取 cookie 信息，这时候设置 secure 属性就显得很重要，当设置了 secure=true 时，那么 cookie 就只能在 https 协议下装载到请求数据包中，在 http 协议下就不会发送给服务器端，https 比 http 更加安全，这样就可以防止 cookie 被加入到 http 协议请求包暴露给抓包工具啦。

**3.设置 cookie 的 samesite 属性为 strict 或 lax。**

前文提到攻击者获取到 cookie 后，还会发起跨站请求伪造（CSRF）攻击，这种攻击方式通常是在第三方网站发起的请求中携带受害者 cookie 信息，而设置了 samesite 为 strict 或 lax 后就能限制第三方 cookie，从而可以防御 CSRF 攻击。当然，当前常用的还有校验 token 和 referer 请求头的方式来防止 CSRF 攻击，感兴趣的读者也可以自己翻阅材料了解下。

**4.设置 cookie 的 expires 属性值。**

通常，cookie 的有效期会被设置为永久有效或一个较长时间的正数值，这样的 cookie 会被保存在本地，攻击者获取 cookie 信息后可以在相当长的一段时间里控制用户账号，而如果给 cookie 设置 expires 值为-1，那么该 cookie 就仅仅保存在客户端内存中，当浏览器客户端被关闭时，cookie 就会失效了。

总结一下，小编上述整理的设置 cookie 的 httponly、secure、samesite、expires 属性值，能够从多角度出发，防止 cookie 被盗取，从而降低了被 XSS 和 CSRF 漏洞利用给用户造成损失的风险。

## promise

### 回调地狱

#### 写一个回调地狱

```javascript
const fn = (str, callback) => {
  setTimeout(() => {
    console.log(str);
    callback(str);
  }, 100);
};

fn("1", () => {
  fn("2", () => {
    fn("3", () => {
      fn("4", () => {
        console.log("done");
      });
    });
  });
});
```

#### 构造 Promise 工厂函数

```javascript
const promiseFactory = (str) => {
  return new Promise((resolve) => {
    fn(str, resolve);
  });
};
```

原理很简单，主要目的就是将 参数和回调进行分离，这也是解决回调地狱的基本原则。通过 promise 工厂函数，接受除了 `callback`意外的所有参数，然后利用 promise 的 resolve 替代原有的 `callback`去调用原函数。这样就完成了一个 promise 工厂函数。

#### 完整代码

```php
const fn = (str, callback) => {
    setTimeout(() => {
        console.log(str)
        callback(str)
    }, 100);
}

// fn('1', () => {
//     fn('2', () => {
//         fn('3', () => {
//             fn('4', () => {
//                 console.log('done')
//             })
//         })
//     })
// })

const promiseFactory = (str) => {
    return new Promise((resolve) => {
        fn(str, resolve)
    })
}

promiseFactory('1')
    .then(() => **promiseFactory**('2'))
    .then(() => promiseFactory('3'))
    .then(() => promiseFactory('4'))
    .then(() => { console.log('done') })
```

## 前端性能优化

优化方向有：

- 缩短请求耗时;
- 减少重排重绘;
- 改善 JS 性能。

### 缩短请求耗时

#### 1. 优化打包资源

总体原则： 减少或延迟模块引用，以减少网络负荷。

常用工具：

- webpack
- webpack-bundle-analyzer 可视化分析工具

常用方法：

- 减小体积：减少非必要的 import;压缩 JS 代码;配置服务器 gzip 等;使用 WebP 图片;
- 按需加载：可根据“路由”、“是否可见”按需加载 JS 代码，减少初次加载 JS 体积。比如可以使用 import()进行代码分割，按需加载;
- 分开打包：利用浏览器缓存机制，依据模块更新频率分层打包。

其他方法：雪碧图：每个 HTTP/1.1 请求都是独立的 TCP 连接，最大 6 个并发，所以合并图片资源可以优化加载速度。HTTP/2 已经不需要这么做了。

#### 2. CDN 加速

总体原则： 通过分布式的边缘网络节点，缩短资源到终端用户的访问延迟。

常用工具：

- Cloudflare
- AWS CloudFront
- Aliyun CDN

常用方法：加速图片、视频等大体积文件

#### 3. 浏览器缓存

总体原则：避免重复传输相同的数据，节省网络带宽，加速资源获取。

常用方法：

可以通过设置 HTTP Header 来控制缓存策略，一般有如下几种。

强缓存：

- Expires：HTTP/1.0
- Cache-Control：HTTP/1.1

协商缓存：

- ETag + If-None-Match
- Last-Modified + If-Modified-Since

拿 ETag 举例，如果浏览器给的 If-None-Match 值与服务端给的 ETag 值相等，服务器就直接返回 304，从而避免重复传输数据。

ETag 示例：

![An image](@assets/412350f376e84110d8649520ee8ab90e6882a8.png)

如果几个配置同时存在，则优先级为：Cache-Control > Expires > ETag > Last-Modified。

#### 4. 更高版本的 HTTP

总体原则：使用高版本 HTTP 提升性能。

常用工具：HTTP/2

HTTP/2 较 HTTP/1.1 最大的改进在于：

- 多路复用：单一 TCP 连接，多 HTTP 请求;
- 头部压缩：减少 HTTP 头体积;
- 请求优先级：优先获取重要的数据;
- 服务端推送：主动推送 CSS 等静态资源。

其他方法：HTTP/3

HTTP/3 基于 UDP，有很多方面的性能改进，如多路复用无队头阻塞，响应更快。感兴趣的同学可参考 Wiki。

#### 5. Web Socket

总体原则：解决 HTTP 协议无法实时通信的问题。

Web Socket 是一条有状态的 TCP 长连接，用于实现实时通信、实时响应。

#### 6. 服务器端渲染(SSR)

总体原则：第一次访问时，服务器端直接返回渲染好的页面。

一般流程：

- 浏览器向 URL 发送请求;
- 服务器端返回“空白”index.html;
- 浏览器不能呈现页面，需要继续下载依赖;
- 加载所有脚本后，组件才能被渲染。

SSR 流程：

- 浏览器向 URL 发送请求;
- 服务器端执行 JS 完成首屏渲染并返回;
- 浏览器直接呈现页面，然后继续下载其他依赖;
- 加载所有脚本后，组件将再次在客户端呈现。它将对现有 View 进行合并。

常用工具：

- Node.js，用于服务器端执行代码，输出 HTML 给浏览器，支持所有主流前端框架
- Next.js，用于服务器端渲染 React 的框架
- gatsby，用 React 生成静态网站的工具

除了可以提升页面用户体验，还能应用于 SEO。

### 减少重排重绘

除了网络资源以外，另一个影响前端性能的因素就是前端页面的渲染绘制效率。

虽然不同的前端框架有一些差异，但整体的优化思路是一致的，这里将以 React 举例。

#### 1. 减少渲染量

总体原则：不渲染未展示的部分。

常用工具：

- react-window
- react-loadable
- JS 原生，如 IntersectionObserver
- 框架提供，如 React.lazy、react-intersection-observer

常用方法：

- 虚拟列表：只渲染可见区;
- 惰性加载：无限滚动;
- 按需加载：页面只在切换过去时才加载。

以虚拟列表举例，以下是使用 react-window 库，仅仅渲染了可见区的数据：

![An image](@assets/e1509c978aeb4d560c1224b3f39b420a634885.gif)

#### 2. 减少渲染次数

总体思路：避免重复的渲染。

常用工具：

- lodash
- JS 或框架自带

常用方法：

- 防抖与节流;
- 对于 React 函数组件来说，合理使用副作用，拆分无关联的副作用;
- 对于 React 类组件来说，可以使用 shouldComponentUpdate 或使用 PureComponent 来优化渲染;
- 利用缓存，如 React.memo;
- 使用 requestAnimationFrame 替代 setInterval 执行动画。

### 改善 JS 性能

因为浏览器是单线程异步模型，长时间的运算会阻塞渲染过程，所以改善复杂运算有助于改善前端的整体性能。

#### 1. 缓存复杂计算

总体思路：避免重复计算。

常用方法：对于 React 函数组件来说，可以使用 useMemo 缓存复杂计算值。

举例如下，memoizedValue 需要经过复杂计算才能得到，此时就可以使用 useMemo 缓存，仅仅在输入参数发生变化时才重新计算，避免计算阻塞页面渲染，从而避免页面卡顿。

复制

```
const MyFunctionalComponent = () => {
 const memoizedValue = useMemo(() => {
   computeExpensiveValue(a, b);
 }, [a, b]);

 return <AComponent value={memoizedValue}/>;
}1.2.3.4.5.6.7.
```

但 useMemo 自身也有性能消耗，需要视情况使用，某些场景可以利用 React 的渲染机制避免性能问题。

#### 2. Web Worker

总体原则：多线程思想。

常用方法：

- Dedicated Workers，处理与 UI 无关的密集型数学计算：大数据集合排序、数据压缩、音视频处理;
- Service Worker，服务端推送，或者 PWA 中配合 CacheStorage 在前端控制缓存资源;
- Shared Worker，Tab 间通信。

JS 语言在设计之初就是单线程异步模型，好处是可以高效处理 I/O 操作，但坏处是无法利用多核 CPU。

Web Worker 会启动系统级别的线程，可进行多线程编程，发挥多核的性能。

#### 3. Web Assembly

总体原则：将复杂的计算逻辑编译为 Web Assembly，避免 JS 类型推断过程中的性能开销，可用于性能的极限优化。

适用范围有限：

曾在网上看到，有人使用自顶向下非优化的斐波那契数列算法来举例，说 Web Assembly 比原生 JS 快一倍，实测之后似乎也没有。

在同一台机器测试，其中求第 48 个值的耗时如下：

- C(Ubuntu+GCC)：18s
- JS(V8)：32s
- Web Assembly(V8+EMCC)：39s

一种可能的猜想是，斐波那契计算中没有大量的类型推断，而且 V8 内部有一些优化机制，使得此处 JS 执行速度快于 Web Assembly。

简而言之，并非所有场景都适用于 Web Assembly。

另一种运用场景是，把不同语言编写的代码(C/C++/Java 等)编译为 Web Assembly，能以接近原生的速度在 Web 中运行，并且与 JS 共存。





## 浏览器从输入网址到页面展示的过程

- URL 输入
- DNS 解析
- 建立 TCP 连接
- 发送 HTTP / HTTPS 请求（建立 TLS 连接）
- 服务器响应请求
- 浏览器解析渲染页面
- HTTP 请求结束，断开 TCP 连接





## APP开发模式

目前市场上主流的APP分为三种：

1. 原生APP
2. Web APP（即HTML5）
3. 混合APP 当然，还有flutter等



###  原生开发

> 原生开发（Native App开发），是在Android、IOS等移动平台上利用官方提供的开发语言、开发类库、开发工具进行App开发。比如Android是利用Java、Eclipse、Android studio；IOS是利用Objective-C 和Xcode进行开发。
>
> 

#### 优点

1. 可访问手机所有功能（如GPS、摄像头等）、可实现功能最齐全；
2. 运行速度快、性能高，绝佳的用户体验；
3. 支持大量图形和动画，不卡顿，反应快；
4. 兼容性高，每个代码都经过程序员精心设计，一般不会出现闪退的情况，还能防止病毒和漏洞的出现；
5. 比较快捷地使用设备端提供的接口，处理速度上有优势。



#### 缺点

1. 开发时间长，快则3个月左右完成，慢则五个月左右；
2. 制作费用高昂，成本较高；
3. 可移植性比较差，一款原生的App，Android和IOS都要各自开发，同样的逻辑、界面要写两套；
4. 内容限制（App Store限制）；
5. 必须等下载完毕用户才可以打开，获得新版本时需重新下载应用更新。
6. 新需求迭代，上线慢。



###  web APP (h5开发)

HTML5应用开发，是利用Web技术进行的App开发，可以在手机端浏览器里面打开的网站就称之为webapp。Web技术本身需要浏览器的支持才能进行展示和用户交互，因此主要用到的技术是HTML、CSS、Javascript以及jQuery、Vue、React等JS框架。

#### 优点

1. 支持设备范围广，可以跨平台，编写的代码可以同时在Android、IOS、Windows上运行；
2. 开发成本低、周期短；
3. 无内容限制；
4. 适合展示有大段文字（如新闻、攻略等），且格式比较丰富（如加粗，字体多样）的页面；
5. 用户可以直接使用最新版本（自动更新，不需用户手动更新）。

#### 缺点

1. 由于Web技术本身的限制，H5移动应用不能直接访问设备硬件和离线存储，所以在体验和性能上有很大的局限性；
2. 对联网要求高，离线不能做任何操作；
3. 功能有限；
4. APP反应速度慢，页面切换流畅性较差；
5. 图片和动画支持性不高；
6. 用户体验感较差；
7. 无法调用手机硬件（摄像头、麦克风等）。





### 混合开发

> 混合开发（Hybrid App开发），是指在开发一款App产品的时候，为了提高效率、节省成本而利用原生与H5的开发技术的混合应用。通俗点来说，这就是网页的模式，通常由“HTML5云网站+APP应用客户端”两部份构成。 混合开发是一种取长补短的开发模式，原生代码部分利用WebView插件或者其它框架为H5提供容器，程序主要的业务实现、界面展示都是利用与H5相关的Web技术进行实现的。比如京东、淘宝、今日头条等APP都是利用混合开发模式而成的。

#### 优点

1. 开发效率高，节约时间。同一套代码Android和IOS基本上都可使用；
2. 更新和部署比较方便，每次升级版本只需要在服务器端升级即可，不再需要上传到App Store进行审核；
3. 代码维护方便、版本更新快，节省产品成本；
4. 比web版实现功能多；
5. 可离线运行。

#### 缺点：

1. 功能/界面无法自定：所有内容都是固定的，不能换界面或增加功能；
2. 加载缓慢/网络要求高：混合APP数据需要全部从服务器调取，每个页面都需要重新下载，因此打开速度慢，网络占用高，缓冲时间长，容易让用户反感；
3. 安全性比较低：代码都是以前的老代码，不能很好地兼容最新手机系统，且安全性较低，网络发展这么快，病毒这么多，如果不实时更新，定期检查，容易产生漏洞，造成直接经济损失；



### 目前混合开发有两种开发模式：

1. 原生主导的开发模式：需要安卓和IOS原生开发人员，整个App既有原生开发的页面，也有H5页面，在需要H5页面时由原生开发工程师实现内嵌，笔者最近正在开发的项目就使用这种开发模式。
2. H5主导的开发模式：只需要H5开发工程师，借助一些封装好的工具实现应用的打包与调用原生设备的功能，如HBuilder的云端打包功能。





## CSS3动画

`css`实现动画的方式，有如下几种：

- transition 实现渐变动画
- transform 转变动画
- animation 实现自定义动画





### transition 实现渐变动画

`transition`的属性如下：

- property:填写需要变化的css属性
- duration:完成过渡效果需要的时间单位(s或者ms)
- timing-function:完成效果的速度曲线
- delay: 动画效果的延迟触发时间

其中`timing-function`的值有如下：

| 值                            | 描述                                                         |
| ----------------------------- | ------------------------------------------------------------ |
| linear                        | 匀速（等于 cubic-bezier(0,0,1,1)）                           |
| ease                          | 从慢到快再到慢（cubic-bezier(0.25,0.1,0.25,1)）              |
| ease-in                       | 慢慢变快（等于 cubic-bezier(0.42,0,1,1)）                    |
| ease-out                      | 慢慢变慢（等于 cubic-bezier(0,0,0.58,1)）                    |
| ease-in-out                   | 先变快再到慢（等于 cubic-bezier(0.42,0,0.58,1)），渐显渐隐效果 |
| cubic-bezier(*n*,*n*,*n*,*n*) | 在 cubic-bezier 函数中定义自己的值。可能的值是 0 至 1 之间的数值 |

注意：并不是所有的属性都能使用过渡的，如`display:none<->display:block`

举个例子，实现鼠标移动上去发生变化动画效果

```html
    <style>
      .base {
        width: 100px;
        height: 100px;
        display: inline-block;
        background-color: #0ea9ff;
        border-width: 5px;
        border-style: solid;
        border-color: #5daf34;
        transition-property: width, height, background-color, border-width;
        transition-duration: 2s;
        transition-timing-function: ease-in;
        transition-delay: 500ms;
      }

      /*简写*/
      /*transition: all 2s ease-in 500ms;*/
      .base:hover {
        width: 200px;
        height: 200px;
        background-color: #5daf34;
        border-width: 10px;
        border-color: #3a8ee6;
      }
    </style>
    <div class="base"></div>
```



### transform 转变动画

包含四个常用的功能：

- translate：位移
- scale：缩放
- rotate：旋转
- skew：倾斜



> 一般配合`transition`过度使用
>
> 注意的是，`transform`不支持`inline`元素，使用前把它变成`block`





```
<style>
    .base {
        width: 100px;
        height: 100px;
        display: inline-block;
        background-color: #0EA9FF;
        border-width: 5px;
        border-style: solid;
        border-color: #5daf34;
        transition-property: width, height, background-color, border-width;
        transition-duration: 2s;
        transition-timing-function: ease-in;
        transition-delay: 500ms;
    }
    .base2 {
        transform: none;
        transition-property: transform;
        transition-delay: 5ms;
    }

    .base2:hover {
        transform: scale(0.8, 1.5) rotate(35deg) skew(5deg) translate(15px, 25px);
    }
</style>
 <div class="base base2"></div>
```

可以看到盒子发生了旋转，倾斜，平移，放大



### animation 实现自定义动画

`animation`是由 8 个属性的简写，分别如下：

| 属性                                   | 描述                                                         | 属性值                                        |
| -------------------------------------- | ------------------------------------------------------------ | --------------------------------------------- |
| animation-duration                     | 指定动画完成一个周期所需要时间，单位秒（s）或毫秒（ms），默认是 0 |                                               |
| animation-timing-function              | 指定动画计时函数，即动画的速度曲线，默认是 "ease"            | linear、ease、ease-in、ease-out、ease-in-out  |
| animation-delay                        | 指定动画延迟时间，即动画何时开始，默认是 0                   |                                               |
| animation-iteration-count              | 指定动画播放的次数，默认是 1                                 |                                               |
| animation-direction 指定动画播放的方向 | 默认是 normal                                                | normal、reverse、alternate、alternate-reverse |
| animation-fill-mode                    | 指定动画填充模式。默认是 none                                | forwards、backwards、both                     |
| animation-play-state                   | 指定动画播放状态，正在运行或暂停。默认是 running             | running、pauser                               |
| animation-name                         | 指定 [@Keyframes](https://github.com/Keyframes) 动画的名称   |                                               |

`CSS` 动画只需要定义一些关键的帧，而其余的帧，浏览器会根据计时函数插值计算出来，

通过 `@keyframes` 来定义关键帧

因此，如果我们想要让元素旋转一圈，只需要定义开始和结束两帧即可：

```
@keyframes rotate{
    from{
        transform: rotate(0deg);
    }
    to{
        transform: rotate(360deg);
    }
}
```

`from` 表示最开始的那一帧，`to` 表示结束时的那一帧

也可以使用百分比刻画生命周期

```
@keyframes rotate{
    0%{
        transform: rotate(0deg);
    }
    50%{
        transform: rotate(180deg);
    }
    100%{
        transform: rotate(360deg);
    }
}
```

定义好了关键帧后，下来就可以直接用它了：

```
animation: rotate 2s;
```







## Flex

设为 Flex 布局以后，子元素的`float`、`clear`和`vertical-align`属性将失效。



以下6个属性设置在容器上。

```css
 		/* 决定主轴的方向 */
        flex-direction: row | row-reverse | column | column-reverse;
        /* 换行方式 */
        flex-wrap: nowrap | wrap | wrap-reverse;
        /* flex-flow属性是flex-direction属性和flex-wrap属性的简写形式，默认值为row nowrap。 */
        flex-flow:  <flex-direction> || <flex-wrap>;
        /* 项目在主轴上的对齐方式 */
        justify-content: flex-start | flex-end | center | space-between |
          space-around;
        /* 在交叉轴上如何对齐。 
        baseline: 项目的第一行文字的基线对齐。
        stretch（默认值）：如果项目未设置高度或设为auto，将占满整个容器的高度。*/
        align-items: flex-start | flex-end | center | baseline | stretch;
        align-content: flex-start | flex-end | center | space-between |
          space-around | stretch;
```





以下6个属性设置在项目上。

```css
        /* order属性定义项目的排列顺序。数值越小，排列越靠前，默认为0。 */
        order: <integer>;
        /* flex-grow属性定义项目的放大比例，默认为0，即如果存在剩余空间，也不放大。 */
        flex-grow: <number>; /* default 0 */
        /* flex-shrink属性定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小。 负值对该属性无效。 */
        flex-shrink: <number>; /* default 1 */
        /* flex-basis属性定义了在分配多余空间之前，项目占据的主轴空间（main size）。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为auto，即项目的本来大小。 */
        flex-basis: <length> | auto; /* default auto */
        /* flex属性是flex-grow, flex-shrink 和 flex-basis的简写，默认值为0 1 auto。后两个属性可选。 */
        /* 该属性有两个快捷值：auto (1 1 auto) 和 none (0 0 auto)。 */
        flex: none | [ < "flex-grow" > < "flex-shrink" >? || < "flex-basis" > ];
        /* align-self属性允许单个项目有与其他项目不一样的对齐方式，可覆盖align-items属性。默认值为auto，表示继承父元素的align-items属性，如果没有父元素，则等同于stretch。 */
        align-self: auto | flex-start | flex-end | center | baseline | stretch;
```





## px、em、rem区别介



### PX

px像素（Pixel）。相对长度单位。像素px是相对于显示器屏幕分辨率而言的。

**PX特点**

- IE无法调整那些使用px作为单位的字体大小；
- 国外的大部分网站能够调整的原因在于其使用了em或rem作为字体单位；
- Firefox能够调整px和em，rem，但是96%以上的中国网民使用IE浏览器(或内核)。



### EM

em是相对长度单位。相对于当前对象内文本的字体尺寸。如当前对行内文本的字体尺寸未被人为设置，则相对于浏览器的默认字体尺寸。

**EM特点**

- em的值并不是固定的；
- em会继承父级元素的字体大小。

> **注意：**任意浏览器的默认字体高都是16px。所有未经调整的浏览器都符合: 1em=16px。那么12px=0.75em,10px=0.625em。为了简化font-size的换算，需要在css中的body选择器中声明Font-size=62.5%，这就使em值变为 16px*62.5%=10px, 这样12px=1.2em, 10px=1em, 也就是说只需要将你的原来的px数值除以10，然后换上em作为单位就行了。
>
> 所以我们在写CSS的时候，需要注意两点：
>
> - body选择器中声明Font-size=62.5%；
> - 将你的原来的px数值除以10，然后换上em作为单位；
> - 重新计算那些被放大的字体的em数值。避免字体大小的重复声明。
>
> 也就是避免1.2 * 1.2= 1.44的现象。比如说你在#content中声明了字体大小为1.2em，那么在声明p的字体大小时就只能是1em，而不是1.2em, 因为此em非彼em，它因继承#content的字体高而变为了1em=12px。



### REM

rem是CSS3新增的一个相对单位（root em，根em），这个单位引起了广泛关注。这个单位与em有什么区别呢？区别在于使用rem为元素设定字体大小时，仍然是相对大小，但相对的只是HTML根元素。这个单位可谓集相对大小和绝对大小的优点于一身，通过它既可以做到只修改根元素就成比例地调整所有字体大小，又可以避免字体大小逐层复合的连锁反应。目前，除了IE8及更早版本外，所有浏览器均已支持rem。对于不支持它的浏览器，应对方法也很简单，就是多写一个绝对单位的声明。这些浏览器会忽略用rem设定的字体大小。下面就是一个例子：

```
p {font-size:14px; font-size:.875rem;}
```

> **注意：** 选择使用什么字体单位主要由你的项目来决定，如果你的用户群都使用最新版的浏览器，那推荐使用rem，如果要考虑兼容性，那就使用px,或者两者同时使用。



### px 与 rem 的选择？

对于只需要适配少部分手机设备，且分辨率对页面影响不大的，使用px即可 。

对于需要适配各种移动设备，使用rem，例如只需要适配iPhone和iPad等分辨率差别比较挺大的设备。





## SCSS — 缩减50%的样式代码

https://juejin.cn/post/6844903766483795976#heading-4







## 单点登录
