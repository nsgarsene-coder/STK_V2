import { useGameState } from '../state/gameState';
import { pairs } from '../logic/pairs';
import './UserSpace.css';

const UserSpace = ({ onBack }) => {
  const { score, foundPairIds } = useGameState();
  
  // On récupère les données des paires que l'utilisateur a déjà trouvées
  const myCollection = pairs.filter(p => foundPairIds.includes(p.id));

  return (
    <div className="stk-user-space">
      <header className="user-header">
        <button className="btn-back" onClick={onBack}>← Retour au jeu</button>
        <h1>MON ESPACE EXPLORATEUR</h1>
      </header>

      {/* Résumé de la progression */}
      <section className="user-stats-banner">
        <div className="stat-card">
          <span className="stat-label">Paires Découvertes</span>
          <span className="stat-value">{score} / 21</span>
          <div className="mini-progress-bar">
            <div className="fill" style={{ width: `${(score / 21) * 100}%` }}></div>
          </div>
        </div>
      </section>

      {/* Grille de collection */}
      <section className="collection-section">
        <h2>Ma Collection Biomimétique</h2>
        <div className="collection-grid">
          {myCollection.length > 0 ? (
            myCollection.map(pair => (
              <div key={pair.id} className="collection-item">
                <div className="item-images">
                  <img src={pair.nature.image} alt="Nature" className="img-nature" />
                  <div className="item-link-icon">🔗</div>
                  <img src={pair.application.image} alt="App" className="img-app" />
                </div>
                <div className="item-info">
                  <h4>{pair.nature.nom} + {pair.application.nom}</h4>
                  <button className="btn-download">Télécharger la fiche</button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-collection">
              <p>Votre collection est vide. Trouvez des paires dans le jeu pour les débloquer ici !</p>
            </div>
          )}
        </div>
      </section>

      {/* Espace Communautaire / Propositions */}
      <section className="contribution-section">
        <div className="contribution-card">
          <h3>Contribuer à STK</h3>
          <p>Vous avez une idée de liaison biomimétique ? Proposez-la à nos architectes.</p>
          <form className="stk-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <input type="text" placeholder="Inspiration Nature (ex: Peau de requin)" />
              <input type="text" placeholder="Application Humaine (ex: Coque de bateau)" />
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
