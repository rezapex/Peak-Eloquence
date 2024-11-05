import { OPENROUTER_API_KEY, OPENROUTER_URL, OPENAI_API_KEY, OPENAI_URL } from '$lib/config';

export async function POST({ request }) {
	const stream = new ReadableStream({
		async start(controller) {
			try {
				const { messages, filters, language, provider = 'openai' } = await request.json();

				const enhancedSystemMessage = {
					role: 'system',
					content: `You are a knowledgeable Islamic scholar and Quran expert. Provide accurate, respectful answers based on authentic sources. Always cite specific verses and reliable references.

Key instructions:
- Prioritize accuracy and authenticity in responses
- Include original Arabic text when quoting verses
- Provide multiple authentic translations when relevant
- Include brief tafsir (interpretation) when needed
- Cite reliable sources and scholars
- Maintain respectful, academic tone
- If unsure, acknowledge limitations
- Current language: ${language}
- Content filter: ${filters.type}`
				};

				const apiConfig = {
					openai: {
						url: OPENAI_URL,
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${OPENAI_API_KEY}`
						},
						body: {
							model: 'gpt-4-turbo-preview',
							messages: [enhancedSystemMessage, ...messages],
							temperature: 0.7,
							max_tokens: 1000,
							stream: true
						}
					},
					openrouter: {
						url: OPENROUTER_URL,
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
							'HTTP-Referer': 'https://quran-reader.stackblitz.io',
							'X-Title': 'Quran Reader'
						},
						body: {
							model: 'anthropic/claude-2',
							messages: [enhancedSystemMessage, ...messages],
							temperature: 0.7,
							max_tokens: 1000,
							stream: true
						}
					}
				};

				const config = apiConfig[provider];
				const response = await fetch(config.url, {
					method: 'POST',
					headers: config.headers,
					body: JSON.stringify(config.body)
				});

				if (!response.ok) {
					throw new Error(`Failed to get AI response from ${provider}`);
				}

				const reader = response.body.getReader();
				const decoder = new TextDecoder();

				while (true) {
					const { done, value } = await reader.read();
					if (done) break;

					const chunk = decoder.decode(value);
					const lines = chunk.split('\n');

					for (const line of lines) {
						if (line.startsWith('data: ')) {
							const data = line.slice(6);
							if (data === '[DONE]') continue;

							try {
								const parsed = JSON.parse(data);
								const content = parsed.choices[0]?.delta?.content || '';
								if (content) {
									controller.enqueue(content);
								}
							} catch (e) {
								console.error('Failed to parse chunk:', e);
							}
						}
					}
				}
			} catch (error) {
				console.error('AI Chat Error:', error);
				controller.enqueue('Sorry, there was an error processing your request.');
			} finally {
				controller.close();
			}
		}
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			'Connection': 'keep-alive'
		}
	});
}