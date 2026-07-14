import { useState } from 'react';
import { Icon } from '../components/icons/Icon';
import { useApp } from '../state/context';
import { USE_MOCK } from '../api/client';
import Logo from '../assets/Logo.png'

export function AuthPage() {
  const { authMode, setAuthMode, login, signup, showToast, authLoading } = useApp();
  const isLogin = authMode === 'login';

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [suUsername, setSuUsername] = useState('');
  const [suEmail, setSuEmail] = useState('');
  const [suPassword, setSuPassword] = useState('');

  function submitLogin() {
    if (!loginEmail.trim() || !loginPassword.trim()) {
      showToast('이메일과 비밀번호를 입력해주세요');
      return;
    }
    login(loginEmail.trim(), loginPassword);
  }
  function submitSignup() {
    if (!suUsername.trim() || !suEmail.trim() || !suPassword.trim()) {
      showToast('필수 항목을 모두 입력해주세요');
      return;
    }
    signup({ username: suUsername.trim(), email: suEmail.trim(), password: suPassword });
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">
          <img src={Logo} alt="" style={{width: '80px', height: '80px'}}/>
          <div className="t1">예산대로</div>
          <div className="t2">가게 관리</div>
        </div>
        <div className="auth-tabs">
          <button className={isLogin ? 'active' : ''} onClick={() => setAuthMode('login')}>로그인</button>
          <button className={!isLogin ? 'active' : ''} onClick={() => setAuthMode('signup')}>회원가입</button>
        </div>  

       
        {isLogin ? (
          <>
            <div className="field">
              <label>이메일</label>
              <input type="email" placeholder="owner@example.com" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
            </div>
            <div className="field">
              <label>비밀번호</label>
              <input type="password" placeholder="비밀번호" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={submitLogin} disabled={authLoading}>
              {authLoading ? '로그인 중...' : '로그인'}
            </button>
            <div className="auth-foot">계정이 없으신가요? <span onClick={() => setAuthMode('signup')}>회원가입</span></div>
          </>
        ) : (
          <>
            <div className="field">
              <label>아이디</label>
              <input type="text" placeholder="kimsiheun" value={suUsername} onChange={(e) => setSuUsername(e.target.value)} />
            </div>
            <div className="field">
              <label>이메일</label>
              <input type="email" placeholder="owner@example.com" value={suEmail} onChange={(e) => setSuEmail(e.target.value)} />
            </div>
            <div className="field">
              <label>비밀번호</label>
              <input type="password" placeholder="비밀번호" value={suPassword} onChange={(e) => setSuPassword(e.target.value)} />
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={submitSignup} disabled={authLoading}>
              {authLoading ? '가입 중...' : '가입하고 시작하기'}
            </button>
            <div className="auth-foot">이미 계정이 있으신가요? <span onClick={() => setAuthMode('login')}>로그인</span></div>
          </>
        )}
      </div>
    </div>
  );
}
