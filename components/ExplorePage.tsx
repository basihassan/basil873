
import React, { useState, useEffect } from 'react';
import type { Post } from '../types';
import { ICONS } from '../constants';

interface ExplorePageProps {
    posts: Post[];
    onPostClick: (post: Post) => void;
}

const ExplorePage: React.FC<ExplorePageProps> = ({ posts, onPostClick }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Post[]>([]);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setSearchResults([]);
            return;
        }

        const lowercasedQuery = searchQuery.toLowerCase();
        const filteredPosts = posts.filter(post => {
            const descriptionMatch = post.description.toLowerCase().includes(lowercasedQuery);
            const brandMatch = post.brand?.toLowerCase().includes(lowercasedQuery);
            const categoryMatch = post.category?.toLowerCase().includes(lowercasedQuery);
            return descriptionMatch || brandMatch || categoryMatch;
        });

        setSearchResults(filteredPosts);
    }, [searchQuery, posts]);

    return (
        <div className="pb-20 h-full">
            <div className="p-4 sticky top-0 bg-gray-50 z-10">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="ابحث عن أزياء, ماركات, والمزيد..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-lg shadow-sm p-3 pl-10 focus:ring-pink-500 focus:border-pink-500 transition"
                        aria-label="Search posts"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        {ICONS.explore}
                    </div>
                </div>
            </div>

            {searchQuery.trim() === '' ? (
                 <div className="text-center p-10 text-gray-500 flex flex-col items-center justify-center h-1/2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <p>ابحث عن المنشورات حسب الوصف أو الماركة أو النوع.</p>
                </div>
            ) : searchResults.length > 0 ? (
                <div className="grid grid-cols-3 gap-1">
                    {searchResults.map(post => (
                        <button key={post.id} onClick={() => onPostClick(post)} className="aspect-square bg-gray-200 block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500">
                            <img src={post.imageUrl} alt={post.description.substring(0, 50)} className="w-full h-full object-cover"/>
                        </button>
                    ))}
                </div>
            ) : (
                <div className="text-center p-10 text-gray-500 flex flex-col items-center justify-center h-1/2">
                    <p className="text-lg">لم يتم العثور على نتائج لـ</p>
                    <p className="font-bold text-xl text-gray-600">"{searchQuery}"</p>
                </div>
            )}
        </div>
    );
};

export default ExplorePage;
