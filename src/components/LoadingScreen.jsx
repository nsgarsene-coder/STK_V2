import './LoadingScreen.css';

const LoadingScreen = () => (
  <div className="ls-root">
    <img
      src="/src/assets/LOADING.svg"
      alt="STK Architecture Origins"
      className="ls-svg"
    />
    <div className="ls-bar-wrapper">
      <div className="ls-bar" />
    </div>
  </div>
);

export default LoadingScreen;