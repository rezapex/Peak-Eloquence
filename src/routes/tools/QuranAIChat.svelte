<script>
	let messages = [];
	let userInput = '';
	let isLoading = false;

	async function handleSubmit() {
		if (!userInput.trim()) return;

		const userMessage = {
			role: 'user',
			content: userInput
		};

		messages = [...messages, userMessage];
		const currentInput = userInput;
		userInput = '';
		isLoading = true;

		try {
			// Simulated AI response for now - replace with actual API call
			await new Promise(resolve => setTimeout(resolve, 1000));
			const aiResponse = {
				role: 'assistant',
				content: `I apologize, but the AI chat feature is currently under development. Your question was: "${currentInput}"`
			};
			messages = [...messages, aiResponse];
		} catch (error) {
			messages = [...messages, {
				role: 'system',
				content: 'Sorry, there was an error processing your request. Please try again.'
			}];
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="chat-container">
	<div class="messages" class:loading={isLoading}>
		{#if messages.length === 0}
			<div class="welcome-message">
				<p>Welcome! Ask any questions about the Quran and Islamic teachings.</p>
				<p class="disclaimer">Note: This is an AI assistant. For religious guidance, please consult with qualified scholars.</p>
			</div>
		{:else}
			{#each messages as message}
				<div class="message {message.role}">
					<div class="content">
						{message.content}
					</div>
				</div>
			{/each}
		{/if}
		{#if isLoading}
			<div class="message assistant">
				<div class="content loading">
					<span class="dot"></span>
					<span class="dot"></span>
					<span class="dot"></span>
				</div>
			</div>
		{/if}
	</div>

	<form on:submit|preventDefault={handleSubmit} class="input-form">
		<input
			type="text"
			bind:value={userInput}
			placeholder="Type your question about the Quran..."
			disabled={isLoading}
		/>
		<button type="submit" disabled={isLoading || !userInput.trim()}>
			Send
		</button>
	</form>
</div>

<style>
	.chat-container {
		display: flex;
		flex-direction: column;
		height: 500px;
		background: #f8f9fa;
		border-radius: 8px;
		overflow: hidden;
	}

	.messages {
		flex-grow: 1;
		overflow-y: auto;
		padding: 1rem;
	}

	.welcome-message {
		text-align: center;
		color: #666;
		padding: 2rem;
	}

	.disclaimer {
		font-size: 0.8rem;
		color: #999;
		margin-top: 1rem;
	}

	.message {
		margin-bottom: 1rem;
		display: flex;
		flex-direction: column;
	}

	.message.user {
		align-items: flex-end;
	}

	.message.assistant {
		align-items: flex-start;
	}

	.content {
		max-width: 80%;
		padding: 0.75rem 1rem;
		border-radius: 1rem;
		line-height: 1.4;
	}

	.user .content {
		background: var(--color-theme-1);
		color: white;
		border-bottom-right-radius: 0.25rem;
	}

	.assistant .content {
		background: white;
		color: #333;
		border-bottom-left-radius: 0.25rem;
	}

	.system .content {
		background: #fff3cd;
		color: #856404;
		text-align: center;
		margin: 0 auto;
	}

	.content.loading {
		display: flex;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
	}

	.dot {
		width: 8px;
		height: 8px;
		background: #666;
		border-radius: 50%;
		animation: bounce 1.4s infinite ease-in-out;
	}

	.dot:nth-child(1) { animation-delay: -0.32s; }
	.dot:nth-child(2) { animation-delay: -0.16s; }

	@keyframes bounce {
		0%, 80%, 100% { transform: scale(0); }
		40% { transform: scale(1); }
	}

	.input-form {
		display: flex;
		gap: 0.5rem;
		padding: 1rem;
		background: white;
		border-top: 1px solid #eee;
	}

	input {
		flex-grow: 1;
		padding: 0.75rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 1rem;
	}

	input:disabled {
		background: #f8f9fa;
	}

	button {
		padding: 0.75rem 1.5rem;
		background: var(--color-theme-1);
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		cursor: pointer;
		transition: opacity 0.2s;
	}

	button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	button:not(:disabled):hover {
		opacity: 0.9;
	}
</style>