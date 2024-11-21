class Ref<T> {
	private listeners: Record<number, (value: T) => any> = {};
	private uid = 0;

	constructor(private _value: T) {}

	get value() {
		return this._value;
	}

	set value(value: T) {
		if (this._value === value) {
			return;
		}
		this._value = value;
		this.emit();
	}

	effect(listener: (value: T) => any) {
		const id = this.uid++;
		this.listeners[id] = listener;
		return () => {
			delete this.listeners[id];
		};
	}

	private emit() {
		Object.values(this.listeners).forEach((listener) => {
			listener(this.value);
		});
	}
}

export type { Ref };

export default function ref<T>(value: T): Ref<T> {
	return new Ref<T>(value);
}
