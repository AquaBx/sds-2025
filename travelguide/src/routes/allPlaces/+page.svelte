<script lang="ts">
  import { onMount } from 'svelte';
  import type { Place } from '$lib/types';
  import PlaceCard from '$lib/components/PlaceCard.svelte';

  let allPlaces: Place[] = [];

  onMount(async () => {
    const res = await fetch('/api/places');
    const data = await res.json();
    allPlaces = data.places;
  });
</script>

<style>
  .container {
    max-width: 1000px;
    margin: 2rem auto;
    padding: 1rem;
  }

  h1 {
    text-align: center;
    font-size: 2rem;
    margin-bottom: 2rem;
  }
</style>

<div class="container">
  <h1>All Places in Poznań</h1>
  {#each allPlaces as place}
    <PlaceCard {place} />
  {/each}
</div>
