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
	for (let i in handlers) {
		handlers[i].splice(handlers[i].findIndex(handler), 1);
		if (!handlers[i].length) {
			delete handlers[i];
		}
	}
}
