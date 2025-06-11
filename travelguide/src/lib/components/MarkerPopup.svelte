<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';

	import { MapManager } from '$lib/MapManager';

	let place = MapManager.selected_place;
</script>

<div>
	<h3 class="text-card-foreground text-lg font-semibold">
		{#if $place}
			{$place.name}
		{:else}
			No place selected
		{/if}
	</h3>
</div>
