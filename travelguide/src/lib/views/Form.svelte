<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { Toggle } from '$lib/components/ui/toggle';
	import { Separator } from '$lib/components/ui/separator';
	import { getLocalTimeZone, today } from '@internationalized/date';
	import DatePicker from '$lib/components/DatePicker.svelte';
	import { enhance } from '$app/forms';
	import { handler } from '$lib/FormHandle';

	let { cities, tags, types } = $props();

	const start = today(getLocalTimeZone());
	const end = start.add({ days: 7 });

	let formdata = $state({
		tags: tags.map((tag) => {
			return { ...tag, selected: false };
		}),
		type: types.map((type) => {
			return { ...type, selected: false };
		}),
		dates: {
			start,
			end
		},
		destination: {
			id: '',
			name: ''
		},
		currency: 'EUR'
	});

</script>
<form
	class="flex flex-col gap-4 items-center w-full"
      use:enhance={handler} 
      method="post"
      action="?/guide"
>
	<h2 class="bold text-xl">Where do you want to go ?</h2>
	<div class="w-full">
		<Select.Root type="single" bind:value={formdata.destination}>
			<Select.Trigger>
				{formdata.destination.name}
			</Select.Trigger>
			<Select.Content>
				{#each cities as city}
					<Select.Item value={city}>{city.name}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	</div>
	<Separator class="my-2" />
	<h2 class="bold text-xl">What are you interested in ?</h2>
	<div class="flex gap-2 w-full justify-center flex-wrap">
		{#each formdata.tags as tag}
			<Toggle bind:pressed={tag.selected}>{tag.text}</Toggle>
		{/each}
	</div>
	<Separator class="my-2" />
	<h2 class="bold text-xl">When do you want to go ?</h2>
	<div class="w-full">
		<DatePicker bind:value={formdata.dates}></DatePicker>
	</div>
	<Separator class="my-2" />
	<h2 class="bold text-xl">What is you budget ?</h2>
	<div class="flex gap-2 w-full">
		<Input class="" type="number"></Input>
		<Select.Root type="single" bind:value={formdata.currency}>
			<Select.Trigger class="w-[180px]">
				{formdata.currency}
			</Select.Trigger>
			<Select.Content>
				<Select.Item value="EUR">Euro</Select.Item>
				<Select.Item value="PLN">Złoty</Select.Item>
				<Select.Item value="USD">US Dollar</Select.Item>
			</Select.Content>
		</Select.Root>
	</div>

	<Button type="submit">Generate Guide</Button>
</form>
