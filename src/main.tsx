import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register service worker immediately to cache all assets for 100% offline usage
registerSW({
  immediate: true,
  onOfflineReady() {
    console.log('Land Ledger APK is 100% ready to work offline.');
  },
});

createRoot(document.getElementById('root')!).render(<App />);
