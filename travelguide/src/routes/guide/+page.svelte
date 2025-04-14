<script lang="ts">
  import { onMount } from 'svelte';
  import type { Place } from '$lib/types';
  import PlaceCard from '$lib/components/PlaceCard.svelte';

  let itinerary: { place: Place; from: string; to: string }[] = [];

  onMount(async () => {
    const searchParams = new URLSearchParams(window.location.search);
    const interests = searchParams.getAll('interest');
    const budget = Number(searchParams.get('budget'));
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    const res = await fetch('/api/guide', {
      method: 'POST',
      body: JSON.stringify({ interests, budget, start, end })
    });

    const data = await res.json();
    itinerary = data.itinerary;
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

  .slot {
    margin-bottom: 2rem;
  }

  .time-range {
    font-size: 1.1rem;
    font-weight: bold;
    color: #444;
    margin-bottom: 0.5rem;
  }
</style>

<div class="container">
  <h1>Your Travel Itinerary</h1>

  {#if itinerary.length > 0}
    {#each itinerary as stop}
      <div class="slot">
        <div class="time-range">{stop.from} – {stop.to}</div>
        <PlaceCard place={stop.place} />
      </div>
    {/each}
  {:else}
    <p style="text-align:center">No matching places found for the selected time and budget.</p>
  {/if}
</div>
