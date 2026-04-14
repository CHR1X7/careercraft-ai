import requests
import os
from typing import Dict, List

class FreeLLMService:
    """Free LLM using Hugging Face Inference API"""
    
    def __init__(self):
        self.api_key = os.getenv('HUGGINGFACE_API_KEY', '')
        self.api_url = "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1"
        self.headers = {"Authorization": f"Bearer {self.api_key}"}
    
    def query(self, prompt: str, max_tokens: int = 500) -> str:
        """Query the free LLM"""
        payload = {
            "inputs": prompt,
            "parameters": {
                "max_new_tokens": max_tokens,
                "temperature": 0.7,
                "top_p": 0.95,
                "return_full_text": False
            }
        }
        
        try:
            response = requests.post(self.api_url, headers=self.headers, json=payload, timeout=30)
            response.raise_for_status()
            result = response.json()
            
            if isinstance(result, list) and len(result) > 0:
                return result[0].get('generated_text', '')
            return str(result)
        except Exception as e:
            return f"Error: {str(e)}"

# Alternative: Use Groq (COMPLETELY FREE and FAST!)
class GroqLLM:
    """FREE and FAST using Groq API"""
    
    def __init__(self):
        self.api_key = os.getenv('GROQ_API_KEY', '')
        self.api_url = "https://api.groq.com/openai/v1/chat/completions"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
    
    def query(self, messages: List[Dict], model: str = "mixtral-8x7b-32768") -> str:
        """Query Groq API - FREE and FAST!"""
        payload = {
            "model": model,
            "messages": messages,
            "temperature": 0.7,
            "max_tokens": 1000
        }
        
        try:
            response = requests.post(self.api_url, headers=self.headers, json=payload, timeout=30)
            response.raise_for_status()
            result = response.json()
            return result['choices'][0]['message']['content']
        except Exception as e:
            return f"Error: {str(e)}"