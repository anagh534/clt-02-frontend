import { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import { useUiStore } from './store/uiStore';

function App() {
  const theme = useUiStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return <AppRoutes />
}

export default App;