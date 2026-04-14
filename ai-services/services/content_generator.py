import os
from typing import Dict
from services.free_llm import GroqLLM

class ContentGenerator:
    def __init__(self):
        self.llm = GroqLLM()
    
    async def generate_answer(
        self, 
        job_description: str, 
        question: str, 
        user_profile: Dict
    ) -> str:
        """Generate tailored answer using FREE LLM"""
        
        prompt = f"""You are a career coach. Help write a compelling answer.

JOB DESCRIPTION:
{job_description[:2000]}

USER SKILLS: {', '.join(user_profile.get('skills', [])[:10])}

QUESTION: {question}

Write a professional 150-word answer that highlights relevant skills and shows enthusiasm. Write ONLY the answer, no additional commentary."""

        try:
            messages = [
                {"role": "system", "content": "You are a professional career coach."},
                {"role": "user", "content": prompt}
            ]
            
            response = self.llm.query(messages)
            return response.strip()
            
        except Exception as e:
            return f"I'm excited about this opportunity because it aligns with my skills and career goals. My experience in the field has prepared me well for this role, and I'm eager to contribute to the team's success."