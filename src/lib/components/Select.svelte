<script lang="ts" module>
	import { faChevronDown, type IconDefinition } from "@fortawesome/free-solid-svg-icons";
	import { melt, createSelect } from "@melt-ui/svelte";

	export interface SelectOption {
		icon?: IconDefinition;
		onclick?: () => void;
		label: string;
	}
</script>

<script lang="ts">
	import Fa from "svelte-fa";

	let { options, placeholder }: Props = $props();
	interface Props {
		options: SelectOption[];
		placeholder?: string;
	}

	const {
		elements: { trigger, menu, option, group, groupLabel },
		states: { selectedLabel, open, selected },
		helpers: { isSelected },
	} = createSelect({
		forceVisible: true,
		positioning: {
			placement: "bottom",
			fitViewport: true,
			sameWidth: true,
		},
	});
</script>

<button use:melt={$trigger}>
	{$selectedLabel || (placeholder ?? "Select an option")}
	<Fa icon={faChevronDown} />
</button>

<style lang="scss">
	button {
		border: 2px solid var(--theme-input-border);
		color: var(--theme-default-text);
		padding: 5px 8px 5px 5px;
		background: transparent;
		text-decoration: none;
		border-radius: 10px;
		display: flex;
		gap: 10px;

		:global(> *:last-child) {
			margin-left: auto;
		}
	}
</style>
