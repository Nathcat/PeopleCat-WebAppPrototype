<script lang="ts">
	import { melt, type Toast, type ToastsElements } from "@melt-ui/svelte";
	import type { ToastData, ToastType } from "./Toaster.svelte";
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
</script>

<div
	class="toast"
	use:melt={$content(toast.id)}
	out:fly={{ duration: 250, x: "100%" }}
	in:fly={{ duration: 250, x: "100%" }}
>
	<h4>
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
		background-color: var(--dark-1);
		border-radius: 5px;
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
		color: var(--text-1);
		margin-left: 10px;
		font-size: 18px;
		float: right;
	}
</style>
