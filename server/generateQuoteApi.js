import fs from 'fs';
import path from 'path';

const allowedLanguages = {
  ko: 'Korean',
  en: 'English',
  ja: 'Japanese',
  zh: 'Simplified Chinese',
  es: 'Spanish',
};

function readOpenAiApiKey() {
  const envPath = path.join(process.cwd(), '.env');

  try {
    const envText = fs.readFileSync(envPath, 'utf8');
    const keyLine = envText
      .split(/\r?\n/)
      .find((line) => line.startsWith('OPENAI_API_KEY='));

    if (!keyLine) {
      return '';
    }

    return keyLine.slice('OPENAI_API_KEY='.length).trim().replace(/^["']|["']$/g, '');
  } catch (error) {
    return '';
  }
}

function sendJson(response, statusCode, data) {
  response.statusCode = statusCode;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.end(JSON.stringify(data));
}

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    let bodyText = '';

    request.on('data', (chunk) => {
      bodyText += chunk;
    });

    request.on('end', () => {
      resolve(bodyText);
    });

    request.on('error', reject);
  });
}

function createQuoteApiPlugin() {
  return {
    name: 'quote-api',
    configureServer(server) {
      server.middlewares.use('/api/generate-quote', async (request, response) => {
        if (request.method !== 'POST') {
          sendJson(response, 405, { message: 'POST 요청만 사용할 수 있어요.' });
          return;
        }

        const apiKey = readOpenAiApiKey();

        if (!apiKey) {
          sendJson(response, 500, {
            message: '.env 파일에 OPENAI_API_KEY를 입력한 뒤 다시 시도해 주세요.',
          });
          return;
        }

        let requestData = {};

        try {
          const bodyText = await readRequestBody(request);
          requestData = bodyText ? JSON.parse(bodyText) : {};
        } catch (error) {
          sendJson(response, 400, { message: '요청 형식이 올바르지 않아요.' });
          return;
        }

        const languageCode = requestData.language;
        const languageName = allowedLanguages[languageCode];
        const topic = typeof requestData.topic === 'string' ? requestData.topic.trim() : '';

        if (!languageName) {
          sendJson(response, 400, { message: '지원하지 않는 언어예요.' });
          return;
        }

        const topicGuide = topic
          ? `The quote should be about this theme: ${topic}.`
          : 'The quote should express a meaningful human value such as love, courage, humility, hope, or wisdom.';

        try {
          const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              temperature: 0.8,
              messages: [
                {
                  role: 'system',
                  content:
                    'You generate famous-style quotes from respected historical figures or Christian philosophers. Reply with JSON only.',
                },
                {
                  role: 'user',
                  content: `Write one original-sounding quote in ${languageName}. ${topicGuide} Use a real well-known person as the author. Return JSON like {"quote":"...","author":"..."}. The quote and author must both be written in ${languageName}.`,
                },
              ],
            }),
          });

          const openAiData = await openAiResponse.json();

          if (!openAiResponse.ok) {
            sendJson(response, 500, {
              message: 'GPT API 호출에 실패했어요. API 키를 확인해 주세요.',
            });
            return;
          }

          const contentText = openAiData.choices?.[0]?.message?.content || '';
          const jsonText = contentText.replace(/```json|```/g, '').trim();
          const generatedQuote = JSON.parse(jsonText);

          if (!generatedQuote.quote || !generatedQuote.author) {
            throw new Error('incomplete quote');
          }

          sendJson(response, 200, {
            quote: String(generatedQuote.quote),
            author: String(generatedQuote.author),
          });
        } catch (error) {
          sendJson(response, 500, {
            message: '명언을 만들지 못했어요. 잠시 후 다시 시도해 주세요.',
          });
        }
      });
    },
  };
}

export default createQuoteApiPlugin;
