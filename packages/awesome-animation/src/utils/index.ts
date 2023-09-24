export const parallel = (v1: any, v2: any, fn: Function) => {
	let result: any;
	if (Array.isArray(v1)) {
		result = [];
		for (let i = 0; i < v1.length; i++) {
			result.push(parallel(v1[i], v2[i], fn));
		}
		return result;
	}

	if (typeof v1 === "object") {
		result = {};
		for (let name in v1) {
			if (v1.hasOwnProperty(name) && v2.hasOwnProperty(name)) {
				result[name] = parallel(v1[name], v2[name], fn);
			}
		}

		return result;
	}

	return fn(v1, v2);
};

export const getPercentValue = (b: any, f: any, p: number) => {
	return parallel(b, f, (b: number, f: number) => b + (f - b) * p);
};

export const getDelta = (v1: any, v2: any) => {
	return parallel(v1, v2, function (v1: number, v2: number) {
		return v2 - v1;
	});
};

export const parseTime = (val: string | number) => {
	if (!val) return 0;
	const str = `${val}`;
	const value = parseFloat(str);
	if (/ms/.test(str)) {
		return value;
	}
	if (/s/.test(str)) {
		return value * 1000;
	}
	if (/min/.test(str)) {
		return value * 60 * 1000;
	}
	return value;
};
