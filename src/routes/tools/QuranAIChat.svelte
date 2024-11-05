<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let messages = [];
	let userInput = '';
	let isLoading = false;
	let currentResponse = '';
	let selectedLanguage = 'en';
	let isListening = false;
	let recognition;
	let bookmarks = [];
	let notes = {};
	let searchFilters = {
		type: 'all',
		language: 'en'
	};
	let selectedProvider = 'openai';

	const languages = [
		{ code: 'en', name: 'English' },
		{ code: 'ar', name: 'العربية' },
		{ code: 'ur', name: 'اردو' },
		{ code: 'id', name: 'Bahasa Indonesia' },
		{ code: 'tr', name: 'Türkçe' }
	];

	const providers = [
		{ id: 'openai', name: 'GPT-4 Turbo' },
		{ id: 'openrouter', name: 'Claude-2' },
		{ id: 'mistral', name: 'Mistral-7B' },
		{ id: 'llama', name: 'Llama-2-70B' },
		{ id: 'mixtral', name: 'Mixtral-8x7B' }
	];

	const suggestedPrompts = [
		{
			category: 'General',
			prompts: [
				'What is the main message of Surah Al-Fatiha?',
				'Explain the concept of Tawakkul in Islam',
				'Tell me about the importance of Ramadan'
			]
		},
		{
			category: 'Stories',
			prompts: [
				'Tell me the story of Prophet Yusuf (AS)',
				'What lessons can we learn from Prophet Musa (AS)?',
				'Explain the story of the People of the Cave'
			]
		},
		{
			category: 'Guidance',
			prompts: [
				'How can I improve my concentration in prayer?',
				'What does the Quran say about patience?',
				'Verses about dealing with anxiety and stress'
			]
		}
	];

	onMount(() => {
		const savedBookmarks = localStorage.getItem('quran-ai-bookmarks');
		const savedNotes = localStorage.getItem('quran-ai-notes');
		if (savedBookmarks) bookmarks = JSON.parse(savedBookmarks);
		if (savedNotes) notes = JSON.parse(savedNotes);

		if ('webkitSpeechRecognition' in window) {
			recognition = new webkitSpeechRecognition();
			recognition.continuous = false;
			recognition.interimResults = false;
			recognition.lang = 'en-US';

			recognition.onresult = (event) => {
				const transcript = event.results[0][0].transcript;
				userInput = transcript;
				handleSubmit();
			};

			recognition.onend = () => {
				isListening = false;
			};
		}
	});

	function usePrompt(prompt) {
		userInput = prompt;
		handleSubmit();
	}

	function toggleVoiceInput() {
		if (!recognition) return;

		if (isListening) {
			recognition.stop();
		} else {
			recognition.start();
			isListening = true;
		}
	}

	function toggleBookmark(messageIndex) {
		const messageId = `${messages[messageIndex].role}-${messageIndex}`;
		const bookmarkIndex = bookmarks.indexOf(messageId);
		
		if (bookmarkIndex === -1) {
			bookmarks = [...bookmarks, messageId];
		} else {
			bookmarks = bookmarks.filter(id => id !== messageId);
		}
		
		localStorage.setItem('quran-ai-bookmarks', JSON.stringify(bookmarks));
	}

	function saveNote(messageIndex, note) {
		const messageId = `${messages[messageIndex].role}-${messageIndex}`;
		notes = { ...notes, [messageId]: note };
		localStorage.setItem('quran-ai-notes', JSON.stringify(notes));
	}

	async function handleSubmit() {
		if (!userInput.trim()) return;

		const userMessage = {
			role: 'user',
			content: userInput,
			language: selectedLanguage
		};

		messages = [...messages, userMessage];
		userInput = '';
		isLoading = true;
		currentResponse = '';

		try {
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					messages: messages,
					filters: searchFilters,
					language: selectedLanguage,
					provider: selectedProvider
				})
			});

			if (!response.ok) throw new Error('Failed to get response');

			const reader = response.body.getReader();
			const decoder = new TextDecoder();

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				const chunk = decoder.decode(value);
				currentResponse += chunk;
				messages = [
					...messages.slice(0, -1),
					{
						role: 'assistant',
						content: currentResponse,
						language: selectedLanguage
					}
				];
			}
		} catch (error) {
			messages = [...messages, {
				role: 'system',
				content: 'Sorry, there was an error processing your request. Please try again.'
			}];
		} finally {
			isLoading = false;
			currentResponse = '';
		}
	}
</script>

