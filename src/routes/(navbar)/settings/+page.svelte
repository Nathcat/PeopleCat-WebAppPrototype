<script>
	import AppearenceSettings from "./AppearanceSettings.svelte";
	import GeneralSettings from "./GeneralSettings.svelte";
</script>

<div class="container">
	<div class="island">
		<GeneralSettings />
	</div>
	<div class="island">
		<AppearenceSettings />
	</div>
</div>

<style lang="scss">
	.container {
		flex-direction: column;
		display: flex;
		margin: 10px;
		gap: 10px;
	}

	.island {
		width: 100%;
	}
</style>
