<script lang="ts">
	import { PacketType } from "$lib/application/packet";
	import Message from "./Message.svelte";
	import Input from "./Input.svelte";
	import { onMount } from "svelte";

	let { data } = $props();

	let messages = $derived(data.application.cache.messages[data.chat]);
	let clientHeight = $state(0);

	onMount(() => {
		// Request messages from the server if none
		if (messages) return;
		data.application.send({
			type: PacketType.GET_MESSAGE_QUEUE,
			payload: { ChatID: data.chat },
		});
	});
</script>

<div class="message-container" style:margin-bottom="{clientHeight}px">
	{#each messages as message}
		<Message {message} />
	{/each}
</div>

<Input chat={data.chat} bind:clientHeight />

<style lang="scss">
	.message-container {
		flex-direction: column;
		overflow-x: hidden;
		display: flex;
		padding: 10px;
		gap: 10px;
	}
</style>
