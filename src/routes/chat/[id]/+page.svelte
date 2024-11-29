<script lang="ts">
	import { PacketType } from "$lib/application/packet";
	import Message from "./Message.svelte";
	import Input from "./Input.svelte";
	import { onMount } from "svelte";

	let { data } = $props();

	let messages = $derived(data.application.cache.messages[data.chat]);
	let sticky = $state(true);
	let margin = $state(0);

	onMount(() => {
		const observer = new ResizeObserver(() => {
			if (sticky) window.scrollTo(0, document.documentElement.scrollHeight);
		});

		observer.observe(document.documentElement);

		// Request messages from the server if none
		if (messages) return;
		data.application.send({
			type: PacketType.GET_MESSAGE_QUEUE,
			payload: { ChatID: data.chat },
		});

		return () => observer.disconnect();
	});

	const onscroll = () =>
		(sticky = window.scrollY + window.innerHeight == document.documentElement.scrollHeight);
</script>

<svelte:window {onscroll} />

<div class="message-container" style:margin-bottom="{margin}px">
	{#each messages as message}
		<Message {message} />
	{/each}
</div>

<Input chat={data.chat} bind:clientHeight={margin} />

<style lang="scss">
	.message-container {
		flex-direction: column;
		overflow-x: hidden;
		display: flex;
		padding: 10px;
		gap: 10px;
	}
</style>
