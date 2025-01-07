"use client";
import axios from "axios";
import e from "cors";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

interface CommentData {
  comment?: string;
  userId?:{ username:string , _id:string};
  username?: string;
  createdAt?: string | number | Date;
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
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [showCommentModal, setShowCommentModal] = useState<boolean>(false);
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);
  const router = useRouter();

  // Check if the screen is small
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1024); // Adjust breakpoint as needed (1024px here for "lg")
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  
  useEffect(() => {
    const showPreviousComments = async () => {
      try {
        const token = localStorage.getItem("token");
        await axios
          .get(`/api/posts/comment/${post._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            setLikes(res.data.post.likes || 0);
            setComments([...(res.data.post.comments).reverse()]);
            setIsLiked(res.data.post.likedBy.includes(currentUserId));
          })
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .catch((err: any) => {
            console.log(err.message );
          });
           // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    
    
  }, [post._id, currentUserId]);


  const handlePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false)
      } else {
        videoRef.current.play();
      }
      setIsPlaying(true);
    }
  };

  const toggleLike = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `/api/posts/allPosts`,
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
          `/api/posts/comment`,
          { postId: post._id, userId: currentUserId, comment: newComment },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          setComments([...(res.data.post.comments).reverse()]);
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

  function timeAgo(createdAt: string | number | Date): string {
    const now = new Date();
    const postTime = new Date(createdAt);
    const differenceInSeconds = Math.floor((now.getTime() - postTime.getTime()) / 1000);
  
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

  const handleProfileClick = () => {
    const loggedInUserId = localStorage.getItem("userId");
    if(loggedInUserId === post.userId){
      router.push("/profile");
    }else{
      router.push(`/profile/${post.userId}`);
    }
  }


  return (
    <div className={`flex flex-col lg:border-b snap-start  border-slate-700 lg:pb-3 lg:mb-2 h-screen w-screen lg:w-full lg:h-full relative  `}>
    {/* Header */}
    <div className="absolute top-4 left-4  lg:relative lg:left-0 lg:top-0 flex gap-4 lg:py-4 items-center z-10">
      <button onClick={handleProfileClick}>
      <Image
        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
        width={100}
        height={100}
        alt={`${post._id}'s profile picture`}
        className="w-10 h-10 rounded-full"
      />
      
      </button>
      <button onClick={handleProfileClick} className="flex flex-col">
        <p className="text-sm font-bold">{post.fullname}</p>
        <p className="text-xs text-gray-500">@{post.username}</p>
      </button>
    </div>
  
    {/* Video Content */}
    <div className="flex justify-center items-center w-full h-full">
      <video
        ref={videoRef}
        src={post.mediaURL}
        loop
        onClick={handlePlay}
        onDoubleClick={toggleLike}
        playsInline
        className="w-full h-full object-cover lg:max-w-xs cursor-pointer lg:rounded-lg"
      />
    </div>
  
    {/* Like and Comment Icons */}
    <div className="absolute  top-[60%] lg:top-0 lg:right-0  right-8 lg:relative flex flex-col lg:flex-row lg:mt-2 items-center gap-4 z-10">
      <button onClick={()=>{toggleLike()}} className="focus:outline-none">
        {isLiked ? (
          <AiFillHeart className="text-red-600 lg:text-2xl text-3xl" />
        ) : (
          <AiOutlineHeart className="text-white lg:text-2xl text-3xl" />
        )}
      <p className="text-sm lg:hidden  text-white">{likes}</p>
      </button>
      <button
        onClick={() => {
          setShowCommentModal(true)
          controlPlayWhenModalOpen();
        }}
        className="focus:outline-none"
      >
        <AiOutlineMessage className="text-white lg:text-2xl text-3xl" />
        <p className="text-sm lg:hidden text-white">{comments.length}</p>
      </button>
    </div>
  
    {/* Like and Comment Counts on lg and above */}
    <div className="hidden lg:block">
      <p className="text-sm text-gray-500">{likes} likes</p>
      <p className="text-sm text-gray-500">{comments.length} comments</p>
    </div>
  
    {/* Comment Modal */}
    {showCommentModal && (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4">
        <div className="bg-white w-full lg:max-w-[600px] rounded-lg overflow-hidden flex flex-col lg:flex-row">
          {/* Left side - Video */}
          {!isSmallScreen && (
          <div className="lg:flex-1 justify-center items-center p-4 hidden lg:flex">
            <video
              src={post.mediaURL}
              loop
              autoPlay
              controls
              className="lg:w-full lg:h-full rounded-lg "
            />
          </div>
            
          )}
  
          {/* Right side - Comments */}
          <div className="lg:flex-1 bg-gray-900 p-4 relative">
            <h3 className="text-lg font-semibold mb-4">Comments</h3>
            <div className="overflow-y-auto h-80">
              {comments.length > 0 ? (
                comments.map((e, index) => (
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
                        <p className="text-sm font-bold">{(e.userId)!.username}</p>
                        <span className="text-sm text-white">{e.comment}</span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">
                          {timeAgo(e.createdAt!)}
                        </p>
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
              onClick={()=>{setShowCommentModal(false)}}
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
          `/api/posts/allPosts`,
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
        .get(`/api/users/me`, {
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
    <div className="flex flex-col overflow-y-scroll h-screen lg:h-auto lg:overflow-y-auto snap-y snap-mandatory lg:snap-none ">
    {postData.length > 0 ? (
      postData.map((post) => (
        <div key={post._id} className="snap-start w-full">
          <VideoCard post={post} currentUserId={currentUserId} />
        </div>
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


