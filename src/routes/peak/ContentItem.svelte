<script>
	export let item;
	export let bookmarked = false;
	export let onBookmarkToggle;
</script>

<div class="item-card">
	<div class="item-header">
		<h3>{item.title}</h3>
		<button 
			class="bookmark-btn" 
			on:click={() => onBookmarkToggle(item.id)}
			class:active={bookmarked}
		>
			★
		</button>
	</div>
	<p class="arabic">{item.arabic}</p>
	<p class="translation">{item.translation}</p>
	<p class="content">{item.content}</p>
	<p class="reference">{item.reference}</p>
</div>

<style>
	.item-card {
		border: 1px solid #eee;
		border-radius: 8px;
		padding: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.item-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.item-header h3 {
		margin: 0;
		color: var(--color-theme-1);
	}

	.bookmark-btn {
		background: none;
		border: none;
		font-size: 1.5rem;
		color: #ddd;
		cursor: pointer;
		padding: 0;
		transition: color 0.2s;
	}

	.bookmark-btn.active {
		color: gold;
	}

	.arabic {
		font-size: 1.5rem;
		line-height: 2;
		margin: 1rem 0;
		direction: rtl;
		text-align: right;
	}

	.translation {
		color: #666;
		font-style: italic;
		margin: 0.5rem 0;
	}

	.content {
		margin: 1rem 0;
		line-height: 1.6;
	}

	.reference {
		color: #666;
		font-size: 0.9rem;
		text-align: right;
		margin: 1rem 0 0;
	}
</style>