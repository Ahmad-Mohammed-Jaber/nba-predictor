import useGames from "../hooks/useGames";
import GameCard from "../components/GameCard";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorMessage from "../components/ui/ErrorMessage";

function Home() {
  const { games, isLoading, error } = useGames();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Upcoming Games</h1>
        <p className="text-gray-600">Predict the winners of the next few NBA matchups.</p>
      </header>

      {isLoading && <LoadingSpinner />}

      {error && <ErrorMessage message={error} />}

      {!isLoading && !error && games.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No upcoming games found for the next 3 days.
        </div>
      )}

      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <GameCard key={game.game_id} game={game} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;

