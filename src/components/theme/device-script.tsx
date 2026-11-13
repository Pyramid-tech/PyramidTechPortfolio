const source = `(function(){try{var n=navigator,u=n.userAgent,d=/android/i.test(u)?'android':/iphone|ipad|ipod/i.test(u)||(/macintosh/i.test(u)&&n.maxTouchPoints>1)?'ios':'';if(d)document.documentElement.dataset.device=d}catch(e){}})();`;

const DeviceScript = () => <script dangerouslySetInnerHTML={{ __html: source }} />;

export default DeviceScript;
