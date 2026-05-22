import { useGameState } from '../state/gameState';
import { pairs } from '../logic/pairs';
import './UserSpace.css';

const UserSpace = ({ onBack }) => {
  const { score, foundPairIds } = useGameState();
  const myCollection = pairs.filter(p => foundPairIds.includes(p.id));

  // Fonction de téléchargement intégrée
  const downloadCard = (pair) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 600;
    canvas.height = 450;

    // Fond style STK
    ctx.fillStyle = '#F4F1EA';
    ctx.fillRect(0, 0, 600, 450);

    // En-tête
    ctx.fillStyle = '#1A1A18';
    ctx.font = 'bold 28px Arial';
    ctx.fillText('STK ARCHITECTURE', 50, 60);
    ctx.font = '18px Arial';
    ctx.fillText('FICHE D\'EXPLORATION BIOMIMÉTIQUE', 50, 90);

    // Ligne de séparation
    ctx.strokeStyle = '#4A5D60';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, 110);
    ctx.lineTo(550, 110);
    ctx.stroke();

    // Contenu
    ctx.fillStyle = '#3A593E';
    ctx.font = 'bold 22px Arial';
    ctx.fillText(`${pair.nature.nom} + ${pair.application.nom}`, 50, 150);

    ctx.fillStyle = '#1A1A18';
    ctx.font = '16px Arial';
    
    // Gestion du texte long (Explication)
    const words = pair.explication.split(' ');
    let line = '';
    let y = 190;
    words.forEach(word => {
      if ((line + word).length > 65) {
        ctx.fillText(line, 50, y);
        line = word + ' ';
        y += 25;
      } else {
        line += word + ' ';
      }
    });
    ctx.fillText(line, 50, y);

    // Pied de page
    ctx.fillStyle = '#4A5D60';
    ctx.font = 'italic 14px Arial';
    ctx.fillText('Document généré par l\'explorateur STK', 50, 410);

    // Action de téléchargement
    const link = document.createElement('a');
    link.download = `STK_Fiche_${pair.id}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="stk-user-space">
      <header className="user-header">
        <button className="btn-back" onClick={onBack}>← Retour au jeu</button>
        <h1>MON ESPACE EXPLORATEUR</h1>
      </header>

      <section className="user-stats-banner">
        <div className="stat-card">
          <span className="stat-label">Paires Découvertes</span>
          <span className="stat-value">{score} / 21</span>
          <div className="mini-progress-bar">
            <div className="fill" style={{ width: `${(score / 21) * 100}%` }}></div>
          </div>
        </div>
      </section>

      <section className="collection-section">
        <h2>Ma Collection Biomimétique</h2>
        <div className="collection-grid">
          {myCollection.length > 0 ? (
            myCollection.map(pair => (
              <div key={pair.id} className="collection-item">
                <div className="item-images">
                  <img src={pair.nature.image} alt="Nature" />
                  <div className="item-link-icon">🔗</div>
                  <img src={pair.application.image} alt="App" />
                </div>
                <div className="item-info">
                  <h4>{pair.nature.nom} + {pair.application.nom}</h4>
                  <button className="btn-download" onClick={() => downloadCard(pair)}>
                    Télécharger la fiche
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-collection">
              <p>Trouvez des paires pour enrichir votre collection !</p>
            </div>
          )}
        </div>
      </section>

      <section className="contribution-section">
        <div className="contribution-card">
          <h3>Contribuer à STK</h3>
          <form className="stk-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <input type="text" placeholder="Inspiration Nature" />
              <input type="text" placeholder="Application Humaine" />
            </div>
            <textarea placeholder="Décrivez votre idée..."></textarea>
            <button className="stk-btn-primary">Envoyer ma proposition</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default UserSpace;
