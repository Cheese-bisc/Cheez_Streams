import { useState } from "react";

const TEAM_COLORS = {
  "Red Bull": "#1e5bc6",
  Ferrari: "#e8002d",
  Mercedes: "#27f4d2",
  McLaren: "#ff8700",
  "Aston Martin": "#00594f",
  Alpine: "#ff87bc",
  Williams: "#64c4ff",
  Haas: "#b6b6b6",
  Sauber: "#52e252",
  "Racing Bulls": "#6692ff",
  Cadillac: "#0060ff",
};

function DriverPhoto({ driverId, code, familyName, teamName }) {
  const [failed, setFailed] = useState(false);
  const teamColor = TEAM_COLORS[teamName] || "#555";
  const imgName = (familyName || driverId || "").toLowerCase();
  if (failed) {
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        style={{ background: teamColor }}
      >
        <span className="text-3xl font-bold text-white/80">
          {code ? code.slice(0, 2) : "--"}
        </span>
      </div>
    );
  }
  return (
    <img
      src={`${import.meta.env.BASE_URL}assets/drivers/${imgName}.webp`}
      alt={code || driverId}
      className="w-full h-full object-cover object-bottom scale-[1.25] origin-bottom"
      onError={() => setFailed(true)}
    />
  );
}

function luminance(hex) {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = ((num >> 16) & 0xff) / 255;
  const g = ((num >> 8) & 0xff) / 255;
  const b = (num & 0xff) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export default function PodiumCard({ position, driver, constructor, points }) {
  const teamColor = TEAM_COLORS[constructor?.name] || "#555";
  const lastName = driver?.familyName || "";
  const nameColor = luminance(teamColor) > 0.5 ? "#000" : "#fff";
  const heightClass =
    position === 1
      ? "min-h-[280px] lg:min-h-[380px]"
      : "min-h-[240px] lg:min-h-[340px]";

  return (
    <div
      className={`relative flex flex-col w-full overflow-hidden ${heightClass}`}
      style={{
        clipPath: "polygon(28px 0, 100% 0, 100% 100%, 0 100%, 0 28px)",
      }}
    >
      <div
        className="absolute top-0 left-0 z-30 pointer-events-none"
        style={{
          width: 0,
          height: 0,
          borderTop: "28px solid rgba(0,0,0,0.55)",
          borderRight: "28px solid transparent",
        }}
      />

      <div
        className="relative flex-1 flex items-end justify-center overflow-hidden"
        style={{
          background: `linear-gradient(180deg, ${teamColor} 0%, #000000 60%)`,
        }}
      >
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundSize: "100px 100px",
          }}
        />

        <span
          className="absolute inset-0 flex items-center justify-center text-[140px] lg:text-[180px] font-black leading-none pointer-events-none select-none"
          style={{
            color: "rgba(255,255,255,0.40)",
            fontFamily: "system-ui, sans-serif",
            transform: "translate(-20%, -20%)",
          }}
        >
          {position}
        </span>

        <div className="absolute right-0 bottom-0 z-20">
          <div className="bg-black flex flex-col items-center justify-center w-10 h-10 lg:w-12 lg:h-12">
            <span className="text-yellow-400 text-sm lg:text-base font-black leading-none">
              {points}
            </span>
            <span className="text-yellow-400 text-[8px] lg:text-[10px] font-bold leading-none">
              PTS
            </span>
          </div>
        </div>

        <div className="relative z-10 w-full h-full">
          <DriverPhoto
            driverId={driver?.driverId}
            code={driver?.code}
            familyName={driver?.familyName}
            teamName={constructor?.name}
          />
        </div>
      </div>

      <div
        className="px-3 py-2.5 lg:px-4 lg:py-3"
        style={{ background: teamColor }}
      >
        <span
          className="text-sm lg:text-lg font-bold uppercase tracking-wide"
          style={{ color: nameColor }}
        >
          {lastName}
        </span>
      </div>
    </div>
  );
}
