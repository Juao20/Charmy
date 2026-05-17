import httpx
from django.conf import settings

class GrokClient:
    def __init__(self):
        self.api_key = settings.GROK_API_KEY
        self.base_url = settings.GROK_API_URL
        self.headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json',
        }

    def chat(self, messages: list, temperature: float = 0.8) -> str:
        payload = {
            'model': 'grok-3',
            'messages': messages,
            'temperature': temperature,
            'max_tokens': 1500,
        }
        with httpx.Client(timeout=30.0) as client:
            response = client.post(
                f'{self.base_url}/chat/completions',
                headers=self.headers,
                json=payload,
            )
            response.raise_for_status()
            return response.json()['choices'][0]['message']['content']