
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

interface GameCardProps {
  game: Game;
}

const GameCard = ({ game }: GameCardProps) => {
  const gameDate = new Date(game.date).toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between gap-4 hover:shadow-md transition-shadow">
      <div className="text-sm text-gray-500 font-medium text-center">
        {gameDate}
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col items-center flex-1">
          <div className="w-12 h-12 mb-2 flex items-center justify-center">
            {game.visitor_team.logo ? (
              <img src={game.visitor_team.logo} alt={game.visitor_team.abbreviation} className="w-full h-full object-fill" />
            ) : (
              <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-400">
                {game.visitor_team.abbreviation}
              </div>
            )}
          </div>
          <span className="font-bold text-gray-800 text-center">{game.visitor_team.name}</span>
          <span className="text-xs text-gray-400">Visitor</span>
        </div>
        <div className="text-gray-400 font-bold">VS</div>
        <div className="flex flex-col items-center flex-1">
          <div className="w-12 h-12 mb-2 flex items-center justify-center">
            {game.home_team.logo ? (
              <img src={game.home_team.logo} alt={game.home_team.abbreviation} className="w-full h-full object-contain" />
            ) : (
              <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-400">
                {game.home_team.abbreviation}
              </div>
            )}
          </div>
          <span className="font-bold text-gray-800 text-center">{game.home_team.name}</span>
          <span className="text-xs text-gray-400">Home</span>
        </div>
      </div>
      <div className="flex justify-center">
        <button className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition-colors">
          Predict Winner
        </button>
      </div>
    </div>
  );

};

export default GameCard;
