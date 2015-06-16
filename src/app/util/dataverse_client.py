import requests

DATAVERSE_API_BASE = "https://apitest.dataverse.org/api/{}"

API_TOKEN = "YOUR TOKEN HERE"


def find_dataset(search_string):
    SEARCH_URL = DATAVERSE_API_BASE.format('search')

    params = {
        'q': search_string,
        'key': API_TOKEN
    }

    result = requests.get(SEARCH_URL, params=params)

    return result.content
