"use client";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineHeart, AiFillHeart, AiOutlineMessage } from "react-icons/ai";

interface PostData {
  _id?: string;
  userId?: string;
  caption?: string;
  mediaURL?: string;
  createdAt?: Date;
  username?: string;
  fullname?: string;
  likes?: number;
  likedBy?: string[];
}

const VideoCard = ({
  post,
  currentUserId,
}: {
  post: PostData;
  currentUserId: string;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [likes, setLikes] = useState<number>(post.likes || 0);
  const [isLiked, setIsLiked] = useState<boolean>(
    post.likedBy?.includes(currentUserId) ?? false
  );
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [showCommentModal, setShowCommentModal] = useState<boolean>(false);

  console.log(post.likedBy?.includes(currentUserId));

  useEffect(() => {
    const showPreviousComments = async () => {
      try {
        const token = localStorage.getItem("token");
        await axios
          .get(`http://localhost:3000/api/posts/comment/${post._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            setComments([...(res.data.post.comments).reverse()]);
          })
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .catch((err: any) => {
            console.log(err.message );
          });
      } catch (error: any) {
        console.log("Error in getting comments", error.message);
      }
    };

    showPreviousComments();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current?.play();
          setIsPlaying(true);
        } else {
          videoRef.current?.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.65 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };

    
    
  }, []);

  const handlePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleLike = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/api/posts/allPosts",
        { postId: post._id, userId: currentUserId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedPost = response.data.post;
      setLikes(updatedPost.likes || 0);
      setIsLiked(
        Array.isArray(updatedPost.likedBy) &&
          updatedPost.likedBy.includes(currentUserId)
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("Error toggling like:", error.message);
    }
  };

  

  const handleComment = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios
        .post(
          "http://localhost:3000/api/posts/comment",
          { postId: post._id, userId: currentUserId, comment: newComment },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          setComments([...(res.data.post.comments).reverse()]);
          console.log(res.data.post.comments);
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .catch((err: any) => {
          console.log(err.message);
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("Error in commenting post", error.message);
    }
    setNewComment("");
  };

  const controlPlayWhenModalOpen = () => {
    if (showCommentModal) {
      videoRef.current?.play();
      setIsPlaying(true);
    } else {
      videoRef.current?.pause();
      setIsPlaying(false);
    }
  };

  console.log(comments)
  function timeAgo(createdAt: any) {
    const now = new Date() as any;
    const postTime = new Date(createdAt) as any;
    const differenceInSeconds = Math.floor((now  - postTime  ) / 1000);
  
    if (differenceInSeconds < 60) {
      return `${differenceInSeconds} seconds ago`;
    }
  
    const differenceInMinutes = Math.floor(differenceInSeconds / 60);
    if (differenceInMinutes < 60) {
      return `${differenceInMinutes} minutes ago`;
    }
  
    const differenceInHours = Math.floor(differenceInMinutes / 60);
    if (differenceInHours < 24) {
      return `${differenceInHours} hours ago`;
    }
  
    const differenceInDays = Math.floor(differenceInHours / 24);
    return `${differenceInDays} days ago`;
  }
  

  const toggleCommentModal = () => setShowCommentModal(!showCommentModal);

  return (
    <div className="flex flex-col border-b border-slate-700 pb-2 mb-5">
      {/* Header */}
      <div className="flex px-4 mb-1 gap-4">
        <Image
          src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
          width={100}
          height={100}
          alt={`${post.username}'s profile picture`}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex flex-col">
          <p className="text-sm font-bold">{post.fullname}</p>
          <p className="text-xs text-gray-500">@{post.username}</p>
          {/* <p className="text-xs text-gray-500">{post.caption}</p> */}
        </div>
      </div>

      {/* Video Content */}
      <div className="flex justify-center w-full h-auto">
        <video
          ref={videoRef}
          src={post.mediaURL}
          loop
          onClick={handlePlay}
          onDoubleClick={toggleLike}
          playsInline
          className="w-full max-w-xs rounded-lg cursor-pointer"
        />
      </div>

      <div className="flex items-center justify-start gap-2 py-2">
        <button onClick={toggleLike} className="focus:outline-none">
          {isLiked ? (
            <AiFillHeart className="text-red-600 text-2xl" />
          ) : (
            <AiOutlineHeart className="text-gray-500 text-2xl" />
          )}
        </button>
        <button onClick={()=>{
          toggleCommentModal()
          controlPlayWhenModalOpen()
        }} className="focus:outline-none">
          <AiOutlineMessage className="text-gray-500 text-2xl" />
        </button>
      </div>
      <div>
        <p className="text-sm text-gray-500">{likes} likes</p>
        <p className="text-sm text-gray-500">{comments.length} comments</p>
      </div>

      {/* Comment Modal */}
      {showCommentModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-[600px] rounded-lg overflow-hidden flex">
            {/* Left side - Video */}
            <div className="flex-1 flex justify-center items-center p-4">
              <video
                src={post.mediaURL}
                loop
                autoPlay
                controls
                className="w-full h-full rounded-lg"
              />
            </div>

            {/* Right side - Comments */}
            <div className="flex-1 bg-gray-900 p-4 relative">
              <h3 className="text-lg font-semibold mb-4">Comments</h3>
              <div className="overflow-y-auto h-80">
                {comments.length > 0 ? (
                  comments.map((e: any, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <Image
                        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                        width={100}
                        height={100}
                        alt={`${e.username}'s profile picture`}
                        className="w-7 h-7 rounded-full"
                      />
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold">
                            {e.userId.username}
                          </p>
                          <span className="text-sm text-white ">
                            {e.comment}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">{timeAgo(e.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No comments yet.</p>
                )}
              </div>
              <div className="flex mt-4 gap-2 items-center">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="border rounded-lg px-4 py-2 flex-1"
                />
                <button
                  onClick={handleComment}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Post
                </button>
              </div>
              <button
                onClick={toggleCommentModal}
                className="absolute top-2 right-2 text-white text-xl"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FeedCard = () => {
  const [postData, setPostData] = useState<PostData[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/posts/allPosts",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPostData(response.data.posts);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.log("Error fetching data:", error.message);
      }
    };

    const userData = async () => {
      await axios
        .get("http://localhost:3000/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setCurrentUserId(res.data.user._id);
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .catch((err: any) => {
          console.log(err.message);
        });
    };
    userData();
    fetchData();
  }, []);

  return (
    <div className="flex flex-col">
      {postData.length > 0 ? (
        postData.map((post) => (
          <VideoCard key={post._id} post={post} currentUserId={currentUserId} />
        ))
      ) : (
        <div className="flex justify-center p-4">
          <p className="text-center">No Posts Yet</p>
        </div>
      )}
    </div>
  );
};

export default FeedCard;
