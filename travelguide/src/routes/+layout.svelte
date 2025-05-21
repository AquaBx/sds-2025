<script lang="ts">
	import { Toaster } from 'svelte-sonner';
	import '../app.css';
	import 'maplibre-gl/dist/maplibre-gl.css';

	let { children } = $props();
</script>

{@render children()}

<Toaster></Toaster>