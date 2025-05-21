<script lang="ts">
	import { enhance } from '$app/forms';
	import * as Accordion from '$lib/components/ui/accordion';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Slider } from '$lib/components/ui/slider';
	import { handler } from '$lib/FormHandle';

	let maxPrice = $state(50);
	let selectedtags = $state([]);
	let hoursRange = $state([0, 24]);

	let { tags } = $props();
</script>

<form class="flex flex-col gap-4 items-center w-full" use:enhance={handler} method="post" action="?/search">
	<Input name="search" type="text" placeholder="Search for a place (name, theme, etc...)" class="input w-full" />

	<h2 class="text-lg font-semibold">Filters</h2>
	<label>
		Maximum Price: {maxPrice}
        <input type="hidden" name="maxPrice" value={maxPrice} >
		<Slider  type="single" min={0} max={100} step={1} bind:value={maxPrice} />
	</label>

	<label>
		Opening hours: {hoursRange[0]}:00 - {hoursRange[1]}:00
        <input type="hidden" name="hourRange" value={hoursRange} >
		<Slider type="multiple" min={0} max={24} step={1} bind:value={hoursRange} />
	</label>

	<Accordion.Root class="w-full">
		<Accordion.Item value="item-1">
			<Accordion.Trigger>Themes</Accordion.Trigger>
			<Accordion.Content>
				<fieldset class="flex flex-col gap-1">
					{#each tags as tag}
						<label>
							<input name="tags" type="checkbox" bind:group={selectedtags} value={tag.id} />
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

	<Button type="submit">Search</Button>
</form>
