from fastapi import APIRouter, HTTPException, Depends
from services.bdl_service import get_games_for_next_3_days
from utils.redis_client import get_cached_data, set_cached_data
from services.auth_service import get_current_user
from sqlalchemy import select
from sqlalchemy.orm import Session

from database.session import get_db
from database.models.team import Team

router = APIRouter(
    prefix="/games",
    tags=["games"]
)

CACHE_KEY_NEXT_3_DAYS = "nba_games_next_3_days"
CACHE_TTL = 900  # 15 minutes in seconds

@router.get("/")
async def get_games(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    """Fetch all games for the next 3 days with 15-minute Redis caching and team logos."""
    # 1. Try to get from cache
    cached_data = await get_cached_data(CACHE_KEY_NEXT_3_DAYS)
    if cached_data is not None:
        games_data = cached_data
    else:
        # 2. Cache miss: fetch from BDL API
        try:
            games_data = await get_games_for_next_3_days()
            # 3. Store in cache for future requests
            await set_cached_data(CACHE_KEY_NEXT_3_DAYS, games_data, CACHE_TTL)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching games: {str(e)}")

    # 4. Fetch all teams from DB to map logos efficiently
    teams_stmt = select(Team.id, Team.team_logo)
    logos_rows = db.execute(teams_stmt).mappings().all()
    logo_map = {row["id"]: row["team_logo"] for row in logos_rows}

    return [
        {
            "game_id": game.get("id"),
            "home_team": {
                **game.get("home_team", {}),
                "logo": logo_map.get(game.get("home_team", {}).get("id")),
            },
            "visitor_team": {
                **game.get("visitor_team", {}),
                "logo": logo_map.get(game.get("visitor_team", {}).get("id")),
            },
            "date": game.get("date"),
        }
        for game in games_data
    ]
