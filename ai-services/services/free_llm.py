import requests
import os
from typing import Dict, List
import json

class GroqLLM:
    """FREE and FAST using Groq API"""
    
    def __init__(self):
        self.api_key = os.getenv('GROQ_API_KEY', '')
        if not self.api_key:
            print("WARNING: GROQ_API_KEY not set!")
        
        self.api_url = "https://api.groq.com/openai/v1/chat/completions"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
    
    def query(self, messages: List[Dict], model: str = "mixtral-8x7b-32768", max_tokens: int = 1000) -> str:
        """Query Groq API - FREE and FAST!"""
        
        if not self.api_key:
            return "Error: GROQ_API_KEY not configured. Please set it in environment variables."
        
        payload = {
            "model": model,
            "messages": messages,
            "temperature": 0.7,
            "max_tokens": max_tokens
        }
        
        try:
            response = requests.post(
                self.api_url, 
                headers=self.headers, 
                json=payload, 
                timeout=30
            )
            response.raise_for_status()
            result = response.json()
            return result['choices'][0]['message']['content']
        
        except requests.exceptions.RequestException as e:
            print(f"Groq API Error: {str(e)}")
            if hasattr(e, 'response') and e.response is not None:
                print(f"Response: {e.response.text}")
            return f"Error querying LLM: {str(e)}"