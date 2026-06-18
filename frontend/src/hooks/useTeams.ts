import { useState, useEffect } from "react";
import api from "../configs/api.config";

interface Team {
  id: number;
  nba_api_id: string;
  name: string;
  full_name: string;
  abbreviation: string;
  conference: string;
  division: string;
  team_logo: string;
  is_favorite: boolean;
}

const useTeams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setIsLoading(true);
        const res = await api.get("/teams");
        setTeams(res.data);
      } catch (err: any) {
        setError(err.response?.data?.detail || "Failed to fetch teams");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeams();
  }, []);

  return { teams, setTeams, isLoading, error };
};

export default useTeams;