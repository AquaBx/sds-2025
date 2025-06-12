<script lang="ts">
	import { Toaster } from 'svelte-sonner';
	import '../app.css';
	import 'maplibre-gl/dist/maplibre-gl.css';
	import { ModeWatcher } from 'mode-watcher';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { pb } from '$lib/pocketbase';

	let { children } = $props();

	onMount(() => {
		// Redirect to /auth if not logged in and trying to access a protected route
		if (!pb.authStore.isValid && !location.pathname.startsWith('/auth')) {
			goto('/auth');
		}
	});
</script>

<ModeWatcher />
{@render children()}


<Toaster />
