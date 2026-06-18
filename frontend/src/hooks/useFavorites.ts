import { useState } from "react";
import api from "../configs/api.config";

interface Team {
  id: number;
  is_favorite: boolean;
}

const useFavorites = (teams: Team[], setTeams: React.Dispatch<React.SetStateAction<Team[]>>) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const toggleFavorite = async (teamId: number) => {
    setError(null);

    // 1. Find the team and its current state
    const team = teams.find(t => t.id === teamId);
    if (!team) return;

    const wasFavorite = team.is_favorite;

    // 2. Optimistic Update
    setTeams(prevTeams =>
      prevTeams.map(t => t.id === teamId ? { ...t, is_favorite: !wasFavorite } : t)
    );

    try {
      setIsLoading(true);
      if (wasFavorite) {
        await api.delete(`/teams/favorites/${teamId}`);
      } else {
        await api.post(`/teams/favorites/${teamId}`);
      }
    } catch (err: any) {
      // 3. Rollback on failure
      setTeams(prevTeams =>
        prevTeams.map(t => t.id === teamId ? { ...t, is_favorite: wasFavorite } : t)
      );
      const errorMessage = err.response?.data?.detail || "An error occurred while updating favorites";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    toggleFavorite,
    isLoading,
    error,
  };
};

export default useFavorites;