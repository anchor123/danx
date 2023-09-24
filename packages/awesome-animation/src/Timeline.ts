import Animator from "./Animator";
import { AnimattionFrame } from "./AnimationFrame";
import { getDelta, getPercentValue } from "./utils/index";

/**
 * 动画时间线类
 */
export default class Timeline {
	time: number; // 当前时间
	frame?: Frame; // 当前帧
	lastValue?: number; // 上一个值
	currentValue: any; // 当前值
	setter: Setter; // 值设置函数
	animator: Animator; // 动画执行器
	target: any; // 目标对象
	duration: number; // 持续时间
	easing: Easing; // 缓动函数
	beginValue: number | object | Function; // 起始值
	finishValue: number | object | Function; // 结束值
	rollbacking: boolean = false; // 是否正在逆放
	repeatOption: number | boolean = 1; // 重复选项
	rollback?: boolean = false; // 是否来回播放
	status: "ready" | "playing" | "stoped" | "paused" | "finished"; // 当前状态
	animationFrame: AnimattionFrame;

	constructor(
		animator: Animator,
		target: any,
		duration: number,
		easing: Easing
	) {
		this.animator = animator;
		this.target = target;
		this.duration = this._getDuration(animator.animations, duration);
		this.easing = easing;
		this.time = 0;
		this.beginValue = animator.beginValue;
		this.finishValue = animator.finishValue;
		this.setter = animator.setter;
		this.status = "ready";
		this.animationFrame = new AnimattionFrame();
	}

	/**
	 * 获取动画时长，如果有多个连续动画，取平均值
	 * @param pipeValues
	 * @param duration
	 * @returns
	 */
	_getDuration(pipeValues: any[], duration: number) {
		const len = !this.rollback ? pipeValues.length : pipeValues.length * 2;
		return duration / len;
	}

	/**
	 * 让时间线进入下一帧
	 * @param frame
	 */
	private nextFrame(frame: Frame) {
		if (this.status !== "playing") return;

		this.time += frame.dur;

		this.setValue(this.getValue());

		if (this.time >= this.duration) {
			this.timeUp();
		}

		frame.next();
	}

	/**
	 * 把值通过动画器的 setter 设置到目标上
	 * @param value
	 */
	private setValue(value: any) {
		this.lastValue = this.currentValue;
		this.currentValue = value;
		this.setter.call(this.target, this.target, value, this);
	}

	/**
	 * 设置默认值
	 */
	private initValues() {
		this.time = 0;
		if (typeof this.beginValue === "function") {
			this.beginValue = this.beginValue.call(this.target, this.target);
		}
		if (typeof this.finishValue === "function") {
			this.finishValue = this.finishValue.call(this.target, this.target);
		}
	}

	/**
	 * 获取当前播放时间对应的值
	 * @returns
	 */
	getValue() {
		const b = this.beginValue as number;
		const f = this.finishValue as number;
		const p = this.getValueProportion();

		return getPercentValue(b, f, p);
	}

	/**
	 * 返回当前值和上一帧的值的差值
	 * @returns
	 */
	getDelta() {
		this.lastValue =
			this.lastValue === undefined
				? (this.beginValue as number)
				: this.lastValue;
		return getDelta(this.currentValue, this.lastValue);
	}

	/**
	 * 获取当前播放时间
	 * @returns
	 */
	getPlayTime() {
		return this.rollbacking ? this.duration - this.time : this.time;
	}

	/**
	 * 获得当前播放时间对应值的比例，取值区间为 [0, 1]；该值实际上是时间比例值经过缓动函数计算之后的值。
	 * @returns
	 */
	getValueProportion() {
		return this.easing(this.getPlayTime(), 0, 1, this.duration);
	}

	/**
	 * 设置时间线的重复选项
	 * @param repeat  是否重复播放，设置为 true 无限循环播放，设置数值则循环指定的次数
	 * @param rollback 指示是否要回滚播放。如果设置为真，则一个来回算一次循环次数，否则播放完成一次算一次循环次数
	 */
	repeat(repeat: number | boolean, rollback?: boolean) {
		this.repeatOption = repeat;
		this.rollback = rollback;
		return this;
	}

	/**
	 * 循环次数递减
	 */
	private decreaseRepeat() {
		if (typeof this.repeatOption === "number" && this.repeatOption > 0) {
			this.repeatOption--;
		}
	}

	/**
	 * 播放
	 */
	play() {
		const lastStatus = this.status;
		this.status = "playing";

		switch (lastStatus) {
			case "ready":
				this.initValues();
				this.setValue(this.beginValue);
				this.frame = this.animationFrame.requestFrame(
					this.nextFrame.bind(this)
				);
				this.animator.next(this.rollback);
				break;
			case "finished":
			case "stoped":
				this.initValues();
				this.frame = this.animationFrame.requestFrame(
					this.nextFrame.bind(this)
				);
				break;
			case "paused":
				this.frame?.next();
		}
		return this;
	}

	/**
	 * 暂停播放
	 */
	pause() {
		this.status = "paused";

		this.animationFrame.releaseFrame(this.frame);

		return this;
	}

	/**
	 * 停止播放
	 */
	stop() {
		this.status = "stoped";
		this.setValue(this.finishValue);
		this.rollbacking = false;

		this.animationFrame.releaseFrame(this.frame);
		return this;
	}
	/**
	 * 播放结束之后的处理
	 */
	private timeUp() {
		if (this.repeatOption) {
			const { animation, newCycle, rollbacking } = this.nextAnimation();
			if (newCycle) {
				this.decreaseRepeat();
				this.rollbacking = rollbacking;
			}
			if (this.repeatOption && animation) {
				this.loadAnimation(animation, rollbacking);
			} else {
				this.finish();
			}
		} else {
			this.finish();
		}
	}

	/**
	 * 完成播放
	 */
	private finish() {
		this.setValue(this.finishValue);
		this.status = "finished";
		this.animationFrame.releaseFrame(this.frame);
	}

	/**
	 * 获取下一个动画
	 */
	nextAnimation() {
		return this.animator.next(this.rollback);
	}

	/**
	 * 加载子动画
	 * @param animation
	 * @param {boolean} rollbacking 是否回滚
	 */
	loadAnimation(animation: AnimationOptions, rollbacking?: boolean) {
		this.beginValue = rollbacking
			? animation.finishValue
			: animation.beginValue;
		this.finishValue = rollbacking
			? animation.beginValue
			: animation.finishValue;
		this.setter = animation.setter;
		this.initValues();
	}
}
