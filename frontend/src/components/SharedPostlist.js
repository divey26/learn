import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import TimeAgo from "./TimeAgo";
import axios from "axios";
import toast from "react-hot-toast";
import { FaHeart, FaComment } from "react-icons/fa6";
// import { CiHeart } from "react-icons/ci";
// import { MdOutlineInsertComment } from "react-icons/md";
// import { IoClose } from "react-icons/io5";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import toast from "react-hot-toast";

export const SharedPostlist = ({
  post,
  user,//user
  reFetchSharedPost,
  setReFetchSharedPost,//hvfj
}) => {
  console.log(post, user, reFetchSharedPost, setReFetchSharedPost);
  //   const [showModal, setShowModal] = useState(false);
  //   const [comment, setComment] = useState(null);
  //   const [editComment, setEditComment] = useState(false);
  //   const [commentId, setCommentId] = useState(null);
  //   const [shareModal, setShareModal] = useState(false);
  //   const [shareDescription, setShareDescription] = useState("");

  //   const navigate = useNavigate();
  //   const likeBtnClick = async (post) => {
  //     try {
  //       const res = await axios.post(
  //         `http://localhost:8080/posts/like?postId=${post?.post?.id}&userId=${user.id}`
  //       );
  //       console.log(res.data);
  //       setReFetchPost(!reFetchPost);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   const navigateEditPage = () => {
  //     navigate(`/post/${post?.post?.id}`);
  //   };

  //   const deletePost = async (post) => {
  //     try {
  //       await axios.delete(`http://localhost:8080/posts/${post?.post?.id}`);
  //       setReFetchPost(!reFetchPost);
  //       toast.success("Post deleted successfully");
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   const commentAdd = async (e) => {
  //     e.preventDefault();
  //     if (!comment) return toast.error("Comment is required");

  //     if (editComment) {
  //       try {
  //         await axios.put(
  //           `http://localhost:8080/posts/${post?.post?.id}/comments/${commentId}`,
  //           {
  //             content: comment,
  //           }
  //         );
  //         setComment("");
  //         setCommentId(null);
  //         setEditComment(false);
  //         setReFetchPost(!reFetchPost);
  //         toast.success("Comment updated successfully");
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     } else {
  //       try {
  //         const res = await axios.post(
  //           `http://localhost:8080/posts/${post?.post?.id}/comments`,
  //           {
  //             commentBy: user.name,
  //             commentById: user.id,
  //             commentByProfile: user.profileImage,
  //             content: comment,
  //           }
  //         );
  //         if (res.data) {
  //           setComment("");
  //           setReFetchPost(!reFetchPost);
  //           toast.success("Comment added successfully");
  //         }
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     }
  //   };

  //   const deleteComment = async (comment) => {
  //     try {
  //       await axios.delete(
  //         `http://localhost:8080/posts/${post?.post?.id}/comments/${comment.id}`
  //       );
  //       toast.success("Comment deleted successfully");
  //       setReFetchPost(!reFetchPost);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   const handleEditComment = (comment, postId) => {
  //     setComment(comment.content);
  //     setEditComment(true);
  //   };

  //   const handleShare = async (e) => {
  //     e.preventDefault();
  //     try {
  //       const res = await axios.post(`http://localhost:8080/share`, {
  //         description: shareDescription,
  //         userid: user.id,
  //         postId: post?.post?.id,
  //       });
  //       if (res.data) {
  //         setShareModal(false);
  //         toast.success("Post shared successfully");
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  const sharedPostDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/share/${post.id}`);
      setReFetchSharedPost(!reFetchSharedPost);
      toast.success("Post deleted successfully");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 transition-colors duration-200">
      {/* Post Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
                <img
                  src={post?.sharedBy?.profileImage}
            alt={post?.sharedBy?.name}
            className="w-10 h-10 rounded-full border-2 border-purple-500"
                />
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">{post?.sharedBy?.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {post?.post?.date ? <TimeAgo date={post.post.date} /> : 'Just now'}
            </p>
                </div>
              </div>
              <div className="bg-gray-100	rounded-full h-3.5 flex	items-center justify-center gap-3">
                {user?.id === post?.sharedBy?.id && (
                  <>
                    <AiFillDelete
                      size={20}
                      color="red"
                      className="cursor-pointer"
                      onClick={sharedPostDelete}
                    />
                  </>
                )}
              </div>
            </div>

      {/* Post Content */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">{post?.post?.title}</h2>
        <p className="text-gray-600 dark:text-gray-300">{post?.post?.description}</p>
            </div>

      {/* Post Images */}
      {post?.post?.images && post?.post?.images.length > 0 && (
        <div className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {post?.post?.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Post image ${index + 1}`}
                className="w-full h-48 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>
      )}

      {/* Post Actions */}
      <div className="flex items-center space-x-4 border-t border-gray-200 dark:border-gray-700 pt-4">
        <button
          onClick={() => {}}
          className={`flex items-center space-x-2 ${
            post?.post?.likedBy?.includes(user?.id)
              ? "text-red-600 dark:text-red-400"
              : "text-gray-600 dark:text-gray-400"
          } hover:text-red-600 dark:hover:text-red-400 transition-colors`}
        >
          <FaHeart className="w-5 h-5" />
          <span>{post?.post?.likeCount || 0}</span>
        </button>
        <button
          onClick={() => {}}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
        >
          <FaComment className="w-5 h-5" />
          <span>{post?.post?.comments?.length || 0}</span>
        </button>
      </div>

      {/* Comments Section */}
      {/* {showComments && (
        <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="mb-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent dark:bg-gray-700 dark:text-gray-200"
              rows="2"
            />
            <button
              onClick={handleAddComment}
              className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Comment
            </button>
                </div>
          <div className="space-y-4">
            {post?.post?.comments?.map((comment, index) => (
              <div key={index} className="flex space-x-3">
                              <img
                                src={comment?.commentByProfile}
                  alt={comment?.commentBy}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">{comment?.commentBy}</h4>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                <TimeAgo date={comment?.createdAt} />
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">{comment?.content}</p>
                </div>
              </div>
            ))}
          </div>
                </div>
      )} */}
    </div>
  );
};
