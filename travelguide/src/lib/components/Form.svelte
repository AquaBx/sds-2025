<script lang="ts">
	import { onMount } from 'svelte';

	let { generateGuide, showAll } = $props();

	let interests: string[] = $state([]);
	let destination: { cityId: number; city: string } = $state({ cityId: 0, city: 'Poznan' });
	let budget = $state(50);
	let currency = $state('EUR');
	let start = $state('2025-04-25');
	let end = $state('2025-04-25');
	let disability = $state(false);

	let cities = $state([]);

	onMount(async () => {
		cities = (await (await fetch('/api/cities')).json()).cities;
		destination = cities[0]
	});

	const categories = ['Nature', 'History', 'Art', 'Food', 'Sport', 'Shopping', 'Relaxation'];
</script>

<form
	onsubmit={(e) => {
		e.preventDefault();
		generateGuide(
			destination.cityId,
			destination.city,
			interests,
			budget,
			currency,
			start,
			end,
			disability
		);
	}}
	class="mt-4 flex flex-col gap-4"
>
	<label for="destination">
		Where do you want to go ?
		<select class="input" id="destination" bind:value={destination}>
			{#each cities as city}
				<option value={city}>{city.name}</option>
			{/each}
		</select>
	</label>

	<label>
		What are you into?
		<fieldset class="flex flex-col gap-1 pl-4">
			{#each categories as category}
				<label>
					<input class="checkbox" type="checkbox" bind:group={interests} value={category} />
					{category}
				</label>
			{/each}
		</fieldset>
	</label>

	<label>
		Budget:
		<input class="input" type="number" bind:value={budget} min="0" />
	</label>

	<label>
		Currency:
		<input
			class="input"
			type="text"
			bind:value={currency}
			pattern={'[A-Z]{3}'}
			title="ISO-4217 code, e.g. EUR"
		/>
	</label>

	<label>
		Start time:
		<input class="input" type="date" bind:value={start} />
	</label>

	<label>
		End time:
		<input class="input" type="date" bind:value={end} />
	</label>

	<label>
		Disability Accessible
		<input type="checkbox" bind:checked={disability} />
	</label>

	<div class="flex flex-col gap-1">
		<button class="button w-full" type="submit">Generate My Guide</button>
		<button class="button w-full" type="button" onclick={showAll}>Show All Places</button>
	</div>
</form>
