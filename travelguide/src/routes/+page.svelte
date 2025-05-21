<script lang="ts">
	import Form from '$lib/views/Form.svelte';

	import { onMount } from 'svelte';
	let { data } = $props();
	let { cities, tags, types } = data;
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { MapManager } from '$lib/MapManager.js';
	import Search from '$lib/views/Search.svelte';
	import { activities } from '$lib/store.js';
	import { ScrollArea } from '$lib/components/ui/scroll-area/';
	import PlaceCard from '$lib/components/PlaceCard.svelte';

	let mounted = $state(false);
	let mapDiv: HTMLDivElement;

	$effect(() => {
		MapManager.markersReset();

		MapManager.markers = $activities.map((place) => MapManager.createMarker(place));
		if (MapManager.map) {
			MapManager.map.fitBounds(MapManager.bounds, { padding: 50 });
		}
	});

	onMount(() => {
		mounted = true;
		MapManager.init(mapDiv);
	});
</script>

{#if mounted}
	<navbar
		class="inset-x-4 bottom-4 md:inset-x-unset md:inset-y-4 md:left-4 md:max-w-md absolute z-10 rounded-2xl bg-white/90 p-8 flex flex-col gap-4"
	>
		<Tabs.Root value="planner">
			<Tabs.List>
				<Tabs.Trigger value="planner">Planner</Tabs.Trigger>
				<Tabs.Trigger value="search">Search</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="planner">
				<Form {cities} {tags} {types}></Form>
			</Tabs.Content>
			<Tabs.Content value="search">
				<Search {tags}></Search>
			</Tabs.Content>
		</Tabs.Root>

		<ScrollArea class="h-full">
			{#each $activities as activity}
				<PlaceCard place={activity}></PlaceCard>
			{/each}
		</ScrollArea>
	</navbar>
{/if}
<div bind:this={mapDiv} class="z-0 h-dvh"></div>
