import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { publicBlogAPI } from '../services/api';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
    createSnowflakes();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await publicBlogAPI.getAllPosts();
      setPosts(response.data);
      setError(null);
    } catch (err) {
      setError('Không thể tải bài viết');
      console.error('Lỗi khi tải bài viết:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Tạo hiệu ứng tuyết rơi
  const createSnowflakes = () => {
    const snowflakeCount = 20; // Giảm từ 50 xuống 20
    const snowflakeContainer = document.createElement('div');
    snowflakeContainer.className = 'snowflakes';
    document.body.appendChild(snowflakeContainer);

    for (let i = 0; i < snowflakeCount; i++) {
      const snowflake = document.createElement('div');
      snowflake.className = 'snowflake';
      snowflake.innerHTML = '❄';
      snowflake.style.left = Math.random() * 100 + 'vw';
      snowflake.style.animationDuration = Math.random() * 3 + 2 + 's';
      snowflake.style.animationDelay = Math.random() * 5 + 's';
      snowflake.style.fontSize = Math.random() * 10 + 10 + 'px';
      snowflakeContainer.appendChild(snowflake);
    }
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
      <div className="max-w-7xl mx-auto">
        {/* Header với hiệu ứng Giáng Sinh */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 christmas-gradient-text christmas-glow">
            🎄 Dson 🎅
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 mb-2">
            ✨ Chào mừng đến với không gian chia sẻ của tôi ✨
          </p>
          <div className="flex justify-center gap-4 text-2xl sm:text-3xl mt-4">
            <span className="animate-bounce">🎁</span>
            <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>⛄</span>
            <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🔔</span>
            <span className="animate-bounce" style={{ animationDelay: '0.3s' }}>⭐</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="christmas-card p-4 mb-6 border-red-500 bg-red-900/20">
            <p className="text-red-400 text-center">{error}</p>
          </div>
        )}

        {posts.length === 0 ? (
          <div className="text-center">
            <div className="christmas-card p-12 max-w-md mx-auto">
              <p className="text-xl sm:text-2xl mb-4">🎄 Chưa có bài viết nào 🎄</p>
              <p className="text-gray-400">Hãy quay lại sau nhé!</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/post/${post.id}`}
                className="christmas-card overflow-hidden group"
              >
                {post.imageUrls && post.imageUrls.length > 0 && (
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={post.imageUrls[0]}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-bold">
                      🎄 Mới
                    </div>
                  </div>
                )}
                <div className="p-4 sm:p-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-300 mb-4 line-clamp-3 text-sm sm:text-base">
                    {post.content}
                  </p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs sm:text-sm text-gray-400 border-t border-gray-700 pt-4 gap-2">
                    <span className="flex items-center gap-2">
                      <span>✍️</span>
                      <span>{post.authorName || 'Ẩn danh'}</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span>📅</span>
                      <span>{formatDate(post.createdAt)}</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Footer Giáng Sinh */}
        <div className="text-center mt-16 pb-8">
          <div className="inline-block christmas-card px-6 sm:px-8 py-4">
            <p className="text-gray-300 text-base sm:text-lg">
              🎅 Chúc bạn một mùa Giáng Sinh an lành! 🎄
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

