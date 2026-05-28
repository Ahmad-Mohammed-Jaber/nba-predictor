from typing import Optional
from fastapi import APIRouter, HTTPException, Depends
from database.models.team import Team, NBAConference, NBADivision
from database.session import get_db
from services.auth_service import get_current_user
from sqlalchemy.orm import Session
from utils.redis_client import get_cached_data, set_cached_data

router = APIRouter(
    prefix="/teams",
    tags=["teams"]
)

@router.get("/")
async def get_teams(user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    teams = db.query(Team).all()
    return teams