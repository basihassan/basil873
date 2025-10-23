import React from 'react';
import type { Post, User } from '../types';
import { ICONS } from '../constants';

interface PostCardProps {
  post: Post;
  onProfileClick: (user: User) => void;
  onCommentClick: (post: Post) => void;
  currentUser: User;
  onDeletePost: (postId: number) => void;
  onToggleLike: (postId: number) => void;
  isLiked: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, onProfileClick, onCommentClick, currentUser, onDeletePost, onToggleLike, isLiked }) => {
  const isOwner = currentUser.id === post.user.id;

  return (
    <div className="bg-white border-b border-gray-200 mb-0">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3 space-x-reverse cursor-pointer" onClick={() => onProfileClick(post.user)}>
          <img src={post.user.avatarUrl} alt={post.user.username} className="h-10 w-10 rounded-full object-cover" />
          <div>
            <p className="font-bold text-sm text-gray-800">{post.user.username}</p>
            <p className="text-xs text-gray-500">{post.timestamp}</p>
          </div>
        </div>
        {isOwner ? (
            <button onClick={() => onDeletePost(post.id)} className="text-red-500 hover:text-red-700">{ICONS.trash}</button>
        ) : (
            <button className="text-gray-500 hover:text-gray-800">{ICONS.more}</button>
        )}
      </div>

      <img src={post.imageUrl} alt="Post" className="w-full h-auto max-h-[70vh] object-cover" />

      <div className="p-4">
        <div className="flex items-center justify-between text-gray-700">
            <div className="flex items-center space-x-4 space-x-reverse">
                <button onClick={() => onToggleLike(post.id)} className={`flex items-center space-x-1 space-x-reverse transition-colors duration-200 ${isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}>
                    {React.cloneElement(ICONS.heart, { className: `h-7 w-7 ${isLiked ? 'fill-current' : ''}` })}
                    <span className="font-semibold text-sm">{post.likes}</span>
                </button>
                <button onClick={() => onCommentClick(post)} className="flex items-center space-x-1 space-x-reverse text-gray-600 hover:text-gray-800">
                    {React.cloneElement(ICONS.comment, { className: 'h-7 w-7'})}
                    <span className="font-semibold text-sm">{post.comments.length}</span>
                </button>
            </div>
            {post.price && (
                <div className="bg-pink-100 text-pink-700 font-bold text-sm px-3 py-1 rounded-full">
                    {post.price} ر.س
                </div>
            )}
        </div>

        <div className="mt-3 text-gray-800 text-sm">
          <span className="font-bold cursor-pointer" onClick={() => onProfileClick(post.user)}>{post.user.username}</span>
          <span className="mr-2">{post.description}</span>
        </div>
        
        <div className="mt-2 flex items-center gap-2 flex-wrap">
            {post.category && (
                <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    #{post.category}
                </span>
            )}
            {post.brand && (
                <span className="text-xs font-semibold bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                    {post.brand}
                </span>
            )}
        </div>

        <button onClick={() => onCommentClick(post)} className="mt-2 text-gray-500 text-sm">
          عرض كل التعليقات ({post.comments.length})
        </button>
      </div>
    </div>
  );
};

export default PostCard;
