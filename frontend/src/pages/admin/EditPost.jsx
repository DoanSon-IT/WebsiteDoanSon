import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { adminBlogAPI } from '../../services/api';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    authorName: '',
    published: true,
    imageUrls: [],
    videoUrls: []
  });
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newVideoFiles, setNewVideoFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await adminBlogAPI.getPostById(id);
      setFormData(response.data);
    } catch (err) {
      setError('Không thể tải bài viết');
      console.error('Lỗi khi tải bài viết:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e) => {
    setNewImageFiles(Array.from(e.target.files));
  };

  const handleVideoChange = (e) => {
    setNewVideoFiles(Array.from(e.target.files));
  };

  const removeExistingImage = (index) => {
    if (!window.confirm('🎄 Bạn có chắc chắn muốn xóa hình ảnh này không?')) {
      return;
    }
    const newImageUrls = [...formData.imageUrls];
    newImageUrls.splice(index, 1);
    setFormData({ ...formData, imageUrls: newImageUrls });
  };

  const removeExistingVideo = (index) => {
    if (!window.confirm('🎄 Bạn có chắc chắn muốn xóa video này không?')) {
      return;
    }
    const newVideoUrls = [...formData.videoUrls];
    newVideoUrls.splice(index, 1);
    setFormData({ ...formData, videoUrls: newVideoUrls });
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

      let imageUrls = [...formData.imageUrls];
      let videoUrls = [...formData.videoUrls];

      // Upload new images
      if (newImageFiles.length > 0) {
        const imageUploadPromises = newImageFiles.map(file =>
          adminBlogAPI.uploadImage(file)
        );
        const imageResponses = await Promise.all(imageUploadPromises);
        const newImageUrls = imageResponses.map(res => res.data);
        imageUrls = [...imageUrls, ...newImageUrls];
      }

      // Upload new videos
      if (newVideoFiles.length > 0) {
        const videoUploadPromises = newVideoFiles.map(file =>
          adminBlogAPI.uploadVideo(file)
        );
        const videoResponses = await Promise.all(videoUploadPromises);
        const newVideoUrls = videoResponses.map(res => res.data);
        videoUrls = [...videoUrls, ...newVideoUrls];
      }

      // Update post
      const postData = {
        title: formData.title,
        content: formData.content,
        authorName: formData.authorName,
        published: formData.published,
        imageUrls,
        videoUrls
      };

      await adminBlogAPI.updatePost(id, postData);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Không thể cập nhật bài viết: ' + (err.response?.data?.message || err.message));
      console.error('Lỗi khi cập nhật bài viết:', err);
    } finally {
      setUploading(false);
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link to="/admin/dashboard" className="btn-christmas-secondary inline-flex items-center gap-2 mb-4">
            <span>←</span> Quay lại Dashboard
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold christmas-gradient-text christmas-glow mb-2">
            ✏️ Chỉnh Sửa Bài Viết 🎄
          </h1>
          <p className="text-gray-400">Cập nhật nội dung bài viết của bạn</p>
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

          {/* Existing Images */}
          {formData.imageUrls && formData.imageUrls.length > 0 && (
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                🖼️ Hình ảnh hiện tại
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {formData.imageUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Hình ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border-2 border-gray-700 group-hover:border-red-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700 transition-all shadow-lg"
                      disabled={uploading}
                      title="Xóa hình ảnh"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label htmlFor="images" className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              ➕ Thêm hình ảnh mới
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
            {newImageFiles.length > 0 && (
              <p className="mt-2 text-sm text-green-400">✅ {newImageFiles.length} tệp mới đã chọn</p>
            )}
          </div>

          {/* Existing Videos */}
          {formData.videoUrls && formData.videoUrls.length > 0 && (
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                🎥 Video hiện tại
              </label>
              <div className="space-y-3">
                {formData.videoUrls.map((url, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <span className="text-sm text-gray-300 truncate flex items-center gap-2">
                      🎬 Video {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeExistingVideo(index)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all text-sm"
                      disabled={uploading}
                    >
                      🗑️ Xóa
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label htmlFor="videos" className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              ➕ Thêm video mới
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
            {newVideoFiles.length > 0 && (
              <p className="mt-2 text-sm text-green-400">✅ {newVideoFiles.length} tệp mới đã chọn</p>
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
              📢 Đã xuất bản
            </label>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 btn-christmas py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? '🎄 Đang cập nhật...' : '✅ Cập Nhật Bài Viết'}
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

export default EditPost;

