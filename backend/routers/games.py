from fastapi import APIRouter, HTTPException, Depends
from services.bdl_service import get_games_for_next_3_days
from utils.redis_client import get_cached_data, set_cached_data
from services.auth_service import get_current_user

router = APIRouter(
    prefix="/games",
    tags=["games"]
)

CACHE_KEY_NEXT_3_DAYS = "nba_games_next_3_days"
CACHE_TTL = 900  # 15 minutes in seconds

@router.get("/")
async def get_games(current_user: dict = Depends(get_current_user)):
    """Fetch all games for the next 3 days with 15-minute Redis caching."""
    # 1. Try to get from cache
    cached_data = await get_cached_data(CACHE_KEY_NEXT_3_DAYS)
    if cached_data is not None:
        games = cached_data
    else:
        # 2. Cache miss: fetch from BDL API
        try:
            games = await get_games_for_next_3_days()

            # 3. Store in cache for future requests
            await set_cached_data(CACHE_KEY_NEXT_3_DAYS, games, CACHE_TTL)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching games: {str(e)}")

    return [
        {
            "game_id": game.get("id"),
            "home_team": game.get("home_team"),
            "visitor_team": game.get("visitor_team"),
            "date": game.get("date"),
        }
        for game in games
    ]
    
    