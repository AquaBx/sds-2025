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
	import { toast } from 'svelte-sonner';
	import { pb } from '$lib/pocketbase';
	import { goto } from '$app/navigation';

	let { data } = $props();

	loadData(data);

	const logout = () => {
		pb.authStore.clear();
		goto('/auth');
	};

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
		try {
			MapManager.init(mapDiv);
		} catch (error) {
			console.error('Failed to initialize map:', error);
			toast.error('Failed to load map', {
				description: 'Please try refreshing the page'
			});
		}
	});

	let tab = $state('planner');
</script>

{#if mounted}
	<div
	class="absolute top-4 right-4 z-20 border border-border backdrop-blur-md bg-background/30 dark:bg-background/20 shadow-md rounded-xl p-4 flex flex-col gap-2 w-48"
>
	<h2 class="text-lg font-semibold">Account</h2>

	<!-- My Account -->
	<button
		on:click={() => goto('/account')}
		class="inline-flex items-center justify-center rounded-md text-sm font-medium
		       bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 transition"
	>
		My Account
	</button>

	<!-- Logout -->
	<button
		on:click={() => {
			pb.authStore.clear();
			goto('/auth');
		}}
		class="inline-flex items-center justify-center rounded-md text-sm font-medium
		       bg-destructive hover:bg-destructive/90 text-white px-4 py-2 transition"
	>
		Logout
	</button>
</div>
	<nav
		class="inset-x-4 bottom-4 md:inset-x-unset md:inset-y-4 md:left-4 md:max-w-md absolute z-10 rounded-2xl bg-background/15 p-8 flex flex-col gap-4 backdrop-blur-sm border-border border-2"
	>
		{#if config.hasSearched}
			<div in:fly out:fly class="h-full flex-col flex gap-2">
				<ScrollArea class="flex-1 h-1/2">
					{#each config.activities as activity}
						<PlaceCard place={activity}></PlaceCard>
					{/each}
				</ScrollArea>
				<Button onclick={() => (config.hasSearched = false)}>Cancel</Button>
			</div>
		{:else if config.hasItinerate}
			<div in:fly out:fly class="h-full flex-col flex gap-2">
				<ScrollArea class="flex-1 h-1/2">
					{#each config.itinerary as activity}
						<PlaceCard place={activity}></PlaceCard>
						{activity.startingTime}
						{activity.endingTime}
					{/each}
				</ScrollArea>
				<Button onclick={() => (config.hasItinerate = false)}>Cancel</Button>
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
