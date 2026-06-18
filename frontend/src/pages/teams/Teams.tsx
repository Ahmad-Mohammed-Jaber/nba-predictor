import React from "react";
import useTeams from "../../hooks/useTeams";
import useFavorites from "../../hooks/useFavorites";

import TeamCard from "../../components/TeamCard";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorMessage from "../../components/ui/ErrorMessage";

const Teams = () => {
  const { teams, setTeams, isLoading, error: fetchError } = useTeams();
  const { toggleFavorite, error: favoriteError } = useFavorites(teams, setTeams);

  const sortedTeams = [...teams].sort((a, b) => {
    if (a.is_favorite && !b.is_favorite) return -1;
    if (!a.is_favorite && b.is_favorite) return 1;
    return 0;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">NBA Teams</h1>
        <p className="text-gray-600">View all teams and mark your favorites.</p>
      </header>

      {fetchError && <ErrorMessage message={fetchError} />}

      {favoriteError && <ErrorMessage message={favoriteError} />}

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedTeams.map((team) => (
            <TeamCard key={team.id} team={team} onToggleFavorite={async () => await toggleFavorite(team.id)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Teams;