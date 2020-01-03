# eslint-disable-next-line
from bs4 import BeautifulSoup
import requests

scrape_url = "https://toronto.craigslist.org/d/apts-housing-for-rent/search/apa"

response = requests.get(scrape_url)
content = BeautifulSoup(response.content, "html.parser")

print(content)
#print("Hello world")