import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { setToken, isAuthenticated } from '../../utils/auth';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated()) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!credentials.username || !credentials.password) {
      setError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await authAPI.login(credentials);

      if (response.data.token) {
        setToken(response.data.token);
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Tên đăng nhập hoặc mật khẩu không đúng');
      console.error('Lỗi đăng nhập:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Hiệu ứng tuyết rơi */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce">🎅</div>
          <h1 className="text-4xl font-bold mb-2 christmas-gradient-text christmas-glow">
            🎄 Đăng Nhập Quản Trị 🎄
          </h1>
          <p className="text-gray-300 text-lg">Quản lý blog của bạn</p>
        </div>

        <div className="christmas-card p-8">
          {error && (
            <div className="christmas-card p-4 mb-6 border-red-500 bg-red-900/20">
              <p className="text-red-400 text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                👤 Tên đăng nhập
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                className="christmas-input"
                placeholder="Nhập tên đăng nhập"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                🔒 Mật khẩu
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                className="christmas-input"
                placeholder="Nhập mật khẩu"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-christmas py-3 text-lg"
            >
              {loading ? '🎄 Đang đăng nhập...' : '🎅 Đăng Nhập'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors flex items-center justify-center gap-2">
              <span>←</span> Quay lại Blog
            </a>
          </div>
        </div>

        <div className="mt-6 text-center christmas-card p-4">
          <p className="text-gray-300 text-sm mb-2">🎁 Thông tin đăng nhập mặc định:</p>
          <p className="text-yellow-400 font-mono">
            <span className="font-bold">admin</span> / <span className="font-bold">admin123</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

