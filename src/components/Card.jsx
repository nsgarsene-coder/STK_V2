
import './Card.css';

/**
 * COMPOSANT CARD - MODULE UNIVERSEL (DEV 1)
 * @param {Object} data - Infos de la carte (nom, image, type)
 * @param {string} state - État : 'idle', 'selected', 'matched', 'error', 'distributing'
 * @param {function} onClick - Action au clic
 */
const Card = ({ data, state, onClick }) => {
  const { nom, image, type } = data;
  const isNature = type === 'nature';

  return (
    <div 
      className={`stk-card ${isNature ? 'is-nature' : 'is-application'} state-${state}`}
      onClick={() => state !== 'matched' && onClick()}
    >
      {/* En-tête : Logo STK style Pochoir */}
      <div className="stk-card-header">
        <span className="stk-logo">STK</span>
      </div>

      {/* Zone Image : Découpe diagonale précise */}
      <div className="stk-card-image-container">
        <img src={image} alt={nom} className="stk-card-image" />
        <div className="stk-card-overlay"></div>
      </div>

      {/* Zone Texte : Typographie large et épurée */}
      <div className="stk-card-footer">
        <h3 className="stk-card-title">{nom}</h3>
        <div className="stk-card-badge">
          {isNature ? 'NATURE' : 'APPLICATION HUMAINE'}
        </div>
        
        {/* Détail architectural en bas à droite */}
        <div className="stk-card-corner"></div>
      </div>

      {/* État trouvé : On grise légèrement la carte */}
      {state === 'matched' && <div className="stk-card-matched-overlay"></div>}
    </div>
  );
};

export default Card;