<div class="chat-container">
	<div class="toolbar">
		<select bind:value={selectedProvider} class="provider-select">
			{#each providers as provider}
				<option value={provider.id}>{provider.name}</option>
			{/each}
		</select>
		<select bind:value={selectedLanguage} class="language-select">
			{#each languages as lang}
				<option value={lang.code}>{lang.name}</option>
			{/each}
		</select>
		<div class="filters">
			<select bind:value={searchFilters.type} class="filter-select">
				<option value="all">All Content</option>
				<option value="verses">Verses Only</option>
				<option value="translations">Translations</option>
				<option value="tafsir">Tafsir</option>
			</select>
		</div>
	</div>

	<div class="messages" class:loading={isLoading} transition:fade>
		{#if messages.length === 0}
			<div class="welcome-message">
				<h2>Quran AI Assistant</h2>
				<p>Ask questions about the Quran, search for verses, or explore interpretations.</p>
				
				<div class="suggested-prompts">
					{#each suggestedPrompts as category}
						<div class="prompt-category">
							<h3>{category.category}</h3>
							<div class="prompt-list">
								{#each category.prompts as prompt}
									<button 
										class="prompt-btn"
										on:click={() => usePrompt(prompt)}
									>
										{prompt}
									</button>
								{/each}
							</div>
						</div>
					{/each}
				</div>

				<div class="features">
					<div class="feature">
						<span class="icon">🔍</span>
						<span>Search verses and translations</span>
					</div>
					<div class="feature">
						<span class="icon">🌍</span>
						<span>Multiple languages supported</span>
					</div>
					<div class="feature">
						<span class="icon">🎤</span>
						<span>Voice commands available</span>
					</div>
					<div class="feature">
						<span class="icon">📝</span>
						<span>Take notes and bookmark responses</span>
					</div>
				</div>
				<p class="model-info">
					Now featuring multiple AI models including GPT-4, Claude-2, Mistral, and more!
				</p>
				<p class="disclaimer">Note: This is an AI assistant. For religious guidance, please consult with qualified scholars.</p>
			</div>
		{:else}
			{#each messages as message, i}
				<div class="message {message.role}" transition:fade>
					<div class="message-header">
						<span class="role">{message.role === 'user' ? 'You' : 'Assistant'}</span>
						<div class="message-actions">
							<button
								class="action-btn bookmark"
								class:active={bookmarks.includes(`${message.role}-${i}`)}
								on:click={() => toggleBookmark(i)}
								title="Bookmark"
							>
								★
							</button>
							<button
								class="action-btn note"
								class:has-note={notes[`${message.role}-${i}`]}
								on:click={() => {
									const note = prompt('Add a note:', notes[`${message.role}-${i}`] || '');
									if (note !== null) saveNote(i, note);
								}}
								title="Add Note"
							>
								📝
							</button>
						</div>
					</div>
					<div class="content">
						{message.content}
					</div>
					{#if notes[`${message.role}-${i}`]}
						<div class="note-display">
							📝 {notes[`${message.role}-${i}`]}
						</div>
					{/if}
				</div>
			{/each}
		{/if}
		{#if isLoading && !currentResponse}
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
			placeholder="Ask about the Quran..."
			disabled={isLoading}
		/>
		<button
			type="button"
			class="voice-btn"
			on:click={toggleVoiceInput}
			class:active={isListening}
			disabled={!recognition}
		>
			🎤
		</button>
		<button type="submit" disabled={isLoading || !userInput.trim()}>
			Send
		</button>
	</form>
</div>

<style>
	.chat-container {
		display: flex;
		flex-direction: column;
		height: 600px;
		background: #f8f9fa;
		border-radius: 8px;
		overflow: hidden;
	}

	.toolbar {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		background: white;
		border-bottom: 1px solid #eee;
	}

	.language-select,
	.filter-select,
	.provider-select {
		padding: 0.5rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		background: white;
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

	.suggested-prompts {
		margin: 2rem 0;
	}

	.prompt-category {
		margin-bottom: 1.5rem;
	}

	.prompt-category h3 {
		color: var(--color-theme-1);
		margin-bottom: 1rem;
	}

	.prompt-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		justify-content: center;
	}

	.prompt-btn {
		background: white;
		border: 1px solid var(--color-theme-1);
		color: var(--color-theme-1);
		padding: 0.5rem 1rem;
		border-radius: 20px;
		cursor: pointer;
		transition: all 0.2s;
		font-size: 0.9rem;
	}

	.prompt-btn:hover {
		background: var(--color-theme-1);
		color: white;
	}

	.model-info {
		margin: 1rem 0;
		color: var(--color-theme-1);
		font-weight: bold;
	}

	.features {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
		margin: 2rem 0;
	}

	.feature {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem;
		background: white;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
	}

	.icon {
		font-size: 1.5rem;
	}

	.message {
		margin-bottom: 1rem;
	}

	.message-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}

	.role {
		font-size: 0.9rem;
		color: #666;
	}

	.message-actions {
		display: flex;
		gap: 0.5rem;
	}

	.action-btn {
		background: none;
		border: none;
		padding: 0.25rem;
		cursor: pointer;
		opacity: 0.6;
		transition: opacity 0.2s;
	}

	.action-btn:hover,
	.action-btn.active,
	.action-btn.has-note {
		opacity: 1;
	}

	.content {
		padding: 1rem;
		border-radius: 8px;
		line-height: 1.5;
		white-space: pre-wrap;
	}

	.user .content {
		background: var(--color-theme-1);
		color: white;
	}

	.assistant .content {
		background: white;
	}

	.note-display {
		margin-top: 0.5rem;
		padding: 0.5rem;
		background: #fff3cd;
		border-radius: 4px;
		font-size: 0.9rem;
	}

	.content.loading {
		display: flex;
		gap: 0.5rem;
		justify-content: center;
		padding: 0.5rem;
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

	.voice-btn {
		padding: 0.75rem;
		background: none;
		border: 1px solid #ddd;
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.2s;
	}

	.voice-btn.active {
		background: var(--color-theme-1);
		color: white;
		border-color: var(--color-theme-1);
	}

	.voice-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	button[type="submit"] {
		padding: 0.75rem 1.5rem;
		background: var(--color-theme-1);
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		cursor: pointer;
		transition: opacity 0.2s;
	}

	button[type="submit"]:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	button:not(:disabled):hover {
		opacity: 0.9;
	}

	@media (max-width: 640px) {
		.features {
			grid-template-columns: 1fr;
		}

		.toolbar {
			flex-direction: column;
			gap: 0.5rem;
		}

		.prompt-list {
			flex-direction: column;
		}

		.prompt-btn {
			width: 100%;
		}
	}
</style>