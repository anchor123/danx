/**
 * 提供动画帧的基本支持
 */

export const requestAnimationFrame: any =
	window.requestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	function (fn: Function) {
		return setTimeout(fn, 1000 / 60);
	};

export const cancelAnimationFrame =
	window.cancelAnimationFrame ||
	window.mozCancelAnimationFrame ||
	window.webkitCancelAnimationFrame ||
	window.msCancelAnimationFrame ||
	window.clearTimeout;

export class AnimattionFrame {
	// 上一次请求的原生动画id
	frameRequestId: any;

	// 等待执行的帧动作的集合，这些帧的方法将在下个原生动画帧同步执行
	pendingFrames: Frame[] = [];

	pushFrames(frame: Frame) {
		if (this.pendingFrames.push(frame)) {
			this.frameRequestId = requestAnimationFrame(
				this.executePendingFrames.bind(this)
			);
		}
	}

	/**
	 * 执行等待中的动画
	 */
	executePendingFrames() {
		const frames = this.pendingFrames;
		this.pendingFrames = [];
		while (frames.length) {
			this.executeFrame(frames.shift()!);
		}
		this.frameRequestId = 0;
	}
	/**
	 * 请求一个帧，执行指定的动作。动作回调提供一些有用的信息
	 * @param action
	 * @returns
	 */
	requestFrame(action: Function) {
		const frame = this.initFrame(action);
		this.pushFrames(frame);
		return frame;
	}

	/**
	 * 释放一个已经请求过的帧，如果该帧在等待集合里，将移除，下个动画帧不会执行释放的帧
	 * @param frame
	 */
	releaseFrame(frame?: Frame) {
		if (!frame) return;
		const index = this.pendingFrames.indexOf(frame);
		if (~index) {
			this.pendingFrames.splice(index, 1);
		}
		if (this.pendingFrames.length === 0) {
			cancelAnimationFrame(this.frameRequestId);
		}
	}

	/**
	 * 初始化一个帧
	 * @param action
	 * @returns
	 */
	initFrame(action: Function) {
		const frame: Frame = {
			index: 0,
			dur: 0,
			time: +new Date(),
			elapsed: 0,
			action: action,
			next: () => {
				this.pushFrames(frame);
			},
		};
		return frame;
	}

	/**
	 * 开始执行一个帧
	 * @param frame
	 */
	executeFrame(frame: Frame) {
		// 当前帧时间戳
		const time = +new Date();

		// 上一帧到当前帧经过的时间
		let dur = time - frame.time;

		//
		// http://stackoverflow.com/questions/13133434/requestanimationframe-detect-stop
		// 浏览器最小化或切换标签，requestAnimationFrame 不会执行。
		// 检测时间超过 200 ms（频率小于 5Hz ） 判定为计时器暂停，重置为一帧长度
		//
		if (dur > 200) {
			dur = 1000 / 60;
		}

		frame.dur = dur;
		frame.elapsed += dur;
		frame.time = time;
		frame.action.call(null, frame);
		frame.index++;
	}
}
