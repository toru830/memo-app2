import { BrowserRouter } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { DebugPanel } from './components/DebugPanel';

function App() {
  return (
    <BrowserRouter>
      <HomePage />
      <DebugPanel />
    </BrowserRouter>
  );
}

export default App;