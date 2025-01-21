<script lang="ts" module>
	export let elements = $state<Snippet[]>([]);
</script>

<script lang="ts">
	import { onMount, type Snippet } from "svelte";

	let { children }: { children: Snippet } = $props();

	onMount(() => {
		const index = elements.push(children) - 1;
		return () => elements.splice(index, 1);
	});
</script>
