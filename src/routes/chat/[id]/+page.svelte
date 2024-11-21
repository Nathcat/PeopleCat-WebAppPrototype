<script lang="ts">
	import { PacketType } from "$lib/application/packet";
	import { onMount } from "svelte";
	import Message from "./Message.svelte";

	let { data } = $props();

	let messages = $derived(data.application.cache.messages[data.chat]);

	onMount(() => {
		// Request messages from the server if none
		if (messages) return;
		data.application.send({
			type: PacketType.TYPE_GET_MESSAGE_QUEUE,
			payload: { ChatID: data.chat },
		});
	});
</script>

<div class="container">
	{#each messages as message}
		<Message {message} />
	{/each}
</div>

<style lang="scss">
	.container {
		flex-direction: column;
		overflow-x: hidden;
		display: flex;
		padding: 10px;
		gap: 10px;
	}
</style>
