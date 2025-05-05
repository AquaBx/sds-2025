<script lang="ts">
    let { applyFilters, resetFilters} = $props();
    let maxPrice = $state(50);
    let selectedthemes = $state([]);
    const themes = ['Botanic Garden', 'ZOO', 'Football Stadium', 'Art', 'Military', 'Archeology', 'Nature', 'Shopping', 'Restaurant','Typical Food','Americain','Burger','Water','Indoor Climbing','Water'];

</script>

<div 
    onsubmit={(e) => {
        e.preventDefault();
        applyFilters(maxPrice);
    }}
    class="fixed top-8 right-8 z-20 w-64 rounded-lg bg-white p-4 shadow-lg"
>
    <h2 class="text-lg font-semibold">Filters</h2>
    <label>
        Maximum Price:
        <input
            type="number"
            bind:value={maxPrice}
            class="mt-2 w-full rounded border border-gray-300 p-2"
            min="0"
        />
    </label>
    <label class="mt-4">
        Themes:
        <fieldset class="flex flex-col gap-1 pl-4">
            {#each themes as theme}
                <label>
                    <input
                        type="checkbox"
                        bind:group={selectedthemes}
                        value={theme}
                        class="mr-2"
                    />
                    {theme}
                </label>
            {/each}
        </fieldset>
    <div class="flex justify-between mt-4">
        <button class="button bg-blue-500 text-white px-4 py-2 rounded" onclick={() => applyFilters(maxPrice, selectedthemes)}>
            Apply
        </button>
        <button class="button bg-gray-300 text-black px-4 py-2 rounded" onclick={resetFilters}>
            Reset
        </button>
    </div>
</div>