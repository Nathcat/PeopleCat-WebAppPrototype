<script lang="ts">
	import { goto } from "$app/navigation";

	// Always redirect to global chatroom for now
	goto("/chat/1", { replaceState: true });
</script>
