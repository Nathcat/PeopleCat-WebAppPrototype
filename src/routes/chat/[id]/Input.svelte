<script lang="ts">
	import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
	import { PacketType } from "$lib/application/packet";
	import { page } from "$app/stores";
	import { Fa } from "svelte-fa";

	let { chat, clientHeight = $bindable() }: { chat: number; clientHeight?: number } = $props();
	let value: string = $state("");

	async function onsubmit(e: SubmitEvent) {
		const TimeSent = new Date().getTime();
		e.preventDefault();

		if (value.length < 1) return;

		await $page.data.application.send({
			type: PacketType.SEND_MESSAGE,
			payload: { Content: value, ChatID: chat, TimeSent },
		});

		$page.data.application.cache.push_message(chat, {
			SenderID: $page.data.application.user!.id,
			Content: value,
			TimeSent,
		});

		value = "";
	}
</script>

<div class="input-container" bind:clientHeight>
	<form class="input-box" {onsubmit}>
		<input type="text" name="content" autocomplete="off" bind:value />
		<button type="submit">
			<Fa icon={faArrowRight} />
		</button>
	</form>
</div>

<style lang="scss">
	.input-container {
		background-color: var(--dark-1);
		border-top: 1px solid var(--text-2);
		padding: 10px;
		position: fixed;
		width: 100%;
		bottom: 0px;
	}

	.input-box {
		transition: outline 125ms ease-in-out;
		outline: 2px solid transparent;
		border-radius: 10px;

		background-color: var(--dark-2);
		display: flex;

		&:has(input:focus-within) {
			outline: 2px solid var(--primary-1);
		}

		input {
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
