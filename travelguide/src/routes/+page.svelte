<script lang="ts">
	import Form from '$lib/views/Form.svelte';
	import { onMount } from 'svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import { MapManager } from '$lib/MapManager';
	import { pb } from '$lib/pocketbase';
	import Search from '$lib/views/Search.svelte';
	import { config, loadData } from '$lib/store.svelte.js';
	import { ScrollArea } from '$lib/components/ui/scroll-area/';
	import PlaceCard from '$lib/components/PlaceCard.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { fly } from 'svelte/transition';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';

	let { data } = $props();
	let loggedIn = false;

	loadData(data);

	let mounted = $state(false);
	let mapDiv: HTMLDivElement;

	$effect(() => {	
		MapManager.markersReset();
		MapManager.layersReset();

		MapManager.markers = config.activities.map((place) => MapManager.createMarker(place));
		MapManager.createRoute(config.itinerary.map((day) => day.route));

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
		
		loggedIn = pb.authStore.isValid;
		pb.authStore.onChange(() => {
			loggedIn = pb.authStore.isValid;
		});
	});

	function handleLogout() {
		pb.authStore.clear();
		window.location.href = '/';
	}

	let tab = $state('planner');
</script>

{#if mounted}
	<div class="absolute top-4 right-4 z-20">
	{#if loggedIn}
		<div class="bg-background/30 backdrop-blur-md border border-border rounded-xl shadow-md p-4 flex flex-col gap-2 w-48">
		<h2 class="text-lg font-semibold">Account</h2>
		<button on:click={() => goto('/account')} 
			class="bg-muted px-4 py-2 rounded-xl text-sm font-semibold text-foreground hover:bg-muted/80 transition"
		>		
			My Account
		</button>
		<button on:click={handleLogout} 
			class="w-full px-4 py-2 rounded-xl text-sm font-semibold text-white
         	bg-destructive hover:bg-destructive/90 transition"
		>
			Logout
		</button>
		</div>
	{:else}
		<button on:click={() => goto('/auth')} 
			class="inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap
              rounded-md text-sm font-medium outline-none transition-all
              focus-visible:ring-[3px] focus-visible:border-ring focus-visible:ring-ring/50
              bg-primary text-primary-foreground shadow-xs hover:bg-primary/90
              h-9 px-4 py-2"
      	>
		Login
		</button>
	{/if}
	</div>
	<nav
		class="inset-x-4 bottom-4 md:inset-x-unset md:inset-y-4 md:left-4 md:max-w-md absolute z-10 rounded-2xl bg-background/15 p-8 flex flex-col gap-4 backdrop-blur-sm border-border border-2"
	>
		{#if config.hasSearched}
			<div in:fly out:fly class="h-full flex-col flex gap-2">
				<ScrollArea class="flex-1 h-1/2 flex flex-col gap-1">
					{#each config.activities as activity}
						<PlaceCard place={activity}></PlaceCard>
					{/each}
				</ScrollArea>
				<Button onclick={() => (config.hasSearched = false)}>Cancel</Button>
			</div>
		{:else if config.hasItinerate}
			<div in:fly out:fly class="h-full flex flex-col gap-2">
				<Tabs.Root value="day-0" class="flex-1 overflow-auto">
					<Tabs.List>
						{#each config.itinerary as day, i}
							<Tabs.Trigger value="day-{i}">Day {i}</Tabs.Trigger>
						{/each}
					</Tabs.List>
					{#each config.itinerary as day, i}
						<Tabs.Content value="day-{i}" class="h-full">
							<ScrollArea class="flex-1 flex flex-col gap-1">
								{#each day.itinerary as activity}
									<PlaceCard place={activity}></PlaceCard>
									{activity.startingTime}
									{activity.endingTime}
								{/each}
							</ScrollArea>
						</Tabs.Content>
					{/each}
				</Tabs.Root>

				<Button class="mt-2" onclick={() => (config.hasItinerate = false)}>Cancel</Button>
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