<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import { Slider } from '$lib/components/ui/slider/index.js';

	let { applyFilters, resetFilters, tags } = $props();
	let maxPrice = $state(50);
	let selectedtags = $state([]);
	let hoursRange = $state([0, 24]);
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

		<Slider type="single" min={0} max={100} step={1} bind:value={maxPrice} />
	</label>

	<label>
		Opening hours: {hoursRange[0]}:00 - {hoursRange[1]}:00
		<Slider type="multiple" min={0} max={24} step={1} bind:value={hoursRange} />
	</label>

	<Accordion.Root class="w-full">
		<Accordion.Item value="item-1">
			<Accordion.Trigger>Themes</Accordion.Trigger>
			<Accordion.Content>
				<fieldset class="flex flex-col gap-1">
					{#each tags as tag}
						<label>
							<input type="checkbox" bind:group={selectedtags} value={tag.id} />
							{tag.text}
						</label>
					{/each}
				</fieldset>
			</Accordion.Content>
		</Accordion.Item>
		<Accordion.Item value="item-2">
			<Accordion.Trigger>Categories</Accordion.Trigger>
			<Accordion.Content></Accordion.Content>
		</Accordion.Item>
	</Accordion.Root>

	<div class="mt-4 flex justify-between">
		<button
			class="button rounded bg-blue-500 px-4 py-2 text-white"
			onclick={() => applyFilters(maxPrice, selectedtags, hoursRange)}
		>
			Apply
		</button>
		<button class="button rounded bg-gray-300 px-4 py-2 text-black" onclick={resetFilters}>
			Reset
		</button>
	</div>
</div>

<style>
	:root {
		--range-slider: rgb(209 213 219);
		--range-handle: rgb(59 130 246);
		--range-handle-focus: rgb(59 130 246);
		--range-handle-inactive: rgb(59 130 246);
		--range-range-inactive: rgb(59 130 246);
		--range-range: rgb(59 130 246);
	}
</style>
