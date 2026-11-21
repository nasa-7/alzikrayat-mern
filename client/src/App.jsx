import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Gallery from './pages/Gallery.jsx';
import PhotoDetail from './pages/PhotoDetail.jsx';
import AddPhoto from './pages/AddPhoto.jsx';
import LoginRegister from './pages/LoginRegister.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';

/** Route configuration (React Router). */
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/photos" element={<Gallery />} />
        <Route path="/photos/new" element={<AddPhoto />} />
        <Route path="/photos/:id" element={<PhotoDetail />} />
        <Route path="/login" element={<LoginRegister mode="login" />} />
        <Route path="/register" element={<LoginRegister mode="register" />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
