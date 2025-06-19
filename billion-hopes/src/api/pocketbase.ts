export function isAuthenticated() {
  return !!localStorage.getItem('auth');
}

export function login(username: string, password: string) {
  if (username === 'admin' && password === 'billion123') {
    localStorage.setItem('auth', 'true');
    return true;
  }
  return false;
} 