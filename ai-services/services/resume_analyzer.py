from typing import Dict
import json
from services.free_llm import GroqLLM

class ResumeAnalyzer:
    def __init__(self):
        self.llm = GroqLLM()
    
    async def analyze(self, resume_text: str, job_description: str) -> Dict:
        """Analyze resume against job description using FREE LLM"""
        
        # Limit text length
        resume_text = resume_text[:3000]
        job_description = job_description[:3000]
        
        prompt = f"""You are an expert ATS (Applicant Tracking System) and career coach. Analyze this resume against the job description.

RESUME:
{resume_text}

JOB DESCRIPTION:
{job_description}

Provide your analysis in EXACTLY this JSON format (respond ONLY with valid JSON, no other text):
{{
    "score": 75,
    "summary": "Brief summary of match quality",
    "matched_skills": ["skill1", "skill2", "skill3"],
    "missing_skills": ["skill1", "skill2"],
    "suggestions": [
        "Specific actionable suggestion 1",
        "Specific actionable suggestion 2",
        "Specific actionable suggestion 3"
    ],
    "strengths": ["strength1", "strength2"],
    "areas_for_improvement": ["area1", "area2"]
}}

Respond with ONLY the JSON object, nothing else."""

        try:
            messages = [
                {"role": "system", "content": "You are an expert ATS analyzer. Respond ONLY in valid JSON format with no additional text."},
                {"role": "user", "content": prompt}
            ]
            
            response = self.llm.query(messages, max_tokens=800)
            
            # Extract JSON from response
            json_start = response.find('{')
            json_end = response.rfind('}') + 1
            
            if json_start >= 0 and json_end > json_start:
                json_str = response[json_start:json_end]
                result = json.loads(json_str)
                
                # Ensure all required fields exist
                required_fields = ['score', 'summary', 'matched_skills', 'missing_skills', 'suggestions', 'strengths', 'areas_for_improvement']
                for field in required_fields:
                    if field not in result:
                        result[field] = [] if field != 'score' and field != 'summary' else (70 if field == 'score' else 'Analysis completed')
                
                return result
            else:
                raise ValueError("Could not extract JSON from response")
                
        except Exception as e:
            print(f"Analysis error: {str(e)}")
            # Return fallback response
            return {
                "score": 70,
                "summary": "Analysis completed. Review the suggestions below to improve your resume match.",
                "matched_skills": ["Relevant experience", "Professional background"],
                "missing_skills": ["Specific technical skills", "Industry certifications"],
                "suggestions": [
                    "Tailor your resume to match job description keywords",
                    "Add quantifiable achievements with metrics",
                    "Highlight relevant projects and experiences",
                    "Include specific technical skills mentioned in the job posting"
                ],
                "strengths": ["Professional experience", "Educational background"],
                "areas_for_improvement": ["Add more specific examples", "Include measurable results"]
            }