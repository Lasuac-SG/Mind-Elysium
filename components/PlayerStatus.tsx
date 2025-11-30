
import React from 'react';

interface Props {
  physique: number;
  psyche: number;
}

const PlayerStatus: React.FC<Props> = ({ physique, psyche }) => {
  const maxStat = 6; // Assuming a max stat value for bar calculation
  const physiquePercentage = (physique / maxStat) * 100;
  const psychePercentage = (psyche / maxStat) * 100;

  return (
    <div className="player-status-hud">
      <div className="status-bars">
        <div className="bar-container">
          <div className="bar physique" style={{ width: `${physiquePercentage}%` }}></div>
          <span className="bar-divider" style={{ left: '33.33%' }}></span>
          <span className="bar-divider" style={{ left: '66.66%' }}></span>
        </div>
        <div className="bar-container">
          <div className="bar psyche" style={{ width: `${psychePercentage}%` }}></div>
          <span className="bar-divider" style={{ left: '33.33%' }}></span>
          <span className="bar-divider" style={{ left: '66.66%' }}></span>
        </div>
      </div>
      <div className="avatar">
        {/* Using a stylized avatar that fits the Disco Elysium theme */}
        <img src="https://i.imgur.com/6234S0L.png" alt="Player Avatar" className="w-full h-full object-cover" />
      </div>
    </div>
  );
};

export default PlayerStatus;
