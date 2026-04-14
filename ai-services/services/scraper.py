import requests
from bs4 import BeautifulSoup
from typing import Dict
import re

class JobScraper:
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
    
    async def scrape(self, url: str) -> Dict:
        """Scrape job description from URL"""
        try:
            response = requests.get(url, headers=self.headers, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Remove unwanted elements
            for element in soup(['script', 'style', 'nav', 'footer', 'header']):
                element.decompose()
            
            # Extract text
            text = soup.get_text(separator='\n', strip=True)
            
            # Clean text
            text = re.sub(r'\n+', '\n', text)
            text = re.sub(r'\s+', ' ', text)
            
            # Try to extract title
            title = soup.find('h1')
            title_text = title.get_text(strip=True) if title else "Job Position"
            
            # Try to extract company
            company_patterns = [
                soup.find('span', class_=re.compile('company', re.I)),
                soup.find('div', class_=re.compile('company', re.I)),
            ]
            company = next((c.get_text(strip=True) for c in company_patterns if c), "Company")
            
            return {
                'title': title_text,
                'company': company,
                'description': text,
                'url': url
            }
            
        except Exception as e:
            raise Exception(f"Failed to scrape job: {str(e)}")