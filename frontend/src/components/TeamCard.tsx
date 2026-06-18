interface Team {
  id: number;
  name: string;
  abbreviation: string;
  division: string;
  conference: string;
  team_logo: string | null;
  is_favorite: boolean;
}

interface TeamCardProps {
  team: Team;
  onToggleFavorite: (teamId: number) => void;
}

const TeamCard = ({ team, onToggleFavorite }: TeamCardProps) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4 hover:shadow-md transition-all">
      <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full overflow-hidden">
        {team.team_logo ? (
          <img src={team.team_logo} alt={team.abbreviation} className="w-full h-full object-scale-down" />
        ) : (
          <span className="text-gray-400 font-bold">{team.abbreviation}</span>
        )}
      </div>

      <div className="flex-grow">
        <h3 className="font-bold text-gray-800 leading-tight">{team.name}</h3>
        <p className="text-xs text-gray-500">{team.division} | {team.conference}</p>
      </div>

      <button
        onClick={() => onToggleFavorite(team.id)}
        className={`p-2 rounded-full transition-colors ${team.is_favorite ? 'text-yellow-500 bg-yellow-50' : 'text-gray-400 hover:bg-gray-100'}`}
        aria-label={team.is_favorite ? "Remove from favorites" : "Add to favorites"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill={team.is_favorite ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
        </svg>
      </button>
    </div>
  );
};

export default TeamCard;