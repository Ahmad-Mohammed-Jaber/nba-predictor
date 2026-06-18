import { useState, useEffect } from "react";
import api from "../configs/api.config";

interface Team {
  id: string;
  name: string;
  full_name: string;
  abbreviation: string;
  logo: string | null;
}

interface Game {
  game_id: string;
  home_team: Team;
  visitor_team: Team;
  date: string;
}

const useGames = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setIsLoading(true);
        const res = await api.get("/games");
        setGames(res.data);
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to fetch games");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, []);

  return { games, isLoading, error };
};

export default useGames;
