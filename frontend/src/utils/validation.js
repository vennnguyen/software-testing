export function validateUsername(u){
  if(!u || u.trim()==='') return 'Tên đăng nhập không được để trống';
  if(u.length<3) return 'Tên đăng nhập phải có ít nhất 3 ký tự';
  if(u.length>50) return 'Tên đăng nhập không được vượt quá 50 ký tự';
  if(!/^[a-zA-Z0-9]+$/.test(u)) return 'Tên đăng nhập chỉ được chứa a-z, A-Z, 0-9';
  return '';
}
export function validatePassword(p){
  if(!p || p.trim()==='') return 'Mật khẩu không được để trống';
  if(p.length<6) return 'Mật khẩu phải có ít nhất 6 ký tự';
  if(!(/[a-zA-Z]/.test(p) && /[0-9]/.test(p))) return 'Mật khẩu phải chứa cả chữ và số';
  return '';
}
