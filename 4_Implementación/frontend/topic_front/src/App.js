import { Routes, Route, BrowserRouter } from 'react-router-dom';

import ShowUsers from './pages/ABM';
import Register from './pages/Register';
import EditUser from './pages/EditUser';
import LoginUser from './pages/Login';
import Home from './pages/Home';
import Navbar from './components/navbar';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import RecoverPassword from './pages/RecoverPassword';
import RecoverPasswordNewPass from './pages/RecoverPasswordNewPass';

import "./styles/message.css";
import "./styles/Home.css";
import "./styles/Login.css";
import "./styles/Register.css";
import "./styles/profile_card.css";
import "./styles/Profile.css";
import "./styles/navbar.css";
import "./styles/ABM.css";
import "./styles/Edit.css";
import "./styles/notfound.css";
import "./styles/RecoverPassword.css";
import "./styles/RecoverPasswordNewPass.css";
import "./styles/profileSearchCard.css";
import "./App.css";

function App() {
  return (
      <div id="App">
        <link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet'></link>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"></link>
        <BrowserRouter>
          {window.location.pathname.split('/')[3] !== 'search' ? <Navbar /> : <Navbar />}
          <div id='App-container' className="container p-4">
          <Routes>
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<LoginUser />} />
            <Route path='/' element={<Home />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/users' element={<ShowUsers />} />
            <Route path='/users/user/:id/edit' element={<EditUser />} />
            <Route path='/404' element={<NotFound />} />
            <Route path='*' element={<NotFound />} />
            <Route path='/recovery/form' element={<RecoverPassword />} />
            <Route path='/recovery/newpassword/:token' element={<RecoverPasswordNewPass />} />
          </Routes>
          </div>
        </BrowserRouter>
      </div>
  );
}

export default App;
