<script lang="ts">
	import Form from '$lib/views/Form.svelte';
	import { onMount } from 'svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import { MapManager } from '$lib/MapManager';
	import Search from '$lib/views/Search.svelte';
	import { config, loadData } from '$lib/store.svelte.js';
	import { ScrollArea } from '$lib/components/ui/scroll-area/';
	import PlaceCard from '$lib/components/PlaceCard.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { fly } from 'svelte/transition';

	let { data } = $props();

	loadData(data)

	let mounted = $state(false);
	let mapDiv: HTMLDivElement;

	$effect(() => {
		MapManager.markersReset();

		MapManager.markers = config.activities.map((place) => MapManager.createMarker(place));
		if (MapManager.map) {
			let mobile = window.screen.availWidth < 500;
			let left = mobile ? 50 : 500;
			let bottom = mobile ? 300 : 50;
			MapManager.map.fitBounds(MapManager.bounds, {
				padding: { top: 50, bottom, left, right: 50 }
			});
		}
	});

	onMount(() => {
		mounted = true;
		MapManager.init(mapDiv);
	});

	let tab = $state('planner');
</script>

{#if mounted}
	<nav
		class="inset-x-4 bottom-4 md:inset-x-unset md:inset-y-4 md:left-4 md:max-w-md absolute z-10 rounded-2xl bg-white/90 p-8 flex flex-col gap-4"
	>
		{#if config.hasSearched}
			<div in:fly out:fly class="h-full flex-col flex">
				<ScrollArea class="flex-1">
					{#each config.activities as activity}
						<PlaceCard place={activity}></PlaceCard>
					{/each}
				</ScrollArea>
				<Button onclick={() => (config.hasSearched = false)}>Cancel</Button>
			</div>
		{:else}
			<Tabs.Root bind:value={tab}>
				<Tabs.List>
					<Tabs.Trigger value="planner">Planner</Tabs.Trigger>
					<Tabs.Trigger value="search">Search</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content value="planner">
					<Form></Form>
				</Tabs.Content>
				<Tabs.Content value="search">
					<Search></Search>
				</Tabs.Content>
			</Tabs.Root>
		{/if}
	</nav>
{/if}
<div bind:this={mapDiv} class="z-0 h-dvh"></div>
