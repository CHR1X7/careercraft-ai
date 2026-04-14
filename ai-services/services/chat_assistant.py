from typing import List, Dict
from services.free_llm import GroqLLM

class ChatAssistant:
    def __init__(self):
        self.llm = GroqLLM()
        self.system_prompt = """You are CareerCraft AI, a helpful career assistant. You help users with:
- Resume optimization and feedback
- Job search strategies and tips
- Interview preparation
- Career advice and guidance
- Application materials (cover letters, etc.)

Be encouraging, professional, and provide actionable advice. Keep responses concise (under 200 words) but informative."""
    
    async def chat(self, message: str, history: List[Dict] = []) -> str:
        """Chat with the AI assistant"""
        
        messages = [
            {"role": "system", "content": self.system_prompt}
        ]
        
        # Add last 6 messages from history (to stay within token limits)
        messages.extend(history[-6:])
        
        # Add current message
        messages.append({"role": "user", "content": message})
        
        try:
            response = self.llm.query(messages, max_tokens=400)
            return response.strip()
            
        except Exception as e:
            print(f"Chat error: {str(e)}")
            return "I'm here to help with your job search! I can assist with resume optimization, interview preparation, and career advice. How can I help you today?"