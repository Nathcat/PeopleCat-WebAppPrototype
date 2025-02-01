const save = (key: string, value: any) => localStorage.setItem(key, JSON.stringify(value));
function load(key: string, initial: any) {
	const stored = localStorage.getItem(key);
	return stored === null ? initial : JSON.parse(stored);
}

export class ApplicationSettings {
	notification = $state<"none" | "browser" | "push">("none");
	margin = $state<number>(0);

	public persist() {
		this.notification = load("settings.notification", this.notification);
		$effect(() => save("settings.notification", this.notification));

		this.margin = load("settings.margin", this.margin);
		$effect(() => save("settings.margin", this.margin));
	}
}
