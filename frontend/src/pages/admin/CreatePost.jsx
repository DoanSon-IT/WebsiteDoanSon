import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminBlogAPI } from '../../services/api';

const CreatePost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    authorName: '',
    published: true
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e) => {
    setImageFiles(Array.from(e.target.files));
  };

  const handleVideoChange = (e) => {
    setVideoFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      setError('Tiêu đề và nội dung là bắt buộc');
      return;
    }

    try {
      setUploading(true);
      setError('');

      // Upload images
      let imageUrls = [];
      if (imageFiles.length > 0) {
        const imageUploadPromises = imageFiles.map(file =>
          adminBlogAPI.uploadImage(file)
        );
        const imageResponses = await Promise.all(imageUploadPromises);
        imageUrls = imageResponses.map(res => res.data);
      }

      // Upload videos
      let videoUrls = [];
      if (videoFiles.length > 0) {
        const videoUploadPromises = videoFiles.map(file =>
          adminBlogAPI.uploadVideo(file)
        );
        const videoResponses = await Promise.all(videoUploadPromises);
        videoUrls = videoResponses.map(res => res.data);
      }

      // Create post
      const postData = {
        ...formData,
        imageUrls,
        videoUrls
      };

      await adminBlogAPI.createPost(postData);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Không thể tạo bài viết: ' + (err.response?.data?.message || err.message));
      console.error('Lỗi khi tạo bài viết:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link to="/admin/dashboard" className="btn-christmas-secondary inline-flex items-center gap-2 mb-4">
            <span>←</span> Quay lại Dashboard
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold christmas-gradient-text christmas-glow mb-2">
            🎄 Tạo Bài Viết Mới 🎅
          </h1>
          <p className="text-gray-400">Chia sẻ câu chuyện của bạn với thế giới</p>
        </div>

        {error && (
          <div className="christmas-card p-4 mb-6 border-red-500 bg-red-900/20">
            <p className="text-red-400 text-center">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="christmas-card p-6 sm:p-8 space-y-6">
          <div>
            <label htmlFor="title" className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              📝 Tiêu đề *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="christmas-input"
              placeholder="Nhập tiêu đề bài viết..."
              required
              disabled={uploading}
            />
          </div>

          <div>
            <label htmlFor="content" className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              ✍️ Nội dung *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="10"
              className="christmas-input"
              placeholder="Viết nội dung bài viết của bạn..."
              required
              disabled={uploading}
            />
          </div>

          <div>
            <label htmlFor="authorName" className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              👤 Tên tác giả
            </label>
            <input
              type="text"
              id="authorName"
              name="authorName"
              value={formData.authorName}
              onChange={handleChange}
              className="christmas-input"
              placeholder="Nhập tên tác giả..."
              disabled={uploading}
            />
          </div>

          <div>
            <label htmlFor="images" className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              🖼️ Hình ảnh
            </label>
            <input
              type="file"
              id="images"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="christmas-input file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700 file:cursor-pointer"
              disabled={uploading}
            />
            {imageFiles.length > 0 && (
              <p className="mt-2 text-sm text-green-400">✅ {imageFiles.length} tệp đã chọn</p>
            )}
          </div>

          <div>
            <label htmlFor="videos" className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              🎥 Video
            </label>
            <input
              type="file"
              id="videos"
              accept="video/*"
              multiple
              onChange={handleVideoChange}
              className="christmas-input file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700 file:cursor-pointer"
              disabled={uploading}
            />
            {videoFiles.length > 0 && (
              <p className="mt-2 text-sm text-green-400">✅ {videoFiles.length} tệp đã chọn</p>
            )}
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <input
              type="checkbox"
              id="published"
              name="published"
              checked={formData.published}
              onChange={handleChange}
              className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-600 rounded bg-gray-700"
              disabled={uploading}
            />
            <label htmlFor="published" className="text-sm text-gray-300 cursor-pointer">
              📢 Xuất bản ngay lập tức
            </label>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 btn-christmas py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? '🎄 Đang tạo bài viết...' : '🎅 Tạo Bài Viết'}
            </button>
            <Link
              to="/admin/dashboard"
              className="flex-1 btn-christmas-secondary py-3 text-center text-lg"
            >
              ❌ Hủy
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;

