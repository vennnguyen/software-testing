import React, {useEffect, useState} from 'react';
import api from '../services/api';

export default function ProductList(){
  const [items, setItems] = useState([]);
  useEffect(()=>{
    api.get('/products').then(r=>setItems(r.data)).catch(()=>{});
  },[]);

  return (
    <div style={{padding:20}}>
      <h2>Products</h2>
      <ul data-testid="product-list">
        {items.map(p=>(<li key={p.id}>{p.name} - {p.price}</li>))}
      </ul>
    </div>
  );
}
