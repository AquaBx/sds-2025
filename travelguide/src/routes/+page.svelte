<script lang="ts">
	export let data: any;
</script>

<div>
	<h1>My Blog</h1>
	<main>
		<div class="flex flex-wrap w-dvw">
			{#each data.feed as post (post.id)}
				<div class="flex-col flex w-64">
					<h1>
						{post.name}
					</h1>
					<img src={post.picture[0].url} alt={post.name} />
				</div>
			{/each}
		</div>
	</main>
</div>
