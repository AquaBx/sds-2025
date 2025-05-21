<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Input } from '$lib/components/ui/input';
	import { Slider } from '$lib/components/ui/slider';
	import { handler } from '$lib/FormHandle';
	import { searchFormdata } from '$lib/store.svelte';
</script>

<form
	class="flex flex-col gap-4 items-stretch w-full"
	use:enhance={handler}
	method="post"
	action="?/search"
>
	<Input
		name="search"
		type="text"
		placeholder="Search for a place (name, theme, etc...)"
		class="input w-full"
		bind:value={searchFormdata.search}
	/>

	{#each searchFormdata.tags as tag}
		<label for={tag.id}>
			<Checkbox id={tag.id} bind:checked={tag.selected} name="tags" />
			{tag.text}
		</label>
	{/each}

	<label>
		Maximum Price: {searchFormdata.maxPrice}
		<input type="hidden" name="maxPrice" value={searchFormdata.maxPrice} />
		<Slider type="single" min={0} max={100} step={1} bind:value={searchFormdata.maxPrice} />
	</label>

	<label>
		Opening hours: {searchFormdata.hoursRange[0]}:00 - {searchFormdata.hoursRange[1]}:00
		<input type="hidden" name="hourRange" value={searchFormdata.hoursRange} />
		<Slider type="multiple" min={0} max={24} step={1} bind:value={searchFormdata.hoursRange} />
	</label>

	<Button type="submit">Search</Button>
</form>
