import React, {useState} from 'react';
import { validateUsername, validatePassword } from '../utils/validation';
import { login } from '../services/auth';

export default function Login(){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    const uErr = validateUsername(username);
    const pErr = validatePassword(password);
    if(uErr || pErr){ setMsg(uErr || pErr); return; }
    try{
      const res = await login(username, password);
      setMsg('Login success: ' + (res.username || ''));
    }catch(e){
      setMsg('Login failed');
    }
  };

  return (
    <div style={{padding:20}}>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div>
          <label>Username</label><br/>
          <input data-testid="username-input" value={username} onChange={e=>setUsername(e.target.value)} />
        </div>
        <div>
          <label>Password</label><br/>
          <input data-testid="password-input" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <button data-testid="login-button" type="submit">Login</button>
      </form>
      <div data-testid="login-message">{msg}</div>
    </div>
  );
}
