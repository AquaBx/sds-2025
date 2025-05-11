<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion/index.js';

	let { applyFilters, resetFilters } = $props();
	let maxPrice = $state(50);
	let selectedthemes = $state([]);
const themes = [
	'Botanic Garden',
	'ZOO',
	'Football Stadium',
	'Art',
	'Military',
	'Archeology',
	'Nature',
	'Shopping',
	'Restaurant',
	'Typical Food',
	'Americain',
	'Burger',
	'Water',
	'Indoor Climbing'
];
</script>

<div
	onsubmit={(e) => {
		e.preventDefault();
		applyFilters(maxPrice);
	}}
	class="fixed right-8 top-8 z-20 w-64 rounded-lg bg-white p-4 shadow-lg"
>
	<h2 class="text-lg font-semibold">Filters</h2>
	<label>
		Maximum Price: {maxPrice}
		<input
			type="range"
			bind:value={maxPrice}
			class="mt-2 w-full rounded border border-gray-300 p-2"
			min="0"
		/>
	</label>
	<Accordion.Root class="w-full">
		<Accordion.Item value="item-1">
			<Accordion.Trigger>Themes</Accordion.Trigger>
			<Accordion.Content>
				<fieldset class="flex flex-col gap-1">
					{#each themes as theme}
						<label>
							<input type="checkbox" bind:group={selectedthemes} value={theme} />
							{theme}
						</label>
					{/each}
				</fieldset>
			</Accordion.Content>
		</Accordion.Item>
		<Accordion.Item value="item-2">
			<Accordion.Trigger>Empty</Accordion.Trigger>
			<Accordion.Content>empty</Accordion.Content>
		</Accordion.Item>
	</Accordion.Root>

	<div class="mt-4 flex justify-between">
		<button
			class="button rounded bg-blue-500 px-4 py-2 text-white"
			onclick={() => applyFilters(maxPrice, selectedthemes)}
		>
			Apply
		</button>
		<button class="button rounded bg-gray-300 px-4 py-2 text-black" onclick={resetFilters}>
			Reset
		</button>
	</div>
</div>
