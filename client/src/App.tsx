import { BrowserRouter } from 'react-router-dom';
import { HomePage } from './pages/HomePage';

function App() {
  return (
    <BrowserRouter basename="/memo-app">
      <HomePage />
    </BrowserRouter>
  );
}

export default App;
