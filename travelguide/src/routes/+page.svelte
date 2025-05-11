<script lang="ts">
  
	import maplibre from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';
	import { onMount } from 'svelte';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { ChevronDown, ChevronUp } from '@steeze-ui/heroicons';
	import Form from '$lib/components/Form.svelte';
	import PlaceCard from '$lib/components/PlaceCard.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import type { Place } from '$lib/types';
	import Filters from '$lib/components/Filters.svelte';

	let mapDiv: HTMLDivElement;
	let map: maplibre.Map;
	let collapsed = $state(false);
	let submitted = $state(false);
	let markers: maplibre.Marker[] = [];
	let selectedPlaces: { places: Place[] } = $state({
		places: []
	});

	onMount(() => {
		map = new maplibre.Map({
			container: mapDiv, // container id
			style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json', // style URL
			center: [0, 0], // starting position [lng, lat]
			zoom: 1 // starting zoom
		});
	});

	function emptyMarkers() {
		for (let marker of markers) {
			marker.remove();
		}
		markers = [];
	}

	async function generateGuide(
		cityId,
		city,
		interests,
		budget,
		currency,
		startDate,
		endDate,
		disability
	) {
		emptyMarkers();

		const res = await fetch('/api/guide', {
			method: 'POST',
			body: JSON.stringify({
				cityId,
				city,
				interests,
				budget,
				currency,
				startDate,
				endDate,
				disability
			})
		});

		submitted = true;
		const data = await res.json();
		selectedPlaces.places = data.itinerary
		updateList();
	}

	function cancel() {
		submitted = false;
		emptyMarkers();
		for (let p in selectedPlaces.places) {
			delete selectedPlaces.places[p];
		}
	}

	function updateList() {
		console.log(selectedPlaces);

		for (let location of selectedPlaces.places) {
			const marker = new maplibre.Marker();
			let coords = location.location.split(';');
			coords.reverse();
			marker.setLngLat(coords);
			markers.push(marker);
			marker.addTo(map);
		}
		console.log(selectedPlaces);
	}

	async function showAll() {
		emptyMarkers();

		submitted = true;
		const res = await fetch('/api/places');
		const data = await res.json();
		selectedPlaces.places = data.places;
		updateList();
	}

	async function applyFilters(maxPrice, selectedThemes) {
		emptyMarkers();
		selectedPlaces.places = selectedPlaces.places.filter((place) => {
            const matchesPrice = maxPrice === null || place.price <= maxPrice;
            const matchesTheme =
                selectedThemes.length === 0 || selectedThemes.includes(place.theme);
            return matchesPrice && matchesTheme;
        });
        updateList();
	}

	function resetFilters() {
		emptyMarkers();
		showAll();
	}
	

	async function searchPlaces(query: string) {
		emptyMarkers();
		const res = await fetch('/api/places');
		const data = await res.json();
		const q = query.toLowerCase();
		selectedPlaces.places = data.places.filter((place) => place.name.toLowerCase().includes(q) || place.theme.toLowerCase().includes(q)|| place.typeName.toLowerCase().includes(q));
		updateList();
	}


</script>

<navbar class="absolute left-0 top-0 z-10 m-8 w-96 rounded-2xl bg-white/90 p-6">
	<header class="flex items-center justify-between pb-2 backdrop-blur-xl">
		<h1 class="text-xl font-bold">TravelGuide</h1>
		<button onclick={() => (collapsed = !collapsed)}>
			<Icon src={collapsed ? ChevronUp : ChevronDown} theme="solid" class="color-gray-900 size-8" />
		</button>
	</header>
	{#if !collapsed}
		<div class="border-t-1 max-h-[calc(100dvh-144px)] overflow-auto border-gray-200">
			{#if submitted}
				<SearchBar {searchPlaces}></SearchBar>
				<div class="mt-4 flex flex-col gap-2">
					{#each selectedPlaces.places as place}
						<PlaceCard {place} />
					{/each}
				</div>
				<button class="button mt-4 w-full" onclick={() => cancel()}> Cancel </button>
				<Filters {applyFilters} {resetFilters} />
			{:else}
				<Form {generateGuide} {showAll}></Form>
			{/if}
		</div>
	{/if}
</navbar>

<div bind:this={mapDiv} class="z-0 h-dvh"></div>
