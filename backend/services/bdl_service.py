import httpx
import os
from datetime import date, timedelta
from typing import List, Dict, Any
from dotenv import load_dotenv

load_dotenv()

BDL_API_KEY = os.getenv("BDL_API_KEY")
BASE_URL = "https://api.balldontlie.io/nba/v1/games"

async def get_games_for_next_3_days() -> List[Dict[str, Any]]:
    """Fetch all NBA games for today and the next 2 days using Ball Don't Lie API."""
    if not BDL_API_KEY:
        raise ValueError("BDL_API_KEY not found in environment variables")

    # Calculate dates for today and the next 2 days
    today = date.today() - timedelta(days=100)
    dates = [(today + timedelta(days=i)).isoformat() for i in range(3)]

    headers = {"Authorization": BDL_API_KEY}
    params = {"dates[]": dates}

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(BASE_URL, headers=headers, params=params)
            response.raise_for_status()
            data = response.json()
            return data.get("data", [])
        except httpx.HTTPStatusError as e:
            print(f"HTTP error occurred: {e}")
            return []
        except Exception as e:
            print(f"An unexpected error occurred: {e}")
            return []
