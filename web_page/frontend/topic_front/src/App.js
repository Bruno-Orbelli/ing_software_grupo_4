import { Routes, Route, BrowserRouter } from 'react-router-dom';

import ShowUsers from './pages/ABM';
import Register from './pages/Register';
import EditUser from './pages/EditUser';
import LoginUser from './pages/Login';
import Home from './pages/Home';
import Navbar from './components/navbar';

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
          </Routes>
          </div>
        </BrowserRouter>
        </div>
  );
}

export default App;
