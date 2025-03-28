<script lang="ts">
	import maplibregl from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';
	import { onMount } from 'svelte';

	let mapDiv : HTMLDivElement;

	onMount(() => {
		const map = new maplibregl.Map({
			container: mapDiv, // container id
			style: 'https://demotiles.maplibre.org/style.json', // style URL
			center: [0, 0], // starting position [lng, lat]
			zoom: 1 // starting zoom
		});
	});
</script>

<div bind:this={mapDiv} id="map" class="h-dvh"></div>
