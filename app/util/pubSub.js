const handlers = {};

export function pub(event, ...args) {
	if (handlers[event]) {
		handlers[event].forEach(handler => handler(...args));
	}
}

export function on(event, handler) {
	handlers[event] = handlers[event] || [];
	handlers[event].push(handler);
}

export function off(handler) {
	let index;
	for (let i in handlers) {
		index = handlers[i].indexOf(handler);
		if (index >= 0) {
			handlers[i].splice(index, 1);
			if (!handlers[i].length) {
				delete handlers[i];
			}
		}
	}
}
