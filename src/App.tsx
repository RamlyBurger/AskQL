import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/shared/Layout';
import HomePage from './pages/HomePage';
import DatabasePage from './pages/DatabasePage';
import ErdPage from './pages/ErdPage';
import InsightsPage from './pages/InsightsPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/database" element={<DatabasePage />} />
          <Route path="/erd" element={<ErdPage />} />
          <Route path="/insights" element={<InsightsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
