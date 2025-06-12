<script lang="ts">
	import type { Place } from '$lib/types';
	import { HourglassMedium, Wheelchair, Star } from '@steeze-ui/phosphor-icons';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { onMount } from 'svelte';
	import PocketBase from 'pocketbase';
    import { goto } from '$app/navigation';
	export let place: Place;
	let userScore = 0;
	let showVote = false;
	let hoveredScore = 0;

	let user: any = null;
	let pb = new PocketBase('https://pocketbase.oracle.aquabx.ovh');
    
    onMount(() => {
        if (pb.authStore.isValid) {
            user = pb.authStore.model;
        }
		
    });

    async function ratePlace(score: number) {
        if (!user) {
            goto('/auth/login');
            return;
        }
        userScore = score;
        showVote = false;
		let existingVote: any = null;

		const userId = pb.authStore.model?.id;

		try{
			existingVote = await pb.collection('votes').getFirstListItem(
                `userId="${userId}" && placeId="${place.id}"`
        	);
		} catch (e) {
        }
		

		if (existingVote) {
			console.log('Updating existing vote:', existingVote);
			await pb.collection('votes').update(existingVote.id, { score });
		} 
		else {
			console.log('No existing vote found, creating a new one');
			const vote = {
				"score": score,
				"placeId": place.id,
				"userId": userId,
        	};
        	await pb.collection('votes').create(vote);
		}

        const votes = await pb.collection('votes').getFullList({
            filter: `placeId="${place.id}"`
        });
        const avg = votes.reduce((sum, v) => sum + (v.score ?? 0), 0) /(votes.length || 1);

        await pb.collection('activities').update(place.id, { score: avg , votesCount: votes.length });
        place.score = avg; 
		
    }

</script>

<div class="flex flex-col gap-4 rounded-lg border border-gray-300 p-4">
	<img
		class="object-cover aspect-video w-full cursor-pointer rounded-lg transition-transform duration-300 ease-in-out hover:scale-105"
		src={place.picture}
		alt={place.name}
	/>
	<div class="flex flex-1 flex-col justify-center">
		<div class="mb-1 text-2xl font-semibold">{place.name}</div>
		<div class="flex flex-1 flex-row">
			<div class="mb-2 text-base text-gray-600">{place.theme}</div>
			{#if place.disableAccessibility}
				<div class="mb-2 ml-2 flex items-center gap-1 text-sm font-semibold">
					<Icon src={Wheelchair} theme="solid" class="color-gray-900 size-4" />
				</div>
			{/if}
			<div
				class="mb-2 ml-2 flex items-center gap-1 text-sm font-semibold"
			>
				<Icon src={HourglassMedium} theme="solid" class="color-gray-900 size-4" />
				<p>{place.estimatedDuration} {place.estimatedDuration <= 1 ? 'hour' : 'hours'}</p>
			</div>
			<div class="flex items-center gap-1 mb-2 ml-2"
				on:mouseenter={() => showVote = true}
				on:mouseleave={() => { showVote = false; hoveredScore = 0; }}
			>
				{#if !showVote || userScore}
					{#each Array(5) as _, i}
						<Icon src={Star} theme="fill" class="size-4 {i < place.score ? 'text-yellow-400' : 'text-gray-300'}" />
					{/each}
					<span class="ml-2 text-sm text-gray-600">({place.score?.toFixed(1) ?? 'N/A'})</span>
				{:else}
					{#each Array(5) as _, i}
						<button
							type="button"
							class="focus:outline-none"
							on:click={() => ratePlace(i + 1)}
							on:mouseenter={() => hoveredScore = i + 1}
							on:mouseleave={() => hoveredScore = 0}
							aria-label="Give {i + 1} stars"
						>
							<Icon
								src={Star}
								theme="fill"
								class="size-4 transition-colors duration-150 {i < (hoveredScore || userScore) ? 'text-yellow-400' : 'text-gray-300'}"
							/>
						</button>
					{/each}
				{/if}
				{#if userScore}
					<span class="ml-2 text-xs text-green-600">Voted {userScore} stars !</span>
				{/if}
			</div>
		</div>
		<div class="text-sm leading-relaxed text-gray-800">{place.description}</div>
		<div>Open at : {place.openingTime} </div>
	</div>
</div>
