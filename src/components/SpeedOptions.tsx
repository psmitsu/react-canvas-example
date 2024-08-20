import { useId } from "react";

type SpeedOptionsProps = {
  // hero speed
  minSpeed: number;
  maxSpeed: number;
  heroSpeed: number;
  onHeroSpeedChange: (value: number) => void;
  // shot rate
  minShotRate: number;
  maxShotRate: number;
  shotRate: number;
  onShotRateChange: (value: number) => void;
};

const SpeedOptions: React.FC<SpeedOptionsProps> = ({
  minSpeed,
  maxSpeed,
  heroSpeed,
  onHeroSpeedChange,
  minShotRate,
  maxShotRate,
  shotRate,
  onShotRateChange,
}) => {
  const id = useId();

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
    }}
    >
      <label htmlFor={`speed-${id}`}>Hero Speed:</label>
      <input
        type="range"
        id={`speed-${id}`}
        min={minSpeed}
        max={maxSpeed}
        value={heroSpeed}
        onChange={(e) => onHeroSpeedChange(parseInt(e.target.value, 10))}
      />

      <label htmlFor={`rate-${id}`}>Frames/Shot:</label>
      <input
        type="range"
        id={`rate-${id}`}
        min={minShotRate}
        max={maxShotRate}
        value={shotRate}
        onChange={(e) => onShotRateChange(parseInt(e.target.value, 10))}
      />
    </div>
  );
};

export { SpeedOptions };
