import { DEFAULT_THEME, THEME_STORAGE_KEY } from './constants';

const source = `(function(){var d=document.documentElement;function s(t){d.dataset.theme=t}try{if(location.pathname.indexOf('/studio')===0){s('${DEFAULT_THEME}');return}var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t==='light'||t==='dark'){s(t);return}s(window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches?'light':'${DEFAULT_THEME}')}catch(e){s('${DEFAULT_THEME}')}})();`;

const ThemeScript = () => <script dangerouslySetInnerHTML={{ __html: source }} />;

export default ThemeScript;
