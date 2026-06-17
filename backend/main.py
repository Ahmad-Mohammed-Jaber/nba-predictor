from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from nba_api.stats.static import teams
from routers.games import router as games_router
from routers.auth import router as auth_router
from routers.teams import router as teams_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/test")
async def test():
    return teams.get_teams()

app.include_router(games_router)
app.include_router(auth_router)
app.include_router(teams_router)
