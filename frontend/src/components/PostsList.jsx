import axios from "axios";
import TimeAgo from "./TimeAgo";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa6";
import { FaShareFromSquare } from "react-icons/fa6";
import { MdOutlineInsertComment } from "react-icons/md";
import { AiFillDelete } from "react-icons/ai";
import { AiFillEdit } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";
import { FaPenToSquare, FaTrash } from "react-icons/fa6";
import { FaComment, FaShare } from "react-icons/fa6";

const PostsList = ({
  post,
  user,
  onUpdatePost,
  onDeletePost,
  reFetchPost,
  setReFetchPost,
  setReFetchSharedPost,
  reFetchSharedPost,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [comment, setComment] = useState(null);
  const [editComment, setEditComment] = useState(false);
  const [commentId, setCommentId] = useState(null);
  const [shareModal, setShareModal] = useState(false);
  const [shareDescription, setShareDescription] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const navigate = useNavigate();
  const likeBtnClick = async (post) => {
    try {
      const res = await axios.post(
        `http://localhost:8080/posts/like?postId=${post.id}&userId=${user.id}`
      );
      console.log(res.data);
      setReFetchPost(!reFetchPost);
    } catch (error) {
      console.log(error);
    }
  };

  const navigateEditPage = () => {
    navigate(`/post/${post.id}`);
  };

  const deletePost = async (post) => {
    try {
      await axios.delete(`http://localhost:8080/posts/${post.id}`);
      setReFetchPost(!reFetchPost);
      toast.success("Post deleted successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const commentAdd = async (e) => {
    e.preventDefault();
    if (!comment) return toast.error("Comment is required");

    if (editComment) {
      try {
        await axios.put(
          `http://localhost:8080/posts/${post.id}/comments/${commentId}`,
          {
            content: comment,
          }
        );
        setComment("");
        setCommentId(null);
        setEditComment(false);
        setReFetchPost(!reFetchPost);
        toast.success("Comment updated successfully");
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const res = await axios.post(
          `http://localhost:8080/posts/${post.id}/comments`,
          {
            commentBy: user.name,
            commentById: user.id,
            commentByProfile: user.profileImage,
            content: comment,
          }
        );
        if (res.data) {
          setComment("");
          setReFetchPost(!reFetchPost);
          toast.success("Comment added successfully");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const deleteComment = async (comment) => {
    try {
      await axios.delete(
        `http://localhost:8080/posts/${post.id}/comments/${comment.id}`
      );
      toast.success("Comment deleted successfully");
      setReFetchPost(!reFetchPost);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditComment = (comment, postId) => {
    setComment(comment.content);
    setEditComment(true);
  };

  const handleShare = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:8080/share`, {
        description: shareDescription,
        userid: user.id,
        postId: post.id,
      });
      if (res.data) {
        setShareModal(false);
        toast.success("Post shared successfully");
        setReFetchSharedPost(!reFetchSharedPost);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = () => {
    // Implement the logic to update the post
    console.log("Post updated");
    setShowEditModal(false);
  };

  const handleDelete = () => {
    // Implement the logic to delete the post
    console.log("Post deleted");
    setShowDeleteModal(false);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 transition-colors duration-200 border border-gray-200 dark:border-white/20">
      <div className="flex justify-end mb-6">
        <button
          onClick={() => navigate('/post')}
          className="px-4 py-2 text-sm font-medium text-white bg-purple-600 dark:bg-purple-500 rounded-md shadow hover:bg-purple-700 dark:hover:bg-purple-600 focus:outline-none transition-colors"
        >
          + Add Post
        </button>
      </div>
      {/* Post Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
              <img
            src={post.userProfile}
            alt={post.username}
            className="w-10 h-10 rounded-full border-2 border-purple-500"
              />
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">{post.username}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {post.date ? <TimeAgo date={post.date} /> : 'Just now'}
            </p>
              </div>
            </div>
        {user && user.id === post.userId && (
          <div className="flex space-x-2">
            <button
              onClick={() => setShowEditModal(true)}
              className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors"
            >
              <FaPenToSquare className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
            >
              <FaTrash className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Post Content */}
      <div className="mb-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">{post.title}</h2>
        <p className="text-gray-700 dark:text-gray-300">{post.description}</p>
      </div>

      {/* Post Images */}
      {post.images && post.images.length > 0 && (
        <div className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {post.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Post image ${index + 1}`}
                className="w-full h-48 object-cover rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
              />
            ))}
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-gray-200 dark:border-gray-700 my-4" />

      {/* Post Actions */}
      <div className="flex items-center space-x-4 pt-4 pb-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <button
          onClick={() => likeBtnClick(post)}
          className={`flex items-center space-x-2 ${
            post.likedBy?.includes(user?.id)
              ? "text-red-600 dark:text-red-400"
              : "text-gray-600 dark:text-gray-400"
          } hover:text-red-600 dark:hover:text-red-400 transition-colors`}
        >
          <FaHeart className="w-5 h-5" />
          <span>{post.likeCount || 0}</span>
        </button>
        <button
              onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
        >
          <FaComment className="w-5 h-5" />
          <span>{post.comments?.length || 0}</span>
        </button>
        <button
          onClick={() => setShareModal(true)}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
        >
          <FaShare className="w-5 h-5" />
          <span>Share</span>
        </button>
      </div>

      {/* Comments Section */}
      {showModal && (
        <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="mb-4">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent dark:bg-gray-700 dark:text-gray-200"
              rows="2"
            />
            <button
              onClick={commentAdd}
              className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Comment
            </button>
          </div>
          <div className="space-y-4">
            {post.comments?.map((comment, index) => (
              <div key={index} className="flex space-x-3">
                <img
                  src={comment.commentByProfile}
                  alt={comment.commentBy}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">{comment.commentBy}</h4>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {comment.createdAt ? <TimeAgo date={comment.createdAt} /> : 'Just now'}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Edit Post</h2>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 dark:bg-gray-700 dark:text-gray-200"
              placeholder="Title"
            />
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 dark:bg-gray-700 dark:text-gray-200"
              placeholder="Description"
              rows="4"
                                />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Save Changes
              </button>
                          </div>
                        </div>
                      </div>
                    )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Delete Post</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Are you sure you want to delete this post?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
                  <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                Delete
                  </button>
            </div>
          </div>
        </div>
      )}

      {shareModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border border-gray-200 dark:border-gray rounded-lg shadow-lg relative flex flex-col bg-white dark:bg-gray-800 outline-none focus:outline-none w-[550px] h-[300px] px-10 justify-between py-10">
                <div className="text-center font-bold text-xl flex justify-between ">
                  <h1 className="text-blue-800 dark:text-blue-300">Share</h1>
                  <IoClose
                    color="red"
                    size={28}
                    className="cursor-pointer"
                    onClick={() => setShareModal(false)}
                  />
                </div>
                <form className="flex flex-col" onSubmit={handleShare}>
                  <textarea
                    className="border h-32 p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 rounded-md"
                    placeholder="Write something"
                    onChange={(e) => setShareDescription(e.target.value)}
                  ></textarea>
                  <button
                    type="submit"
                    className="bg-blue-500 dark:bg-blue-700 text-white mt-4 h-8 rounded hover:bg-blue-600 dark:hover:bg-blue-800 transition-colors"
                  >
                    Share
                  </button>
                </form>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default PostsList;
