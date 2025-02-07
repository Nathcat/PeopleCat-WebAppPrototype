<script lang="ts">
	import { helpers, type ToastData, type ToastType } from "./Toaster.svelte";
	import { melt, type Toast, type ToastsElements } from "@melt-ui/svelte";
	import { animationFrame, hammer } from "$lib/util.svelte";
	import { fly } from "svelte/transition";
	import Fa from "svelte-fa";
	import {
		faCircleCheck,
		faCircleInfo,
		faTriangleExclamation,
		faXmark,
		type IconDefinition,
	} from "@fortawesome/free-solid-svg-icons";

	const ICONS: Record<ToastType, IconDefinition> = {
		error: faTriangleExclamation,
		info: faCircleInfo,
		ok: faCircleCheck,
	};

	let { toast, content, title, close }: Props = $props();
	type Props = {
		toast: Toast<ToastData>;
	} & ToastsElements<ToastData>;

	let icon = $derived(ICONS[toast.data.type]);

	let dragging = false;
	let x = $state(0);

	function gestures(hammer: HammerManager) {
		hammer.add(new Hammer.Swipe({ direction: Hammer.DIRECTION_RIGHT }));
		hammer.on("swipe", (e) => {
			if (e.pointerType === "touch") helpers.removeToast(toast.id);
		});

		hammer.add(new Hammer.Pan({ direction: Hammer.DIRECTION_HORIZONTAL }));
		hammer.on("pan", (e) => {
			if (e.pointerType !== "touch") return;
			x = -e.deltaX;

			if (e.isFinal) {
				if (x < -100) helpers.removeToast(toast.id);
				dragging = false;
			} else dragging = true;
		});
	}

	animationFrame(() => {
		if (dragging) return;
		x -= x / 4;
	});
</script>

<div
	out:fly={{ duration: 250, x: "100%" }}
	in:fly={{ duration: 250, x: "100%" }}
	use:melt={$content(toast.id)}
	class="toast no-swipe"
	use:hammer={gestures}
	style:right="{x}px"
>
	<h4 style="color: var(--theme-toast-{toast.data.type})">
		<Fa {icon} />
		<span use:melt={$title(toast.id)}>{toast.data.title}</span>
		<button class="close" use:melt={$close(toast.id)} aria-label="close notification">
			<Fa icon={faXmark} />
		</button>
	</h4>
	<p>{toast.data.description}</p>
</div>

<style lang="scss">
	.toast {
		box-shadow: 2px 2px 5px #00000080;
		background-color: var(--theme-toast-background);
		border-radius: 5px;
		position: relative;
		overflow: hidden;
		min-width: 300px;
		margin-top: 5px;
		padding: 10px;
	}

	p {
		margin-bottom: 0;
		margin-top: 5px;
	}

	.close {
		color: var(--theme-default-text);
		margin-left: 10px;
		font-size: 18px;
		float: right;
	}
</style>
