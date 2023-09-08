import { Routes, Route, BrowserRouter } from 'react-router-dom';

import ShowUsers from './pages/ShowUsers';
import RegisterUser from './pages/RegisterUser';
import EditUser from './pages/EditUser';

function App() {
  return (
    <div className='vh-100 gradient-custom'>
      <div className='container'>
        <h1 className='page-header text-center'>CRUD Test</h1>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<ShowUsers />} />
            <Route path='/registerUser' element={<RegisterUser />} />
            <Route path='/user/:id/edit' element={<EditUser />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
