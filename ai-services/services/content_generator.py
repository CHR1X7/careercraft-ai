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
        
        # Limit lengths
        job_description = job_description[:2000]
        skills = user_profile.get('skills', [])[:10]
        
        prompt = f"""You are a professional career coach helping a job applicant write a compelling answer.

JOB DESCRIPTION:
{job_description}

CANDIDATE SKILLS: {', '.join(skills) if skills else 'General professional experience'}

QUESTION TO ANSWER:
{question}

Write a professional, compelling answer (150-200 words) that:
1. Directly answers the question
2. Highlights relevant skills
3. Shows genuine enthusiasm
4. Uses specific examples when possible
5. Matches the job requirements

Write ONLY the answer text, no additional commentary or labels."""

        try:
            messages = [
                {"role": "system", "content": "You are a professional career coach. Write concise, compelling answers."},
                {"role": "user", "content": prompt}
            ]
            
            response = self.llm.query(messages, max_tokens=400)
            return response.strip()
            
        except Exception as e:
            print(f"Answer generation error: {str(e)}")
            return "I am excited about this opportunity because it aligns perfectly with my professional background and career goals. My experience has equipped me with the skills necessary to excel in this role, and I am eager to contribute to the team's success. I am particularly drawn to this position because it offers the chance to apply my expertise while continuing to grow professionally."
    
    async def generate_cover_letter(
        self,
        job_description: str,
        user_profile: Dict
    ) -> str:
        """Generate a tailored cover letter"""
        
        job_description = job_description[:2000]
        
        prompt = f"""Write a professional cover letter for this job.

JOB DESCRIPTION:
{job_description}

CANDIDATE PROFILE:
Skills: {', '.join(user_profile.get('skills', [])[:10])}
Experience: {user_profile.get('experience', 'Professional experience in the field')}

The cover letter should:
1. Be 3-4 paragraphs
2. Show genuine interest
3. Highlight relevant skills
4. Be professional and engaging
5. Include a strong opening and closing

Write ONLY the cover letter text."""

        try:
            messages = [
                {"role": "system", "content": "You are a professional career coach writing cover letters."},
                {"role": "user", "content": prompt}
            ]
            
            response = self.llm.query(messages, max_tokens=600)
            return response.strip()
            
        except Exception as e:
            print(f"Cover letter generation error: {str(e)}")
            return "Dear Hiring Manager,\n\nI am writing to express my strong interest in this position. My background and experience make me an excellent fit for this role.\n\nI am confident that my skills and enthusiasm would make me a valuable addition to your team.\n\nThank you for your consideration.\n\nSincerely"