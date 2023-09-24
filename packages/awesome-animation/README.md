## JS 动画编制/执行工具

### 安装

```
npm install awesome-animation
```

### 基本用法

```js
import { Animator } from "awesome-animation";

const target = document.querySelector(".target");

const animator = new Animator({
	beginValue: -15,
	finishValue: 185,
	setter(target, value) {
		target.style.left = value + "px";
	},
});

animator.start(target, {
	duration: 1000, // ms
	easing: "ease",
	delay: 0,
});
```

![image](./images/basic.gif)

### 使用对象

```js
import { Animator } from "awesome-animation";

const target = document.querySelector(".target");

const animator = new Animator({
	beginValue: { x: -15, y: -15 },
	finishValue: { x: 185, y: 185 },
	setter(target, value) {
		target.style.left = value.x + "px";
		target.style.top = value.y + "px";
	},
});

animator.start(target, {
	duration: 1000, // ms
	easing: "ease",
	delay: 0,
});
```

![image](./images/use-object.gif)

### 加入多段子动画

```js
import { Animator } from "awesome-animation";

const target = document.querySelector(".target");

const animator = new Animator({
	beginValue: { x: -15, y: -15 },
	finishValue: { x: 185, y: 185 },
	setter(target, value) {
		target.style.left = value.x + "px";
		target.style.top = value.y + "px";
	},
});

animator
	.pipe({
		beginValue: -15,
		finishValue: 185,
		setter(target, value) {
			target.style.top = value + "px";
		},
	})
	.pipe({
		beginValue: 185,
		finishValue: -15,
		setter(target, value) {
			target.style.left = value + "px";
		},
	})
	.pipe({
		beginValue: 185,
		finishValue: -15,
		setter(target, value) {
			target.style.top = value + "px";
		},
	});

animator.start(target, {
	duration: 3000, // ms
	easing: "ease",
	delay: 0,
});
```

![image](./images/multiple.gif)

### 重复播放

```js
import { Animator } from "awesome-animation";

const target = document.querySelector(".target");

const timeline = new Animator({
	beginValue: 0,
	finishValue: 100,
	setter(target, value) {
		target.style.left = value + "px";
	},
});

timeline
	.start(target, {
		duration: 3000, // ms
		easing: "ease",
		delay: 0,
	})
	.repeat(2, true); // 重复播放两次，第二个参数代表是否回滚播放
```
