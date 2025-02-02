import { Formik, Form, Field } from 'formik';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters')
    .required('Title is required'),
  image: Yup.mixed()
    .required('Image is required')
    .test(
      'fileSize',
      'File size must be less than 2MB',
      (value) => value && value.size <= 2 * 1024 * 1024
    )
    .test(
      'fileType',
      'Only JPG, PNG, and GIF formats are allowed',
      (value) =>
        value && ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(value.type)
    ),
  description: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .max(5000, 'Description must be less than 1000 characters')
    .required('Description is required'),
});

function AddPost({ post }) {
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('image', values.image);
    formData.append('description', values.description);
    formData.append('author', 'Anonymous');

    try {
      if (post) {
        // Update existing post
        await axios.put(`https://blog-post-backend.vercel.app/api/post/${post._id}`, formData);
        toast.success('Post updated successfully!');
      } else {
        // Create new post
        await axios.post('https://blog-post-backend.vercel.app/api/add-post', formData);
        toast.success('Post added successfully!');
      }
      navigate('/posts');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save the post.');
      console.error('Error:', error.response?.data || error.message);
    }

    setSubmitting(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gray-900 rounded-lg shadow-xl p-8 border border-purple-500">
        <h2 className="text-2xl font-bold text-center text-purple-500 mb-6">
          {post ? 'Edit Post' : 'Create New Post'}
        </h2>
        <Formik
          initialValues={{
            title: post?.title || '',
            image: null,
            description: post?.description || '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, errors, touched, isSubmitting }) => (
            <Form className="space-y-6">
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Title</label>
                <Field
                  name="title"
                  type="text"
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="Enter post title"
                />
                {errors.title && touched.title && (
                  <div className="text-red-500 text-sm mt-1">{errors.title}</div>
                )}
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    setFieldValue('image', event.currentTarget.files[0]);
                  }}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:border-purple-500 transition-colors"
                />
                {errors.image && touched.image && (
                  <div className="text-red-500 text-sm mt-1">{errors.image}</div>
                )}
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Description</label>
                <Field
                  name="description"
                  as="textarea"
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:border-purple-500 transition-colors h-32"
                  placeholder="Enter post description"
                />
                {errors.description && touched.description && (
                  <div className="text-red-500 text-sm mt-1">{errors.description}</div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (post ? 'Updating...' : 'Creating...') : post ? 'Update Post' : 'Create Post'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default AddPost;
