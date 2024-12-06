<script lang="ts">
	import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
	import type { Message } from "$lib/application/cache.svelte";
	import { PacketType } from "$lib/application/packet";
	import { page } from "$app/stores";
	import { Fa } from "svelte-fa";

	let { chat, clientHeight = $bindable() }: { chat: number; clientHeight?: number } = $props();
	let value: string = $state("");
	let clientWidth = $state();

	async function onsubmit(e: SubmitEvent) {
		e.preventDefault();
		if (value.length < 1) return;

		const message: Message = {
			content: value,
			chatId: chat,
			timeSent: new Date().getTime(),
			senderId: $page.data.application.user!.id,
		};

		await $page.data.application.send({ type: PacketType.SEND_MESSAGE, payload: message });
		$page.data.application.cache.pushMessage(message);

		value = "";
	}
</script>

<div style="width: 100%" bind:clientWidth>
	<div class="input-container" style="width: {clientWidth}px" bind:clientHeight>
		<form class="input-box" {onsubmit}>
			<input type="text" name="content" autocomplete="off" bind:value />
			<button type="submit">
				<Fa icon={faArrowRight} />
			</button>
		</form>
	</div>
</div>

<style lang="scss">
	.input-container {
		background-color: var(--theme-send-section-background);
		border-top: 1px solid var(--theme-send-section-border);
		position: fixed;
		padding: 10px;
		bottom: 0px;
	}

	.input-box {
		transition: outline 125ms ease-in-out;
		outline: 2px solid transparent;
		border-radius: 10px;

		background-color: var(--theme-send-box-background);
		display: flex;

		&:has(input:focus-within) {
			outline: 2px solid var(--theme-send-box-outline);
		}

		input {
			background: none;
			outline: none;
			padding: 10px;
			border: none;
			flex-grow: 1;
		}

		button {
			line-height: 5px;
			font-size: 20px;
			padding: 10px;
		}
	}
</style>
