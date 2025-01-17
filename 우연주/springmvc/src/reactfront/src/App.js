import React from "react";
import { Route, Routes } from 'react-router-dom';
import Header from "./components/Header.js";
import Home from './pages/Home.js'
import Detail from './pages/Detail.js'
import SaveForm from './pages/SaveForm.js'
import UpdateForm from './pages/UpdateForm.js'
import LoginForm from "./pages/LoginForm.js";
import JoinForm from "./pages/JoinForm.js";

function App(){
  return (
    <div>

      <container>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/saveForm" element={<SaveForm />} />
        <Route path="/board/:id" element={<Detail />} />
        <Route path="/updateForm/:id" element={<UpdateForm />} />
        <Route path="/loginForm" element={<LoginForm />} />
        <Route path="/joinForm" element={<JoinForm />} />
      </Routes>
      </container>
    </div>
  )
}
 
export default App;