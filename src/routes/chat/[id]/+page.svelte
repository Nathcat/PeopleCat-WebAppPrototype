<script lang="ts">
	import { PacketType } from "$lib/application/packet";
	import { onMount } from "svelte";

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
		<div class="message">
			<div class="bubble">
				{message.content}
			</div>
		</div>
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

	.message {
		display: flex;
	}

	.bubble {
		border-radius: 1px 25px 25px 25px;
		background-color: var(--dark-2);
		padding: 5px 50px 10px 10px;
		text-overflow: ellipsis;
		color: var(--text-3);
		overflow: hidden;
	}
</style>
