import { Routes, Route, BrowserRouter } from 'react-router-dom';

import ShowUsers from './pages/ABM';
import RegisterUser from './pages/RegisterUser';
import EditUser from './pages/EditUser';
import LoginUser from './pages/Login';
import Home from './pages/Home';

function App() {
  return (
      <div className='container-fluid'>
        <div className='row'>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/registerUser' element={<RegisterUser />} />
              <Route path='/user/:id/edit' element={<EditUser />} />
              <Route path='/login' element={<LoginUser />} />
              <Route path='/listUsers' element={<ShowUsers />} />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
  );
}

export default App;
