import { OPENAI_API_KEY, OPENAI_URL } from '$lib/config';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { messages, filters, language } = await request.json();

        // Prepare system message based on filters and language
        const systemMessage = {
            role: 'system',
            content: `You are a knowledgeable Islamic AI assistant. Respond in ${language}. ${filters.type !== 'all' ? `Focus on ${filters.type} when relevant.` : ''} Always provide accurate information and cite sources when possible.`
        };

        const response = await fetch(OPENAI_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4-turbo-preview',
                messages: [systemMessage, ...messages],
                temperature: 0.7,
                stream: true
            })
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('API Response Error:', error);
            throw new Error(error || 'Failed to get response from OpenAI');
        }

        // Create a readable stream
        const stream = new ReadableStream({
            async start(controller) {
                const reader = response.body?.getReader();
                const decoder = new TextDecoder('utf-8');
                if (!reader) throw new Error('No response body');

                let buffer = '';
                let isStreamClosed = false;
                const timeout = setTimeout(() => {
                    if (!isStreamClosed) {
                        controller.error(new Error('Stream timeout'));
                    }
                }, 30000); // 30 seconds timeout

                try {
                    while (true) {
                        const { done, value } = await reader.read();

                        if (done) {
                            // Process any remaining buffer
                            if (buffer.trim()) {
                                processBuffer(buffer);
                            }
                            break;
                        }

                        buffer += decoder.decode(value, { stream: true });
                        const lines = buffer.split('\n');

                        // Keep the last potentially incomplete line in the buffer
                        buffer = lines.pop() || '';

                        for (const line of lines) {
                            processBuffer(line);
                        }
                    }
                } catch (error) {
                    console.error('Stream reading error:', error);
                    if (!isStreamClosed) {
                        controller.error(error);
                    }
                } finally {
                    clearTimeout(timeout);
                    isStreamClosed = true;
                    controller.close();
                    reader.releaseLock();
                }

                function processBuffer(line: string) {
                    if (isStreamClosed) return;

                    try {
                        line = line.trim();
                        if (!line || line.includes('[DONE]') || !line.startsWith('data: ')) return;

                        const data = JSON.parse(line.slice(6));
                        const content = data.choices[0].delta?.content;

                        if (content) {
                            controller.enqueue(content);
                        }
                    } catch (parseError) {
                        console.error('JSON parsing error:', parseError, 'for line:', line);
                    }
                }
            }
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'X-Accel-Buffering': 'no' // Disable buffering for Nginx
            }
        });
    } catch (error) {
        console.error('Chat API Error:', error);
        return json({
            error: error instanceof Error ? error.message : 'Failed to process request'
        }, { status: 500 });
    }
};
