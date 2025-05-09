<script lang="ts">
	let { searchPlaces } = $props();
	let value: string = $state('');
	
	import type { Place } from '$lib/types';
	import { MagnifyingGlass } from '@steeze-ui/phosphor-icons';


</script>
<div class="m-2">
	
	<input
		type="text"
		placeholder="Search for a place (name, theme, etc...)"
		class="input w-full" bind:value={value}
		oninput={(e) => {
			e.preventDefault();
			searchPlaces(value);
		}}
		
		/>
</div>

