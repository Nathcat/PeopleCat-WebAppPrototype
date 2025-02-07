import { persist } from "$lib/util.svelte";

namespace Settings {
	export const spacing = persist<number>("settings.spacing", 0);
	export const notification = persist<"none" | "browser" | "push">(
		"settings.notification",
		"none",
	);
}

export default Settings;
