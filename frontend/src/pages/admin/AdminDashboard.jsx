import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminBlogAPI } from '../../services/api';
import { removeToken } from '../../utils/auth';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await adminBlogAPI.getAllPosts();
      setPosts(response.data);
      setError(null);
    } catch (err) {
      setError('Không thể tải danh sách bài viết');
      console.error('Lỗi khi tải bài viết:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('🎄 Bạn có chắc chắn muốn xóa bài viết này không?')) {
      return;
    }

    try {
      await adminBlogAPI.deletePost(id);
      setPosts(posts.filter(post => post.id !== id));
    } catch (err) {
      alert('❌ Không thể xóa bài viết');
      console.error('Lỗi khi xóa bài viết:', err);
    }
  };

  const handleLogout = () => {
    removeToken();
    navigate('/admin');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl christmas-gradient-text">
          🎄 Đang tải... 🎅
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold christmas-gradient-text christmas-glow mb-2">
              🎄 Bảng Điều Khiển Quản Trị 🎅
            </h1>
            <p className="text-gray-400">Quản lý tất cả bài viết của bạn</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/"
              className="btn-christmas-secondary px-4 py-2 text-sm sm:text-base"
            >
              👁️ Xem Blog
            </Link>
            <Link
              to="/admin/create"
              className="btn-christmas px-4 py-2 text-sm sm:text-base"
            >
              ➕ Tạo Bài Mới
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm sm:text-base"
            >
              🚪 Đăng Xuất
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="christmas-card p-4 mb-6 border-red-500 bg-red-900/20">
            <p className="text-red-400 text-center">{error}</p>
          </div>
        )}

        {/* Posts Table/Grid */}
        {posts.length === 0 ? (
          <div className="christmas-card p-12 text-center">
            <p className="text-xl sm:text-2xl mb-4">🎄 Chưa có bài viết nào 🎄</p>
            <p className="text-gray-400 mb-6">Hãy tạo bài viết đầu tiên của bạn!</p>
            <Link
              to="/admin/create"
              className="btn-christmas inline-block"
            >
              ➕ Tạo Bài Viết Đầu Tiên
            </Link>
          </div>
        ) : (
          <div className="christmas-card overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">
                      📝 Tiêu Đề
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">
                      ✍️ Tác Giả
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">
                      📊 Trạng Thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">
                      📅 Ngày Tạo
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-yellow-400 uppercase tracking-wider">
                      ⚙️ Thao Tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-800 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-white">{post.title}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-400">{post.authorName || 'Ẩn danh'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${post.published
                            ? 'bg-green-900/50 text-green-400 border border-green-700'
                            : 'bg-gray-700 text-gray-300 border border-gray-600'
                          }`}>
                          {post.published ? '✅ Đã xuất bản' : '📝 Nháp'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {formatDate(post.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <Link
                          to={`/admin/edit/${post.id}`}
                          className="text-yellow-400 hover:text-yellow-300 mr-4 transition-colors"
                        >
                          ✏️ Sửa
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          🗑️ Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4 p-4">
              {posts.map((post) => (
                <div key={post.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-lg font-bold text-white mb-2">{post.title}</h3>
                  <div className="space-y-2 text-sm mb-4">
                    <p className="text-gray-400">
                      <span className="font-medium">✍️ Tác giả:</span> {post.authorName || 'Ẩn danh'}
                    </p>
                    <p className="text-gray-400">
                      <span className="font-medium">📅 Ngày tạo:</span> {formatDate(post.createdAt)}
                    </p>
                    <div>
                      <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${post.published
                          ? 'bg-green-900/50 text-green-400 border border-green-700'
                          : 'bg-gray-700 text-gray-300 border border-gray-600'
                        }`}>
                        {post.published ? '✅ Đã xuất bản' : '📝 Nháp'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Link
                      to={`/admin/edit/${post.id}`}
                      className="flex-1 btn-christmas-secondary py-2 text-center text-sm"
                    >
                      ✏️ Sửa
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-all text-sm"
                    >
                      🗑️ Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

