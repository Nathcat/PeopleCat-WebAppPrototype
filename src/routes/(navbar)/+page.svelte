<script lang="ts">
	import { goto } from "$lib/util.svelte";

	// Always redirect to global chatroom for now
	goto("/chat/1", { replaceState: true });
</script>
