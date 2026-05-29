import json
from database.session import SessionLocal
from database.models.team import Team, NBAConference, NBADivision

def seed_teams():
    db = SessionLocal()
    try:
        with open("response-get-teams.json", "r") as f:
            data = json.load(f)
            teams_data = data.get("data", [])

        for team_json in teams_data:
            # Convert strings to Enum members
            conference = NBAConference(team_json["conference"])
            division = NBADivision(team_json["division"])

            team = Team(
                id=team_json["id"],
                name=team_json["name"],
                full_name=team_json["full_name"],
                abbreviation=team_json["abbreviation"],
                city=team_json["city"],
                conference=conference,
                division=division,
                team_logo=team_json.get("logo_url")
            )
            db.merge(team) # Use merge to avoid duplicates if id exists

        db.commit()
        print(f"Successfully seeded {len(teams_data)} teams.")
    except Exception as e:
        print(f"Error seeding teams: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_teams()
