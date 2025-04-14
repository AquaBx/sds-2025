<script lang="ts">
  import type { Place } from '$lib/types';
  export let place: Place;

  let expanded = false;

  function toggle() {
    expanded = !expanded;
  }

  function close() {
    expanded = false;
  }
</script>

<style>
  .card {
    border: 1px solid #ccc;
    border-radius: 12px;
    padding: 1rem;
    margin: 1rem auto;
    max-width: 800px;
    display: flex;
    gap: 1rem;
    background: #fdfdfd;
    box-shadow: 0 4px 8px rgba(0,0,0,0.08);
  }

  .image {
    flex-shrink: 0;
    width: 240px;
    height: 160px;
    overflow: hidden;
    border-radius: 10px;
    cursor: pointer;
  }

  .image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.3s ease;
  }

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .name {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.3rem;
  }

  .theme {
    font-size: 1rem;
    color: #666;
    margin-bottom: 0.5rem;
  }

  .description {
    font-size: 0.95rem;
    color: #333;
    line-height: 1.4;
  }

  /* Fullscreen modal */
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    cursor: pointer;
  }

  .overlay img {
    max-width: 90%;
    max-height: 90%;
    border-radius: 12px;
    box-shadow: 0 0 20px rgba(0,0,0,0.4);
  }
</style>

<div class="card">
  <div class="image" on:click={toggle}>
    <img src={place.picture[0]?.url} alt={place.name} />
  </div>
  <div class="content">
    <div class="name">{place.name}</div>
    <div class="theme">{place.theme}</div>
    <div class="description">{place.description}</div>
  </div>
</div>

{#if expanded}
  <div class="overlay" on:click={close}>
    <img src={place.picture[0]?.url} alt={place.name} />
  </div>
{/if}
