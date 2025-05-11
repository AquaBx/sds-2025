<script lang="ts">
	let { generateGuide , showAll} = $props();

	let interests: string[] = $state([]);
	let budget = $state(50);
	let start = $state('09:00');
	let end = $state('17:00');
	let disability = $state(false);
	const categories = ['Nature', 'History', 'Art', 'Food', 'Sport', 'Shopping', 'Relaxation'];

	let step = $state(0);
</script>

<!-- <form>
	{#if step !== 0}
		<button>Previous</button>
	{/if}
	<button>Next</button>
</form> -->

<form
	onsubmit={(e) => {
		e.preventDefault();
		generateGuide(interests, budget, start, end, disability);
	}}
	class="mt-4 flex flex-col gap-4"
>
	<label for="destination">
		Where do you want to go ?
		<select class="input" id="destination"></select>
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
		Budget (PLN):
		<input class="input" type="number" bind:value={budget} min="0" />
	</label>

	<label>
		Start time:
		<input class="input" type="time" bind:value={start} />
	</label>

	<label>
		End time:
		<input class="input" type="time" bind:value={end} />
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
