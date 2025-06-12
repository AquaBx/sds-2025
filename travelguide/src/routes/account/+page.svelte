<script lang="ts">
	import { onMount } from 'svelte';
	import { pb } from '$lib/pocketbase';
	import { goto } from '$app/navigation';

	let user: any = null;
	let mounted = false;

	onMount(() => {
		if (!pb.authStore.isValid) {
			goto('/auth');
			return;
		}
		user = pb.authStore.model;
		mounted = true;
	});
</script>

{#if mounted}
	<div class="min-h-screen flex flex-col items-center justify-center p-8">
		<div class="w-full max-w-md space-y-4 bg-background/30 backdrop-blur-md border border-border rounded-xl p-6 shadow-md">
			<h1 class="text-2xl font-bold text-center">My Account</h1>
			<div class="space-y-2">
				<div>
					<p class="text-sm font-medium text-muted-foreground">Email</p>
					<p>{user?.email}</p>
				</div>
				<div>
					<p class="text-sm font-medium text-muted-foreground">Name</p>
					<p>{user?.name}</p>
				</div>
				<!-- Possible to add more fields here -->
			</div>
			<button
				on:click={() => window.location.href = '/'}
				class="inline-flex items-center justify-center w-full rounded-md text-sm font-medium
				       bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 transition"
			>
				Back to Home
			</button>
		</div>
	</div>
{:else}
	<p>Loading...</p>
{/if}