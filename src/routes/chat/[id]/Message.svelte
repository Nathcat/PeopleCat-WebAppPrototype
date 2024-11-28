<script lang="ts">
	import ProfilePicture from "$lib/components/ProfilePicture.svelte";
	import type { Message } from "$lib/application/cache.svelte";
	import { page } from "$app/stores";

	let { message }: { message: Message } = $props();
	let author = $state($page.data.application.cache.get_user(message.author));
</script>

<div class="container" class:self={message.author == $page.data.application.user!.id}>
	{#await author}
		<div class="loading pfp"></div>
	{:then author}
		<ProfilePicture path={author.pfpPath} />
	{/await}
	<div class="list">
		<div>
			{#await author}
				<span class="loading username"></span>
			{:then author}
				<span class="username">{author.fullName}</span>
			{/await}
			<span class="time">{message.time.toLocaleString("gb-EN")}</span>
		</div>
		<div class="bubble">
			{message.content}
		</div>
	</div>
</div>

<style lang="scss">
	@import "$lib/shimmer.scss";

	.container {
		display: flex;
		gap: 10px;
	}

	.list {
		flex-direction: column;
		display: flex;
		gap: 5px;
	}

	.username {
		height: 19px;
	}

	.time {
		color: var(--text-2);
		font-size: small;
		margin-left: 5px;
	}

	.bubble {
		text-overflow: ellipsis;
		border-radius: 25px;
		width: fit-content;
		overflow: hidden;
		max-width: 100%;
	}

	.container:not(.self) .bubble {
		background-color: var(--dark-2);
		padding: 10px 50px 10px 10px;
		border-top-left-radius: 1px;
		color: var(--text-3);
		float: left;
	}

	.container.self {
		flex-direction: row-reverse;

		.list {
			align-items: end;
		}

		.bubble {
			background-color: var(--primary-2);
			border-top-right-radius: 1px;
			padding: 10px 10px 10px 50px;
			color: var(--dark-1);
			float: right;
		}
	}

	.loading {
		@include shimmer(200px);

		&.username {
			border-radius: 5px;
			width: 200px;
		}

		&.pfp {
			border-radius: 50%;
			min-height: 50px;
			min-width: 50px;
			height: 50px;
			width: 50px;
		}
	}
</style>
