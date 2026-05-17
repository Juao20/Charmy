from groq import Groq
from django.conf import settings

class AIClient:
    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY)

    def chat(self, messages: list, temperature: float = 0.8) -> str:
        response = self.client.chat.completions.create(
            model='llama-3.3-70b-versatile',
            messages=messages,
            temperature=temperature,
            max_tokens=1500,
        )
        return response.choices[0].message.content