declare type Easing = (
	currentValue: number,
	beginValue: number,
	finishValue: number,
	duration: number
) => number;

declare type EasingType =
	| "linear"
	| "swing"
	| "ease"
	| "easeInQuad"
	| "easeOutQuad"
	| "easeInOutQuad"
	| "easeInCubic"
	| "easeOutCubic"
	| "easeInOutCubic"
	| "easeInQuart"
	| "easeOutQuart"
	| "easeInOutQuart"
	| "easeInQuint"
	| "easeOutQuint"
	| "easeInOutQuint"
	| "easeInSine"
	| "easeOutSine"
	| "easeInOutSine"
	| "easeInExpo"
	| "easeOutExpo"
	| "easeInOutExpo"
	| "easeInCirc"
	| "easeOutCirc"
	| "easeInOutCirc"
	| "easeInElastic"
	| "easeOutElastic"
	| "easeInOutElastic"
	| "easeInBack"
	| "easeOutBack"
	| "easeInOutBack"
	| "easeInBounce"
	| "easeOutBounce"
	| "easeInOutBounce";

declare type Setter = (target: any, value: any, timeline: Timeline) => void;
declare type Frame = {
	index: number;
	dur: number;
	time: number;
	elapsed: number;
	action: Function;
	next: Function;
};

declare type AnimationOptions = {
	beginValue: Function | number | object;
	finishValue: Function | number | object;
	setter: Setter;
};
