from sqlalchemy import Column, Integer, String, Enum
from sqlalchemy.orm import column_property
from .base import Base
import enum

class NBAConference(enum.Enum):
    EAST = "East"
    WEST = "West"

class NBADivision(enum.Enum):
    ATLANTIC = "Atlantic"
    CENTRAL = "Central"
    SOUTHEAST = "Southeast"
    NORTHWEST = "Northwest"
    PACIFIC = "Pacific"
    SOUTHWEST = "Southwest"

class Team(Base):
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, index=True)
    nba_api_id = column_property(id + 1610612736)
    name = Column(String(50), nullable=False, unique=True)
    full_name = Column(String(50), nullable=False, unique=True)
    abbreviation = Column(String(5), nullable=False, unique=True)
    city = Column(String(50), nullable=False, unique=True)
    conference = Column(Enum(NBAConference), nullable=False)
    division = Column(Enum(NBADivision), nullable=False)
    team_logo = Column(String(100))

