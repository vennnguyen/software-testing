import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import ProductList from './components/ProductList';

export default function App(){
  return (
    <BrowserRouter>
      <nav style={{padding:10}}>
        <Link to='/'>Login</Link> | <Link to='/products'>Products</Link>
      </nav>
      <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/products' element={<ProductList/>} />
      </Routes>
    </BrowserRouter>
  );
}
