import os
from openai import OpenAI
from typing import List, Dict

class ChatAssistant:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        self.system_prompt = """
You are CareerCraft AI, an intelligent career assistant. You help users with:
- Resume optimization
- Job search strategies
- Interview preparation
- Career advice
- Application materials

Be helpful, encouraging, and provide actionable advice. Keep responses concise but informative.
"""
    
    async def chat(self, message: str, history: List[Dict] = []) -> str:
        """Chat with the AI assistant"""
        
        messages = [
            {"role": "system", "content": self.system_prompt}
        ]
        
        # Add conversation history
        messages.extend(history[-10:])  # Keep last 10 messages
        
        # Add current message
        messages.append({"role": "user", "content": message})
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=messages,
                temperature=0.7,
                max_tokens=500
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            raise Exception(f"Chat failed: {str(e)}")