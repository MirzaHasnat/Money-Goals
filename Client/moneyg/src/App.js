import './App.css';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from 'antd';
import { MoneyCollectOutlined } from '@ant-design/icons';
import Login from './Components/User/Login'; 
import Signup from './Components/User/Signup';
import {ProtectedRoute} from './Components/Routes';
import Error404 from './Components/Error/404';
import Home from './Components/Dashboard/Home';

function App() {
  return (
    <BrowserRouter>
      <Layout style={{minHeight:"100vh"}}>

        <Layout.Header>
          <h1 style={{color:"white"}} align="center"> <MoneyCollectOutlined/>MoneyG</h1>
        </Layout.Header>

        <Layout.Content style={{ padding: '0 50px', margin: 20, background:"white" }}>
          <Routes>
            <Route exact path="/register" element={<Signup/>} />
            <Route exact path="/login" element={<Login/>} />

            <Route exact path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
            />

            <Route path="*" element={<Error404/>} />
          </Routes>
        </Layout.Content>

      </Layout>
    
    </BrowserRouter>
  );
}

export default App;
