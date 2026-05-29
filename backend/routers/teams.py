from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select, case


from database.session import get_db
from services.auth_service import get_current_user
from sqlalchemy.orm import Session

from database.models.team import Team
from database.models.user import UserTeam

router = APIRouter(
    prefix="/teams",
    tags=["teams"]
)

@router.get("/")
async def get_teams(user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    
    stmt = select(
            Team.id,
            Team.nba_api_id,
            Team.name,
            Team.full_name,
            Team.abbreviation,
            Team.conference,
            Team.division,
            Team.team_logo,
            case((UserTeam.user_id != None, True), else_=False).label("is_favorite")
        ).outerjoin(UserTeam, (Team.id == UserTeam.team_id) & (UserTeam.user_id == user.get('user_id')))
    
    teams = db.execute(stmt).mappings().all()
    return teams

@router.get("/favorites")
async def get_favorite_teams(user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    stmt = select(UserTeam).where(UserTeam.user_id == user.get('user_id'))
    teams = db.execute(stmt).scalars().all()
    return teams

@router.post("/favorites/{team_id}")
async def add_favorite_team(team_id: int, user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    if not (1 <= team_id <= 30):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Team ID must be between 1 and 30")

    user_id = user.get("user_id")
    
    existing = db.query(UserTeam).filter(UserTeam.user_id == user_id, UserTeam.team_id == team_id).first()
    if existing:
        return {"message": "Team already in favorites"}

    new_favorite = UserTeam(user_id=user_id, team_id=team_id) 
    db.add(new_favorite)
    db.commit()
    return {"message": "Team added to favorites"}

@router.delete("/favorites/{team_id}")
async def remove_favorite_team(team_id: int, user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    if not (1 <= team_id <= 30):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Team ID must be between 1 and 30")

    user_id = user.get('user_id')
    favorite = db.query(UserTeam).filter(UserTeam.user_id == user_id, UserTeam.team_id == team_id).first()
    if not favorite:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Favorite team not found")

    db.delete(favorite)
    db.commit()
    return {"message": "Team removed from favorites"}
