<script lang="ts">
	import { application } from "$lib/application/application.svelte";
	import { PacketType } from "$lib/application/packet";
	import Message from "./Message.svelte";
	import Input from "./Input.svelte";
	import { onMount } from "svelte";

	let { data } = $props();

	let messages = $derived(application.cache.messages[data.chat]);
	let sticky = $state(true);
	let margin = $state(0);

	onMount(() => {
		const observer = new ResizeObserver(() => {
			if (sticky) window.scrollTo(0, document.documentElement.scrollHeight);
		});
		observer.observe(document.documentElement);

		const scroll = () => {
			sticky = window.scrollY + window.innerHeight == document.documentElement.scrollHeight;
		};
		// todo: improve this as I still don't know exactly whats causing it (maybe message fetching)
		setTimeout(() => window.addEventListener("scroll", scroll), 100);

		// Request messages from the server if none
		if (messages) return;
		application.send({
			type: PacketType.GET_MESSAGE_QUEUE,
			payload: { chatId: data.chat },
		});

		return () => {
			window.removeEventListener("scroll", scroll);
			observer.disconnect();
		};
	});
</script>

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
