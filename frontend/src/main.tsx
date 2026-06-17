import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from "react-router";

import { AuthContextProvider } from './context/AuthContext.tsx'

import "./static/css/index.css";

import Home from './pages/Home.tsx'
import LoginPage from './pages/auth/LoginPage.tsx';
import Teams from './pages/teams/Teams.tsx';

import NavBar from './components/NavBar.tsx';
import AuthenticatedRoute from './components/AuthenticatedRoute.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthContextProvider>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route element={<AuthenticatedRoute/>}>
            <Route index element={<Home />} />
            <Route path='/teams' element={<Teams />}/>
          </Route>
          <Route path='/login' element={<LoginPage />}/>
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  </StrictMode>
)
