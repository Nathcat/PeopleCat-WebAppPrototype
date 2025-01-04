<script lang="ts">
	import { removeToast, type ToastData, type ToastType } from "./Toaster.svelte";
	import { melt, type Toast, type ToastsElements } from "@melt-ui/svelte";
	import { fly } from "svelte/transition";
	import { onMount } from "svelte";
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
	let offset = 0;

	function ontouchmove(e: TouchEvent) {
		for (const touch of e.targetTouches) x = offset - touch.clientX;
		dragging = true;
	}

	function ontouchend() {
		if (x < -100) removeToast(toast.id);
		dragging = false;
	}

	onMount(() => {
		let request: number;

		(function pull() {
			request = requestAnimationFrame(pull);
			if (!dragging) x -= x / 4;
		})();

		return () => cancelAnimationFrame(request);
	});
</script>

<div
	ontouchstart={(e) => (offset = e.targetTouches[0].clientX + x)}
	out:fly={{ duration: 250, x: "100%" }}
	in:fly={{ duration: 250, x: "100%" }}
	use:melt={$content(toast.id)}
	style:right="{x}px"
	{ontouchmove}
	class="toast"
	{ontouchend}
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
