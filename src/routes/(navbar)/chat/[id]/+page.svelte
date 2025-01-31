<script lang="ts">
	import { application } from "$lib/application/application.svelte";
	import { resize } from "svelte-resize-observer-action";
	import { PacketType } from "$lib/application/packet";
	import Message from "./Message.svelte";
	import Input from "./Input.svelte";
	import { onMount } from "svelte";

	let { data } = $props();

	let messages = $derived(application.cache.messages[data.chat]);
	let margin = $state(0);
	let scrollable = false;

	onMount(() => {
		// Request messages from the server if none
		if (messages) return;
		application.send({
			type: PacketType.GET_MESSAGE_QUEUE,
			payload: { chatId: data.chat },
		});
	});

	function onResize() {
		const nowScrollable = document.body.scrollHeight > document.body.clientHeight;
		if (!CSS.supports("overflow-anchor", "none") || nowScrollable != scrollable)
			window.scrollTo(0, document.documentElement.scrollHeight);
		scrollable = nowScrollable;
	}
</script>

<div class="container" style:margin-bottom="{margin}px" use:resize={onResize}>
	{#each messages as message}
		<Message {message} />
	{/each}
	<div class="anchor"></div>
</div>

<Input chat={data.chat} bind:clientHeight={margin} />

<style lang="scss">
	.container {
		flex-direction: column;
		overflow-x: hidden;
		display: flex;
		padding: 10px;
		gap: 10px;

		:global(*) {
			overflow-anchor: none;
		}
	}

	.anchor {
		overflow-anchor: auto;
		height: 1px;
	}
</style>
