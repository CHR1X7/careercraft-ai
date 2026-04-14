import requests
from bs4 import BeautifulSoup
from typing import Dict
import re

class JobScraper:
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    
    async def scrape(self, url: str) -> Dict:
        """Scrape job description from URL"""
        try:
            response = requests.get(url, headers=self.headers, timeout=15)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Remove unwanted elements
            for element in soup(['script', 'style', 'nav', 'footer', 'header', 'aside', 'iframe']):
                element.decompose()
            
            # Extract text
            text = soup.get_text(separator='\n', strip=True)
            
            # Clean text
            lines = [line.strip() for line in text.split('\n') if line.strip()]
            text = '\n'.join(lines)
            
            # Limit length
            if len(text) > 5000:
                text = text[:5000] + "..."
            
            # Try to extract title
            title = soup.find('h1')
            title_text = title.get_text(strip=True) if title else "Job Position"
            
            # Try to extract company
            company_selectors = [
                soup.find('span', class_=re.compile('company', re.I)),
                soup.find('div', class_=re.compile('company', re.I)),
                soup.find('a', class_=re.compile('company', re.I)),
            ]
            company = next((c.get_text(strip=True) for c in company_selectors if c), "Company Name")
            
            return {
                'title': title_text,
                'company': company,
                'description': text,
                'url': url
            }
            
        except Exception as e:
            print(f"Scraping error: {str(e)}")
            return {
                'title': 'Job Position',
                'company': 'Company',
                'description': 'Could not scrape job description. Please paste the description manually.',
                'url': url,
                'error': str(e)
            }