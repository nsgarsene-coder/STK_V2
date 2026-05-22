import { useState} from 'react';
import { useGameState } from '../state/gameState';
import { pairs } from '../logic/pairs';
import './UserSpace.css';

const UserSpace = ({ onBack }) => {
  const { score, foundPairIds } = useGameState();
  const [activeTab, setActiveTab]         = useState('collection');
  const [passeportName, setPasseportName] = useState('');
  const [nameInput, setNameInput]         = useState('');
  const [principe, setPrincipe]           = useState('');
  const [principes, setPrincipes]         = useState([]);
  

  const myCollection = pairs.filter(p => foundPairIds.includes(p.id));
  const remaining    = 21 - score;
  const progressPct  = Math.round((score / 21) * 100);

  /* ── Génère le passeport en canvas par-dessus le SVG ── */
  const generatePasseport = () => {
    if (!nameInput.trim()) return;
    setPasseportName(nameInput.trim());
  };

 const downloadPasseport = () => {
  const canvas  = document.createElement('canvas');
  canvas.width  = 875;
  canvas.height = 578;
  const ctx     = canvas.getContext('2d');

  // Fond sombre
  ctx.fillStyle = '#2B2B2B';
  ctx.fillRect(0, 0, 875, 578);

  // Courbes décoratives (style bg.svg simplifié)
  ctx.strokeStyle = 'rgba(246,241,235,0.12)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 200); ctx.bezierCurveTo(200, 100, 600, 400, 875, 250);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, 350); ctx.bezierCurveTo(300, 200, 500, 500, 875, 350);
  ctx.stroke();

  // Bandeau haut
  ctx.fillStyle = 'rgba(246,241,235,0.04)';
  ctx.fillRect(0, 0, 875, 100);

  // Logo STK
  ctx.fillStyle = '#F6F1EB';
  ctx.font = 'bold 11px Arial';
  ctx.letterSpacing = '4px';
  ctx.fillText('STK ARCHITECTURE', 52, 52);

  // Ligne séparatrice
  ctx.strokeStyle = 'rgba(246,241,235,0.15)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(52, 68); ctx.lineTo(300, 68);
  ctx.stroke();

  // Tag PASSEPORT
  ctx.fillStyle = 'rgba(246,241,235,0.08)';
  ctx.roundRect(52, 88, 120, 22, 11);
  ctx.fill();
  ctx.fillStyle = 'rgba(246,241,235,0.5)';
  ctx.font = '9px Arial';
  ctx.fillText('PASSEPORT D\'EXPLORATEUR', 62, 103);

  // Nom du joueur
  ctx.fillStyle = '#F6F1EB';
  ctx.font = 'italic bold 56px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(passeportName, 437, 300);

  // Score
  ctx.font = '13px Arial';
  ctx.fillStyle = 'rgba(246,241,235,0.45)';
  ctx.fillText(`${score} / 21 connexions découvertes`, 437, 336);

  // Pied de page
  ctx.textAlign = 'left';
  ctx.font = '10px Arial';
  ctx.fillStyle = 'rgba(246,241,235,0.2)';
  ctx.fillText('STK Architecture — Biomimétisme', 52, 548);

  // Coin décoratif
  ctx.strokeStyle = 'rgba(246,241,235,0.3)';
  ctx.lineWidth = 1;
  ctx.strokeRect(40, 40, 795, 498);

  const link    = document.createElement('a');
  link.download = `STK_Passeport_${passeportName}.png`;
  link.href     = canvas.toDataURL('image/png');
  link.click();
};

  /* ── Partage d'un principe ── */
  const submitPrincipe = () => {
    if (!principe.trim()) return;
    setPrincipes(prev => [
      { text: principe.trim(), date: new Date().toLocaleDateString('fr-FR') },
      ...prev,
    ]);
    setPrincipe('');
  };

  const downloadCard = (pair) => {
    const canvas = document.createElement('canvas');
    const ctx    = canvas.getContext('2d');
    canvas.width  = 680;
    canvas.height = 420;
    ctx.fillStyle = '#F4F1EA';
    ctx.fillRect(0, 0, 680, 420);
    ctx.fillStyle = '#1A1A18';
    ctx.fillRect(0, 0, 680, 90);
    ctx.fillStyle = '#F4F1EA';
    ctx.font = 'bold 22px Arial';
    ctx.fillText('STK ARCHITECTURE', 40, 38);
    ctx.font = '11px Arial';
    ctx.fillStyle = 'rgba(244,241,234,0.5)';
    ctx.fillText("FICHE D'EXPLORATION BIOMIMÉTIQUE", 40, 62);
    ctx.fillStyle = '#3A593E';
    ctx.beginPath();
    ctx.roundRect(40, 110, 160, 28, 14);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 10px Arial';
    ctx.fillText('✦ CONNEXION TROUVÉE', 56, 129);
    ctx.fillStyle = '#1A1A18';
    ctx.font = 'bold 26px Arial';
    ctx.fillText(pair.nature.nom, 40, 180);
    ctx.fillStyle = '#4A5D60';
    ctx.fillText(`→  ${pair.application.nom}`, 40, 216);
    ctx.strokeStyle = 'rgba(26,26,24,0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(40, 240); ctx.lineTo(640, 240);
    ctx.stroke();
    ctx.fillStyle = 'rgba(26,26,24,0.65)';
    ctx.font = '14px Arial';
    const words = pair.explication.split(' ');
    let line = ''; let y = 270;
    words.forEach(word => {
      if ((line + word).length > 72) { ctx.fillText(line, 40, y); line = word + ' '; y += 22; }
      else { line += word + ' '; }
    });
    ctx.fillText(line, 40, y);
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
              {score >= 21 ? 'MAÎTRE BIOMIMÉTISTE'
               : score >= 10 ? 'EXPLORATEUR CONFIRMÉ'
               : score >= 5  ? 'EXPLORATEUR'
               : 'NOVICE'}
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
            { id: 'collection', label: 'Ma collection',        count: score },
            { id: 'passeport',  label: 'Passeport',            count: null  },
            { id: 'principes',  label: 'Mes principes',        count: principes.length || null },
            { id: 'stats',      label: 'Statistiques',         count: null  },
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

        {/* COLLECTION */}
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
                <p>Retournez jouer pour découvrir vos premières connexions.</p>
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
                    <button className="us-download-btn" onClick={() => downloadCard(pair)}>
                      Télécharger la fiche
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* PASSEPORT */}
        {activeTab === 'passeport' && (
          <>
            <div className="us-section-header">
              <h1 className="us-section-title">Passeport d'Explorateur</h1>
              <span className="us-section-sub">Ton laissez-passer dans le monde du biomimétisme</span>
            </div>

            <div className="us-passeport-wrapper">
              {/* Preview */}
              <div className="us-passeport-preview">
                <img
                  src="/src/assets/passeport.svg"
                  alt="Passeport STK"
                  className="us-passeport-img"
                />
                {passeportName && (
                  <div className="us-passeport-name-overlay">
                    <span className="us-passeport-name">{passeportName}</span>
                    <span className="us-passeport-score-line">{score} / 21 connexions découvertes</span>
                  </div>
                )}
              </div>

              {/* Formulaire */}
              <div className="us-passeport-form">
                {!passeportName ? (
                  <>
                    <p className="us-passeport-hint">
                      Entre ton prénom ou ton surnom d'explorateur pour personnaliser ton passeport.
                    </p>
                    <div className="us-passeport-input-row">
                      <input
                        className="us-passeport-input"
                        type="text"
                        placeholder="Ton nom d'explorateur…"
                        value={nameInput}
                        onChange={e => setNameInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && generatePasseport()}
                        maxLength={28}
                      />
                      <button className="us-cta" onClick={generatePasseport}>
                        Générer
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="us-passeport-ready">
                      Passeport de <strong>{passeportName}</strong> prêt.
                    </p>
                    <div className="us-passeport-actions">
                      <button className="us-cta" onClick={downloadPasseport}>
                        Télécharger
                      </button>
                      <button
                        className="us-btn-ghost"
                        onClick={() => { setPasseportName(''); setNameInput(''); }}
                      >
                        Changer de nom
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}

        {/* PRINCIPES */}
        {activeTab === 'principes' && (
          <>
            <div className="us-section-header">
              <h1 className="us-section-title">Mes principes</h1>
              <span className="us-section-sub">Ce que tu as compris en jouant</span>
            </div>

            <div className="us-principes-form">
              <p className="us-principes-hint">
                Tu as observé un lien, compris un principe de biomimétisme ? Partage-le.
              </p>
              <textarea
                className="us-principe-textarea"
                placeholder="Ex : Les termites régulent la température de leurs termitières comme nos systèmes de climatisation passifs…"
                value={principe}
                onChange={e => setPrincipe(e.target.value)}
                maxLength={300}
                rows={4}
              />
              <div className="us-principe-footer">
                <span className="us-principe-count">{principe.length} / 300</span>
                <button
                  className="us-cta"
                  onClick={submitPrincipe}
                  disabled={!principe.trim()}
                >
                  Partager
                </button>
              </div>
            </div>

            {principes.length > 0 ? (
              <div className="us-principes-list">
                {principes.map((p, i) => (
                  <div key={i} className="us-principe-item">
                    <p className="us-principe-text">"{p.text}"</p>
                    <span className="us-principe-date">{p.date}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="us-empty" style={{ paddingTop: '32px' }}>
                <p>Aucun principe partagé pour l'instant.</p>
              </div>
            )}
          </>
        )}

        {/* STATS */}
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