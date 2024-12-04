<script lang="ts">
	import ProfilePicture from "$lib/components/profile/ProfilePicture.svelte";
	import Username from "$lib/components/profile/Username.svelte";
	import type { Message } from "$lib/application/cache.svelte";
	import { page } from "$app/stores";

	let { message }: { message: Message } = $props();
</script>

<div class="container" class:self={message.senderId == $page.data.application.user!.id}>
	<div style="grid-area: pfp"><ProfilePicture id={message.senderId} /></div>
	<div style="grid-area: details">
		<Username id={message.senderId} />
		<span class="time">{new Date(message.timeSent).toLocaleString("gb-EN")}</span>
	</div>
	<div class="msg">
		{message.content}
	</div>
</div>

<style lang="scss">
	.container {
		display: grid;
		grid-template-columns: repeat(2, auto);
		grid-template-rows: repeat(2, auto);
		justify-content: start;
		grid-auto-flow: row;
		grid-template-areas:
			"pfp details"
			"pfp msg";
		gap: 5px 10px;

		&:not(.self) .msg {
			background-color: var(--theme-message-background);
			color: var(--theme-message-text);
			padding: 10px 50px 10px 10px;
			border-top-left-radius: 1px;
		}
	}

	.msg {
		grid-area: msg;

		text-overflow: ellipsis;
		border-radius: 25px;
		width: fit-content;
		overflow: hidden;
		max-width: 100%;
	}

	.time {
		color: var(--text-2);
		font-size: 11px;
	}

	.container.self {
		justify-content: end;
		justify-items: end;
		grid-template-areas:
			"details pfp"
			"msg pfp";

		.msg {
			background-color: var(--theme-message-self-background);
			color: var(--theme-message-self-text);
			border-top-right-radius: 1px;
			padding: 10px 10px 10px 50px;
		}
	}
</style>
