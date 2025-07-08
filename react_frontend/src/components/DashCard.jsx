export default function ProjectCard({ title, team, timeLeft, progress, members }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md w-full max-w-xs">
      <h3 className="font-semibold text-lg mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{team}</p>
      <p className="text-xs text-gray-400">{timeLeft}</p>
      <div className="mt-3 flex -space-x-2">
        {members.map((src, idx) => (
          <img key={idx} src={src} alt="member" className="w-8 h-8 rounded-full border-2 border-white" />
        ))}
      </div>
      <div className="mt-3 text-xs text-gray-500">Progress</div>
      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
        <div
          className="bg-blue-500 h-2 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
