<script lang="ts">
	import Button from '../components/ui/button/button.svelte';
	import Separator from '../components/ui/separator/separator.svelte';
	import Input from '../components/ui/input/input.svelte';
	import { guideFormdata } from '../store.svelte';
	import { enhance } from '$app/forms';
	import { handler } from '../FormHandle';
	import Toggle from '../components/ui/toggle/toggle.svelte';
	import DatePicker from '../components/DatePicker.svelte';
    import * as Select from '$lib/components/ui/select';
	import { access } from 'fs';
	import Label from '../components/ui/label/label.svelte';
	import Checkbox from '../components/ui/checkbox/checkbox.svelte';


    let name = '';
    let description = '';
    let address = '';
    let city = '';
    let picture: File | null = null;
    let openingTime = '';
    let closingTime = '';
    let price: number | '' = '';
    let currency: string = 'EUR';
    let estimateDuration: number | '' = '';
    let disableAccesibility: boolean = false;
    let tags: string[] = [];

    async function submitForm() {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('address', address);
        formData.append('city', city);
        formData.append('openingTime', openingTime);
        formData.append('closingTime', closingTime);
        // ...autres champs...
        tags.forEach(tag => formData.append('tags', tag));
        if (picture) formData.append('picture', picture);

        // Envoi vers ton backend (exemple avec fetch)
        await fetch('/api/activities', {
            method: 'POST',
            body: formData
        });
}
</script>

<form
	class="flex flex-col gap-4 items-center w-full max-h-[90vh] overflow-y-auto p-4"
	use:enhance={handler}
	method="post"
	action="?/guide"
>
	<h2 class="bold text-xl">Add a new activity</h2>

	<Separator class="my-2" />
    <h2 class="bold text-xl">Name</h2>
    <div class="flex gap-2 w-full">
		<Input name="name" class="" type="String" bind:value={name}></Input>
    </div>

    <h2 class="bold text-xl">Description</h2>
    <div class="flex gap-2 w-full">
		<Input name="description" class="" type="String" bind:value={description}></Input>
    </div>

	<Separator class="my-2" />
    <h2 class="bold text-xl">Address</h2>
    <div class="flex gap-2 w-full">
		<Input name="address" class="" type="String" bind:value={address}></Input>
    </div>

    <Separator class="my-2" />
    <h2 class="bold text-xl">City</h2>
    <div class="flex gap-2 w-full">
		<Input name="city" class="" type="String" bind:value={city}></Input>
    </div>

    <Separator class="my-2" />
    <h2 class="bold text-xl">Picture of the activity</h2>
    <div class="flex gap-2 w-full">
        <input
            type="file"
            accept="image/*"
            name="picture"
            on:change={(e) => picture = e.target.files[0]}
            class="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
        />
    </div>

    <Separator class="my-2" />
    <h2 class="bold text-xl">When is it open?</h2>
    <div class="flex gap-2 w-full">
        <div class="flex flex-col flex-1">
            <label class="text-sm font-semibold mb-1">Opening time</label>
            <input
                type="time"
                name="openingTime"
                bind:value={openingTime}
                class="input input-bordered rounded px-3 py-2"
                required
            />
        </div>
        <div class="flex flex-col flex-1">
            <label class="text-sm font-semibold mb-1">Closing time</label>
            <input
                type="time"
                name="closingTime"
                bind:value={closingTime}
                class="input input-bordered rounded px-3 py-2"
                required
            />
        </div>
    </div>

    <Separator class="my-2" />
    <h2 class="bold text-xl">How much does it cost?</h2>
    <div class="flex gap-2 w-full">
		<Input name="price" class="" type="number" bind:value={price}></Input>
		<Select.Root type="single" name="currency" bind:value={currency}>
			<Select.Trigger class="w-[180px]">
				{currency}
			</Select.Trigger>
			<Select.Content>
				<Select.Item value="EUR">Euro</Select.Item>
				<Select.Item value="PLN">Złoty</Select.Item>
				<Select.Item value="USD">US Dollar</Select.Item>
			</Select.Content>
		</Select.Root>
	</div>

    <Separator class="my-2" />
    <h2 class="bold text-xl">Duration</h2>
    <div class="flex gap-2 w-full">
		<Input name="duration" class="" type="number" bind:value={estimateDuration}></Input>
    </div>

    <Separator class="my-2" />
    <div class="flex gap-2 w-full flex-col">
		<Label>
			<Checkbox name="disability" bind:checked={disableAccesibility}></Checkbox>
			Accesible for the disable person
		</Label>
	</div>

    <Separator class="my-2" />
	<h2 class="bold text-xl">Which themes best match this activity?</h2>
	<div class="flex gap-2 w-full justify-center flex-wrap">
        {#each guideFormdata.tags as tagObj}
            <label for={tagObj.id}>
                <input
                    type="checkbox"
                    class="hidden"
                    name="tags"
                    value={tagObj.id}
                    id={tagObj.id}
                    checked={tags.includes(tagObj.id)}
                    on:change={() => {
                        if (tags.includes(tagObj.id)) {
                            tags = tags.filter(t => t !== tagObj.id);
                        } else {
                            tags = [...tags, tagObj.id];
                        }
                    }}
                />
                <Toggle pressed={tags.includes(tagObj.id)}>{tagObj.text}</Toggle>
            </label>
        {/each}
    </div>

	<Button type="submit">Add activity</Button>
</form>
