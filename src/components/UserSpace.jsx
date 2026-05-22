import { useState } from 'react';
import { useGameState } from '../state/gameState';
import { pairs } from '../logic/pairs';
import './UserSpace.css';

const UserSpace = ({ onBack }) => {
  const { score, foundPairIds } = useGameState();
  const [activeTab, setActiveTab] = useState('collection');

  const myCollection = pairs.filter(p => foundPairIds.includes(p.id));
  const remaining    = 21 - score;
  const progressPct  = Math.round((score / 21) * 100);

  const downloadCard = (pair) => {
    const canvas = document.createElement('canvas');
    const ctx    = canvas.getContext('2d');
    canvas.width  = 680;
    canvas.height = 420;

    // Fond
    ctx.fillStyle = '#F4F1EA';
    ctx.fillRect(0, 0, 680, 420);

    // Bandeau haut
    ctx.fillStyle = '#1A1A18';
    ctx.fillRect(0, 0, 680, 90);

    // Logo text
    ctx.fillStyle = '#F4F1EA';
    ctx.font = 'bold 22px Arial';
    ctx.fillText('STK ARCHITECTURE', 40, 38);
    ctx.font = '11px Arial';
    ctx.fillStyle = 'rgba(244,241,234,0.5)';
    ctx.fillText('FICHE D\'EXPLORATION BIOMIMÉTIQUE', 40, 62);

    // Badge CONNEXION
    ctx.fillStyle = '#3A593E';
    ctx.roundRect(40, 110, 160, 28, 14);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 10px Arial';
    ctx.fillText('✦ CONNEXION TROUVÉE', 56, 129);

    // Titre paire
    ctx.fillStyle = '#1A1A18';
    ctx.font = 'bold 26px Arial';
    ctx.fillText(`${pair.nature.nom}`, 40, 180);
    ctx.fillStyle = '#4A5D60';
    ctx.font = 'bold 26px Arial';
    ctx.fillText(`→  ${pair.application.nom}`, 40, 216);

    // Ligne séparatrice
    ctx.strokeStyle = 'rgba(26,26,24,0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(40, 240); ctx.lineTo(640, 240);
    ctx.stroke();

    // Explication
    ctx.fillStyle = 'rgba(26,26,24,0.65)';
    ctx.font = '14px Arial';
    const words = pair.explication.split(' ');
    let line = ''; let y = 270;
    words.forEach(word => {
      if ((line + word).length > 72) {
        ctx.fillText(line, 40, y);
        line = word + ' '; y += 22;
      } else { line += word + ' '; }
    });
    ctx.fillText(line, 40, y);

    // Pied de page
    ctx.fillStyle = 'rgba(26,26,24,0.3)';
    ctx.font = '11px Arial';
    ctx.fillText('STK Architecture — Explorer la nature pour inventer le futur', 40, 395);

    const link = document.createElement('a');
    link.download = `STK_${pair.id}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="us-root">

      {/* ── SIDEBAR ── */}
      <aside className="us-sidebar">
        <button className="us-back-btn" onClick={onBack}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Retour au jeu
        </button>

        <div className="us-sidebar-profile">
          <div className="us-avatar">
            {score >= 21 ? '✦' : score >= 10 ? '◈' : '○'}
          </div>
          <div className="us-profile-info">
            <span className="us-profile-rank">
              {score >= 21 ? 'MAÎTRE BIOMIMÉTISTE' :
               score >= 10 ? 'EXPLORATEUR CONFIRMÉ' :
               score >= 5  ? 'EXPLORATEUR' : 'NOVICE'}
            </span>
            <span className="us-profile-score">{score} / 21 paires</span>
          </div>
        </div>

        <div className="us-progress-block">
          <div className="us-progress-bar-bg">
            <div className="us-progress-bar-fill" style={{ width: `${progressPct}%` }} />
          </div>
          <span className="us-progress-label">{progressPct}% complété</span>
        </div>

        <nav className="us-nav">
          {[
            { id: 'collection', label: 'Ma collection', count: score },
            { id: 'stats',      label: 'Statistiques',  count: null },
          ].map(tab => (
            <button
              key={tab.id}
              className={`us-nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              {tab.count !== null && (
                <span className="us-nav-count">{tab.count}</span>
              )}
            </button>
          ))}
        </nav>
      </aside>

      {/* ── MAIN ── */}
      <main className="us-main">

        {activeTab === 'collection' && (
          <>
            <div className="us-section-header">
              <h1 className="us-section-title">Ma collection</h1>
              <span className="us-section-sub">
                {remaining > 0
                  ? `${remaining} connexion${remaining > 1 ? 's' : ''} à découvrir`
                  : 'Collection complète ✦'}
              </span>
            </div>

            {myCollection.length === 0 ? (
              <div className="us-empty">
                <div className="us-empty-icon">○</div>
                <p>Retournez jouer pour découvrir vos premières connexions biomimétiques.</p>
                <button className="us-cta" onClick={onBack}>Commencer l'exploration</button>
              </div>
            ) : (
              <div className="us-grid">
                {myCollection.map(pair => (
                  <div key={pair.id} className="us-card">
                    <div className="us-card-images">
                      <div className="us-card-img-wrap nature">
                        <img src={pair.nature.image} alt={pair.nature.nom} />
                      </div>
                      <div className="us-card-connector">
                        <div className="us-connector-line" />
                        <span className="us-connector-dot" />
                        <div className="us-connector-line" />
                      </div>
                      <div className="us-card-img-wrap app">
                        <img src={pair.application.image} alt={pair.application.nom} />
                      </div>
                    </div>
                    <div className="us-card-body">
                      <div className="us-card-labels">
                        <span className="us-label nature">{pair.nature.nom}</span>
                        <span className="us-label app">{pair.application.nom}</span>
                      </div>
                      <p className="us-card-explication">
                        {pair.explication.slice(0, 90)}…
                      </p>
                    </div>
                    <button
                      className="us-download-btn"
                      onClick={() => downloadCard(pair)}
                    >
                      Télécharger la fiche
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'stats' && (
          <>
            <div className="us-section-header">
              <h1 className="us-section-title">Statistiques</h1>
            </div>
            <div className="us-stats-grid">
              <div className="us-stat-block">
                <span className="us-stat-value">{score}</span>
                <span className="us-stat-label">Paires trouvées</span>
              </div>
              <div className="us-stat-block">
                <span className="us-stat-value">{remaining}</span>
                <span className="us-stat-label">Restantes</span>
              </div>
              <div className="us-stat-block">
                <span className="us-stat-value">{progressPct}%</span>
                <span className="us-stat-label">Progression</span>
              </div>
              <div className="us-stat-block">
                <span className="us-stat-value">
                  {score >= 21 ? 'MAÎTRE' : score >= 10 ? 'CONFIRMÉ' : score >= 5 ? 'EXPLORATEUR' : 'NOVICE'}
                </span>
                <span className="us-stat-label">Rang actuel</span>
              </div>
            </div>
          </>
        )}

      </main>
    </div>
  );
};

export default UserSpace;