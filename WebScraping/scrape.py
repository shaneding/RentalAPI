# eslint-disable-next-line
from bs4 import BeautifulSoup
import requests

# establishing connection to mysql database
import mysql.connector
rental_database = mysql.connector.connect(
    host = "practice.cdodof3lyshn.us-east-1.rds.amazonaws.com",
    user = "admin",
    password = "shane200195"
)
cursor = rental_database.cursor()

scrape_url = "https://toronto.craigslist.org/search/apa?s=240"

response = requests.get(scrape_url)
content = BeautifulSoup(response.content, "html.parser")

listings = content.body.find(id="page-top").find(id="sortable-results").ul.find_all("a", attrs={"class":"result-image"})

price = []
address = []

for i, content in enumerate(listings):
    try:
        # retreiving the current price
        current_price = content.span.string[1:]
        
        # now accessing the posting page to retreive the address
        post_url = content['href']
        new_content = BeautifulSoup(requests.get(post_url).content, "html.parser")

        # traversing the dom to reach the longitude/latitude
        post_loc = new_content.body.find(id="map")
        latitude = float(post_loc["data-latitude"])
        longitude = float(post_loc["data-longitude"])


    except:
        # if we can't find the price, or longitude and latitude, we simply move onto the next posting
        continue

    price.append(int(current_price))
    address.append([latitude, longitude])
    #sql_query = "INSERT INTO RentalData.Data (Price, Longitude, Latitude) VALUES (%(Price), %(Longitude), %(Latitude))", {"Price": int(current_price), "Longitude": longitude, "latitude": latitude}
    cursor.execute("INSERT INTO RentalData.Data (Price, Longitude, Latitude, Rooms) VALUES (%s, %s, %s, %s)", (current_price, longitude, latitude, 0))

rental_database.commit()
print(price)
print(address)


#print("Hello world")