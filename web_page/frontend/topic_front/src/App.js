import { Routes, Route, BrowserRouter } from 'react-router-dom';

import ShowUsers from './pages/ABM';
import Register from './pages/Register';
import EditUser from './pages/EditUser';
import LoginUser from './pages/Login';
import Home from './pages/Home';
import Navbar from './components/navbar';
import NotFound from './pages/NotFound';

import "./styles/message.css";
import "./styles/Home.css";

function App() {
  return (
      <div>
        <BrowserRouter>
          <Navbar />
          <div className="container p-4">
          <Routes>
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<LoginUser />} />
            <Route path='/' element={<Home />} />
            <Route path='/users' element={<ShowUsers />} />
            <Route path='/users/user/:id/edit' element={<EditUser />} />
            <Route path='/404' element={<NotFound />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
          </div>
        </BrowserRouter>
        </div>
  );
}

export default App;
