from fastapi import FastAPI
from nba_api.stats.static import teams
from routers.games import router as games_router
from routers.auth import router as auth_router
from routers.teams import router as teams_router
from nba_api.stats.static import teams

app = FastAPI()

@app.get("/test")
async def test():
    return teams.get_teams()

app.include_router(games_router)
app.include_router(auth_router)
app.include_router(teams_router)
