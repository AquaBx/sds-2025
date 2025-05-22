<script lang="ts">
	import { Toaster } from 'svelte-sonner';
	import '../app.css';
	import 'maplibre-gl/dist/maplibre-gl.css';
	import { ModeWatcher } from 'mode-watcher';
	let { children } = $props();
</script>

<ModeWatcher />
{@render children()}

<Toaster></Toaster>
