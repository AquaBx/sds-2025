<script lang="ts">
	let { generateGuide , showAll} = $props();

	let interests: string[] = $state([]);
	let destination: {cityId:number,city:string} = $state({cityId:0,city:"Poznan"});
	let budget = $state(50);
	let currency = $state("EUR");
	let start = $state('2025-04-25');
	let end = $state('2025-04-25');
	const categories = ['Nature', 'History', 'Art', 'Food', 'Sport', 'Shopping', 'Relaxation'];
</script>

<form
	onsubmit={(e) => {
		e.preventDefault();
		generateGuide(destination.cityId,destination.city,interests, budget, start, end);
	}}
	class="mt-4 flex flex-col gap-4"
>
	<label for="destination">
		Where do you want to go ?
		<select class="input" id="destination" bind:value={destination}>
			<option value={{cityId:0,city:"Poznan"}}>Poznan</option>
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
		<input class="input" type="text" bind:value={currency} />
	</label>

	<label>
		Start time:
		<input class="input" type="date" bind:value={start} />
	</label>

	<label>
		End time:
		<input class="input" type="date" bind:value={end} />
	</label>

	<div class="flex flex-col gap-1">
		<button class="button w-full" type="submit">Generate My Guide</button>
		<button class="button w-full" type="button" onclick={showAll}>Show All Places</button>
	</div>
</form>
