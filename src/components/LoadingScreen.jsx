import loadingSvg from '../assets/LOADING.svg';
import './Loadingscreen.css';

const Loadingscreen = () => (
  <div className="ls-root">
    <img src={loadingSvg} alt="STK Architecture" className="ls-svg" />
    <div className="ls-bar-wrapper">
      <div className="ls-bar" />
    </div>
  </div>
);

export default Loadingscreen;