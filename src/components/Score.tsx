type ScoreProps = {
  scoreA: number;
  scoreB: number;
};

const Score: React.FC<ScoreProps> = ({ scoreA, scoreB }) => {
  return (
      <div 
      style={{
        fontSize: '2em',
        fontWeight: 'bold',
        marginBottom: '0.5em',
      }}
    >
        <span>{scoreA}</span>-<span>{scoreB}</span>
      </div>
  );
}

export { Score };
