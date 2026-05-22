import './LoadingScreen.css';

const LoadingScreen = () => (
  <div className="stk-loading-root">
    <div className="stk-loading-inner">
      {/* Logo texte pendant le chargement */}
      <div className="stk-loading-logo">
        <span className="stk-loading-stk">STK</span>
        <span className="stk-loading-archi">ARCHITECTURE</span>
      </div>

      {/* Barre de chargement animée */}
      <div className="stk-loading-bar-bg">
        <div className="stk-loading-bar-fill" />
      </div>

      <p className="stk-loading-text">Chargement de l'exploration…</p>
    </div>
  </div>
);

export default LoadingScreen;