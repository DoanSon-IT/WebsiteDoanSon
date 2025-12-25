import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { publicBlogAPI } from '../services/api';

const BlogPostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await publicBlogAPI.getPostById(id);
      setPost(response.data);
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  if (error || !post) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="christmas-card p-6 mb-6 border-red-500 bg-red-900/20">
            <p className="text-red-400 text-center text-lg">
              {error || 'Không tìm thấy bài viết'}
            </p>
          </div>
          <Link to="/" className="btn-christmas inline-block">
            ← Quay lại trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto mb-6">
        <Link to="/" className="btn-christmas inline-flex items-center gap-2">
          <span>←</span> Quay lại trang chủ
        </Link>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto">
        <article className="christmas-card overflow-hidden">
          {/* Featured Image */}
          {post.imageUrls && post.imageUrls.length > 0 && (
            <div className="relative h-64 sm:h-96 overflow-hidden">
              <img
                src={post.imageUrls[0]}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full font-bold">
                🎄 Bài viết
              </div>
            </div>
          )}

          <div className="p-6 sm:p-8">
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 christmas-gradient-text">
              {post.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-gray-400 mb-8 pb-6 border-b border-gray-700">
              <span className="flex items-center gap-2">
                <span>✍️</span>
                <span>{post.authorName || 'Ẩn danh'}</span>
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-2">
                <span>📅</span>
                <span>{formatDate(post.createdAt)}</span>
              </span>
            </div>

            {/* Content */}
            <div className="prose max-w-none mb-8">
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
            </div>

            {/* Additional Images */}
            {post.imageUrls && post.imageUrls.length > 1 && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-4 christmas-gradient-text flex items-center gap-2">
                  🖼️ Thư viện ảnh
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {post.imageUrls.slice(1).map((url, index) => (
                    <div key={index} className="relative overflow-hidden rounded-lg border-2 border-red-900/30 hover:border-yellow-500 transition-all">
                      <img
                        src={url}
                        alt={`${post.title} - ${index + 2}`}
                        className="w-full h-64 object-cover hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Videos */}
            {post.videoUrls && post.videoUrls.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-4 christmas-gradient-text flex items-center gap-2">
                  🎥 Video
                </h3>
                <div className="space-y-4">
                  {post.videoUrls.map((url, index) => (
                    <div key={index} className="relative rounded-lg overflow-hidden border-2 border-red-900/30">
                      <video
                        controls
                        className="w-full rounded-lg"
                        src={url}
                      >
                        Trình duyệt của bạn không hỗ trợ video.
                      </video>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-12 pt-6 border-t border-gray-700 text-center">
              <p className="text-gray-400 mb-4">🎅 Cảm ơn bạn đã đọc! 🎄</p>
              <Link to="/" className="btn-christmas inline-block">
                ← Xem thêm bài viết khác
              </Link>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
};

export default BlogPostDetail;

