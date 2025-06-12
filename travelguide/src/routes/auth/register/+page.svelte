<script lang="ts">
	import { onMount } from 'svelte';
	import PocketBase from 'pocketbase';
	import { goto } from '$app/navigation';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';

	let email = '';
	let name = '';
	let password = '';
	let passwordConfirm = '';
	let error = '';
	let mounted = false;
  	let pb: PocketBase;

	onMount(() => {
    	pb = new PocketBase('https://pocketbase.oracle.aquabx.ovh');
		mounted = true;
	});

	const register = async () => {
		try {
			const userData = {
				email,
				emailVisibility: true,
				name,
				role: "user",
				password,
				passwordConfirm
			};
			await pb.collection('users').create(userData);
			await pb.collection('users').authWithPassword(email, password);
			window.location.href = '/';
		} catch (err) {
			console.error('Register error:', err);
			if (err?.response?.data) {
				error = Object.entries(err.response.data)
					.map(([field, e]: any) => `${field}: ${e.message || e}`)
					.join(' | ');
			} else {
				error = err.message || 'Registration failed';
			}
		}
	};
</script>

{#if mounted}
	<div class="min-h-screen flex flex-col items-center justify-center p-8">
		<div class="w-full max-w-sm space-y-4">
			<h1 class="text-2xl font-bold">Register</h1>
			{#if error}<p class="text-red-500 text-sm">{error}</p>{/if}

			<Label for="email">Email</Label>
			<Input id="email" bind:value={email} type="email" placeholder="you@example.com" />

			<Label for="name">Name</Label>
			<Input id="name" bind:value={name} placeholder="Your name" />

			<Label for="password">Password</Label>
			<Input id="password" bind:value={password} type="password" placeholder="Password" />

			<Label for="confirm">Confirm Password</Label>
			<Input id="confirm" bind:value={passwordConfirm} type="password" placeholder="Repeat password" />
			<div class="w-full flex justify-between items-center mt-4">
				<button
					on:click={register}
					class="inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap
						rounded-md text-sm font-medium outline-none transition-all
						focus-visible:ring-[3px] focus-visible:border-ring focus-visible:ring-ring/50
						bg-primary text-primary-foreground shadow-xs hover:bg-primary/90
						h-9 px-4 py-2"
				>
					Register
				</button>
				<div class="w-full flex justify-end mt-2">
					<button
						on:click={() => goto('/auth')}
						class="text-sm text-muted-foreground hover:underline"
					>
						← Back
					</button>
				</div>
			</div>
		</div>
	</div>
{:else}
	<p>Loading...</p>
{/if}
