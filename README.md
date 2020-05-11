## 开始

### 安装

```shell
npm install mobileviewer
```

### 或者下载源码在浏览器直接引入:

```html
<script src="/path/to/mobileviewer.js"></script>
```
### 使用方式:
#### 方式1

#### 例子

```html
// THE FIRST：

<div>
  <img id="imageWrap" src="pic.jpg" alt="pic">
</div>

// THE SECOND：

<div>
  <ul id="imageWrap">
    <li><img src="pic1.jpg" alt="pic1"></li>
    <li><img src="pic2.jpg" alt="pic2"></li>
    <li><img src="pic3.jpg" alt="pic3"></li>
  </ul>
</div>
```

```js
import mobileviewer from 'mobileviewer';

// THE FIRST：
var mobileView = mobileviewer.init(document.getElementById('imageWrap'));

// THE SECOND
var mobileViewList = mobileviewer.init(document.getElementById('imageWrap'));
// Then, show one image by click it, it will auto show the image`.
```

#### 方式2
```js
mobileviewer.previewImage({
  current: '', // 当前显示图片的http链接
  urls: [] // 需要预览的图片http链接列表
});
```