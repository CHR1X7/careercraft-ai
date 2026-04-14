from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv

from services.scraper import JobScraper
from services.resume_analyzer import ResumeAnalyzer
from services.content_generator import ContentGenerator
from services.chat_assistant import ChatAssistant

load_dotenv()

app = FastAPI(title="CareerCraft AI Services")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
scraper = JobScraper()
resume_analyzer = ResumeAnalyzer()
content_generator = ContentGenerator()
chat_assistant = ChatAssistant()

# Request Models
class ResumeAnalysisRequest(BaseModel):
    resume_text: str
    job_url: str

class AnswerGenerationRequest(BaseModel):
    job_description: str
    question: str
    user_profile: dict

class ChatRequest(BaseModel):
    message: str
    conversation_history: Optional[List[dict]] = []

# Routes
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/api/scrape-job")
async def scrape_job(job_url: str):
    try:
        job_data = await scraper.scrape(job_url)
        return job_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze-resume")
async def analyze_resume(request: ResumeAnalysisRequest):
    try:
        # Scrape job description
        job_data = await scraper.scrape(request.job_url)
        
        # Analyze resume
        analysis = await resume_analyzer.analyze(
            resume_text=request.resume_text,
            job_description=job_data['description']
        )
        
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-answer")
async def generate_answer(request: AnswerGenerationRequest):
    try:
        answer = await content_generator.generate_answer(
            job_description=request.job_description,
            question=request.question,
            user_profile=request.user_profile
        )
        return {"answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        response = await chat_assistant.chat(
            message=request.message,
            history=request.conversation_history
        )
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)