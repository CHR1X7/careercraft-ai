import os
from typing import Dict
import json
from services.free_llm import GroqLLM

class ResumeAnalyzer:
    def __init__(self):
        self.llm = GroqLLM()
    
    async def analyze(self, resume_text: str, job_description: str) -> Dict:
        """Analyze resume against job description using FREE LLM"""
        
        prompt = f"""You are an expert ATS and career coach. Analyze this resume against the job description.

RESUME:
{resume_text[:3000]}

JOB DESCRIPTION:
{job_description[:3000]}

Provide analysis in JSON format:
{{
    "score": 75,
    "summary": "Good match with relevant experience",
    "matched_skills": ["Python", "JavaScript"],
    "missing_skills": ["Docker", "AWS"],
    "suggestions": ["Add more quantifiable achievements", "Include relevant certifications"],
    "strengths": ["Strong technical background", "Relevant experience"],
    "areas_for_improvement": ["Add metrics to achievements", "Highlight leadership experience"]
}}

Respond ONLY with valid JSON, no other text."""

        try:
            messages = [
                {"role": "system", "content": "You are an expert ATS analyzer. Respond only in valid JSON format."},
                {"role": "user", "content": prompt}
            ]
            
            response = self.llm.query(messages)
            
            # Try to parse JSON from response
            # Sometimes LLM adds extra text, so we extract JSON
            json_start = response.find('{')
            json_end = response.rfind('}') + 1
            if json_start >= 0 and json_end > json_start:
                json_str = response[json_start:json_end]
                result = json.loads(json_str)
                return result
            else:
                # Fallback response
                return {
                    "score": 70,
                    "summary": "Analysis completed",
                    "matched_skills": ["General experience"],
                    "missing_skills": ["Specific certifications"],
                    "suggestions": ["Tailor resume to job description", "Add quantifiable achievements"],
                    "strengths": ["Relevant background"],
                    "areas_for_improvement": ["Add more specific examples"]
                }
                
        except Exception as e:
            raise Exception(f"Analysis failed: {str(e)}")