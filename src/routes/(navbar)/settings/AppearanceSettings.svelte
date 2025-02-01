<script lang="ts">
	import { application } from "$lib/application/application.svelte";
	import Slider from "$lib/components/Slider.svelte";
</script>

<h3>Appearance Settings</h3>
<hr />
<div class="section">
	<h5>Bottom Margin</h5>
	<div style="width: 35%; min-width: min(400px, 100%);">
		<Slider bind:value={application.settings.margin} max={51} step={3} />
	</div>
</div>

<style lang="scss">
	.section {
		margin-bottom: 20px;

		&:last-child {
			margin-bottom: 0;
		}
	}

	h5 {
		margin-bottom: 5px;
	}
</style>
