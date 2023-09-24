import Timeline from "./Timeline";
import { parseTime } from "./utils/index";
import easingTable from "./easing.js";

/**
 * 动画基本类
 */
export default class Animator {
	beginValue: Function | object | number;
	finishValue: Function | object | number;
	setter: Setter;
	currentAnimationIndex = 0;
	rollbacking = false;
	animations: AnimationOptions[];

	constructor(options: {
		beginValue: Function | object | number;
		finishValue: Function | object | number;
		setter: Setter;
		animations?: AnimationOptions[];
	}) {
		this.beginValue = options.beginValue;
		this.finishValue = options.finishValue;
		this.setter = options.setter;
		this.animations = options.animations || [];
		this.animations.push({
			beginValue: this.beginValue,
			finishValue: this.finishValue,
			setter: this.setter,
		});
	}

	static DEFAULT_DURATION = 300;
	static DEFAULT_EASING = "ease";

	/**
	 * 使用当前的动画器启动在指定目标上启动动画
	 * @param target
	 * @param options
	 * @returns Timeline
	 */
	start(
		target: any,
		options: {
			duration: number | string;
			easing: EasingType | Easing;
			delay: number | string;
		} = {
			duration: 3000,
			easing: "ease",
			delay: 0,
		}
	) {
		const timeline = this.create(target, options.duration, options.easing);
		const delay = parseTime(options.delay);
		if (delay > 0) {
			setTimeout(() => {
				timeline.play();
			}, delay);
		} else {
			timeline.play();
		}
		return timeline;
	}

	pipe(options: {
		beginValue: Function | number;
		finishValue: Function | number;
		setter: Setter;
	}) {
		this.animations.push(options);
		return this;
	}

	/**
	 * 使用当前的动画器为指定目标创建时间线
	 * @param target
	 * @param duration
	 * @param easing
	 * @returns Timeline
	 */
	create(target: any, duration: number | string, easing: string | Easing) {
		duration = parseTime(duration) || Animator.DEFAULT_DURATION;
		easing = easing || Animator.DEFAULT_EASING;
		if (typeof easing === "string") {
			easing = easingTable[easing] as Easing;
		}
		const timeline = new Timeline(this, target, duration, easing);
		return timeline;
	}

	/**
	 * 创建一个与当前动画器相反的动画器
	 * @returns Animator
	 */
	reverse() {
		return new Animator({
			beginValue: this.finishValue,
			finishValue: this.beginValue,
			setter: this.setter,
		});
	}

	/**
	 * 获取下一个子动画
	 * @param {boolean} rollback 是否需要回滚播放
	 * @returns
	 */
	next(rollback?: boolean): {
		animation: AnimationOptions;
		newCycle: boolean; // 是否开启新循环
		rollbacking: boolean; //  是否回滚播放
	} {
		const total = this.animations.length;
		let newCycle = false;
		if (!rollback) {
			this.rollbacking = false;
			if (this.currentAnimationIndex > total - 1) {
				this.currentAnimationIndex = 0;
				newCycle = true;
			}
		} else {
			// 回滚播放
			if (this.currentAnimationIndex < 0) {
				this.currentAnimationIndex = 0;
				this.rollbacking = false;
				newCycle = true;
			}
			if (this.currentAnimationIndex > total - 1) {
				this.currentAnimationIndex = total - 1;
				this.rollbacking = true;
			}
		}
		const animation = this.animations[this.currentAnimationIndex];
		if (!this.rollbacking) {
			this.currentAnimationIndex++;
		} else {
			this.currentAnimationIndex--;
		}
		return {
			animation,
			newCycle,
			rollbacking: this.rollbacking,
		};
	}
}
