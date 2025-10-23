
import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { User, Post, Conversation, Message, Comment } from './types';
import { ICONS } from './constants';
import PostCard from './components/PostCard';
import MessageBubble from './components/MessageBubble';
import ExplorePage from './components/ExplorePage';

type Page = 'home' | 'explore' | 'upload' | 'messages' | 'profile' | 'chat' | 'editProfile' | 'postDetail' | 'comments';
type AuthMode = 'login' | 'signup';


const createInitialData = () => {
    const initialUsers: User[] = [
      {
        id: 1,
        username: "sara_fashion",
        avatarUrl: "https://picsum.photos/id/1027/200/200",
        fullName: "سارة عبدالله",
        followers: 1250,
        following: 320,
        postsCount: 1,
        bio: "أحب الموضة والأناقة ✨ أشارككم تنسيقاتي اليومية.",
        instagram: "sara.fashion",
        twitter: "sara_tweets",
        website: "sara-styles.com",
        password: "password123",
      },
      {
        id: 2,
        username: "ahmed_style",
        avatarUrl: "https://picsum.photos/id/1005/200/200",
        fullName: "أحمد خالد",
        followers: 850,
        following: 150,
        postsCount: 1,
        bio: "مستشار مظهر | مهتم بأزياء الرجال.",
        instagram: "ahmedstyle",
        password: "password123",
      },
       {
        id: 3,
        username: "noor_closet",
        avatarUrl: "https://picsum.photos/id/1011/200/200",
        fullName: "نور علي",
        followers: 2300,
        following: 500,
        postsCount: 1,
        bio: "خزانتي للبيع 🛍️ قطع فريدة بأسعار مميزة.",
        password: "password123",
      },
    ];

    const initialComments: Comment[] = [
        {id: 1, user: initialUsers[1], text: "قطعة جميلة جداً!", timestamp: "منذ 5 دقائق"},
        {id: 2, user: initialUsers[2], text: "كم السعر؟", timestamp: "منذ 10 دقائق"},
    ];

    const initialPosts: Post[] = [
      {
        id: 1,
        user: initialUsers[2], 
        imageUrl: "https://picsum.photos/id/21/600/800",
        description: "فستان سهرة أنيق باللون الأحمر، جديد لم يستخدم. مثالي للمناسبات الخاصة.",
        price: 350,
        likes: 152,
        comments: initialComments,
        timestamp: "منذ 2 ساعة",
        brand: "مصمم محلي",
        category: "فساتين"
      },
      {
        id: 2,
        user: initialUsers[1],
        imageUrl: "https://picsum.photos/id/180/600/800",
        description: "تنسيق كاجوال ليوم عمل. سترة من زارا وبنطلون من ماسيمو دوتي.",
        likes: 98,
        comments: [{id: 3, user: initialUsers[0], text: "أنيق!", timestamp: "منذ ساعة"}],
        timestamp: "منذ 5 ساعة",
        brand: "Zara",
        category: "ملابس رجالية"
      },
      {
        id: 3,
        user: initialUsers[0],
        imageUrl: "https://picsum.photos/id/327/600/800",
        description: "حقيبة يد من الجلد الطبيعي باللون البيج. استعمال خفيف جداً، حالتها ممتازة.",
        price: 450,
        likes: 230,
        comments: [],
        timestamp: "منذ يوم",
        brand: "Michael Kors",
        category: "حقائب"
      },
    ];
    
    const initialConversations: Conversation[] = [
        {
            id: 1,
            user: initialUsers[2],
            messages: [
                { id: 1, senderId: 3, text: "مرحبا، هل الفستان الأحمر مازال متوفر؟", timestamp: "10:30 ص" },
                { id: 2, senderId: 1, text: "أهلاً بك، نعم مازال متوفر.", timestamp: "10:32 ص" },
            ]
        },
    ];

    return { initialUsers, initialPosts, initialConversations };
};


// --- Auth Page Component ---
const AuthPage: React.FC<{ 
    onLogin: (username: string, pass: string) => boolean;
    onSignUp: (data: {fullName: string, username: string, password: string}) => boolean;
}> = ({ onLogin, onSignUp }) => {
    const [mode, setMode] = useState<AuthMode>('login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        let success = false;
        if (mode === 'login') {
            success = onLogin(username, password);
            if (!success) setError('اسم المستخدم أو كلمة المرور غير صحيحة.');
        } else {
             if (!fullName || !username || !password) {
                setError('الرجاء تعبئة جميع الحقول.');
                return;
            }
            success = onSignUp({ fullName, username, password });
            if (!success) setError('اسم المستخدم موجود بالفعل. الرجاء اختيار اسم آخر.');
        }
    };

    const toggleMode = () => {
        setMode(prev => prev === 'login' ? 'signup' : 'login');
        setError('');
        setUsername('');
        setPassword('');
        setFullName('');
    };

    return (
        <div className="max-w-md mx-auto h-screen bg-gray-50 flex flex-col justify-center items-center p-8">
            <div className="w-full max-w-sm">
                <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                    ستايلاتي
                </h1>
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg space-y-6">
                    {mode === 'signup' && (
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-bold text-gray-700 mb-2">الاسم الكامل</label>
                            <input
                                type="text"
                                id="fullName"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-pink-500 focus:border-pink-500 transition"
                                placeholder="e.g. سارة عبدالله"
                            />
                        </div>
                    )}
                    <div>
                        <label htmlFor="username" className="block text-sm font-bold text-gray-700 mb-2">اسم المستخدم</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-pink-500 focus:border-pink-500 transition"
                            placeholder="e.g. sara_fashion"
                        />
                    </div>
                    <div>
                        <label htmlFor="password"  className="block text-sm font-bold text-gray-700 mb-2">كلمة المرور</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-pink-500 focus:border-pink-500 transition"
                            placeholder="••••••••••"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <button type="submit" className="w-full bg-pink-500 text-white font-bold py-3 rounded-lg hover:bg-pink-600 transition-colors text-lg shadow-md">
                        {mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب'}
                    </button>
                    <p className="text-sm text-center text-gray-600">
                        {mode === 'login' ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}
                        <button type="button" onClick={toggleMode} className="font-bold text-pink-500 hover:underline mr-1">
                             {mode === 'login' ? 'إنشاء حساب' : 'تسجيل الدخول'}
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
};


// Page Components
const HomePage: React.FC<{ 
    posts: Post[]; 
    onProfileClick: (user: User) => void;
    onCommentClick: (post: Post) => void;
    currentUser: User;
    onDeletePost: (postId: number) => void;
    onToggleLike: (postId: number) => void;
    likedPostIds: Set<number>;
}> = ({ posts, onProfileClick, onCommentClick, currentUser, onDeletePost, onToggleLike, likedPostIds }) => (
    <div className="pt-0 pb-20 divide-y divide-gray-200">
        {posts.map(post => (
            <PostCard 
                key={post.id} 
                post={post} 
                onProfileClick={onProfileClick} 
                onCommentClick={onCommentClick} 
                currentUser={currentUser}
                onDeletePost={onDeletePost}
                onToggleLike={onToggleLike}
                isLiked={likedPostIds.has(post.id)}
            />
        ))}
    </div>
);

const ProfileHeader: React.FC<{user: User}> = ({ user }) => (
    <div className="p-4">
        <div className="flex items-center space-x-4 space-x-reverse">
            <img src={user.avatarUrl} alt={user.username} className="h-20 w-20 md:h-28 md:w-28 rounded-full object-cover border-2 border-pink-300 p-1"/>
            <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-800">{user.username}</h2>
                <p className="text-sm text-gray-600">{user.fullName}</p>
                 <div className="flex flex-col items-start space-y-1 mt-2 text-sm">
                    {user.instagram && <a href={`https://instagram.com/${user.instagram}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">@{user.instagram}</a>}
                    {user.twitter && <a href={`https://twitter.com/${user.twitter}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">@{user.twitter}</a>}
                    {user.website && (
                        <a href={`https://${user.website.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 space-x-reverse text-pink-600 hover:underline">
                            {React.cloneElement(ICONS.link, { className: "h-4 w-4"})}
                            <span>{user.website.replace(/^https?:\/\//, '')}</span>
                        </a>
                    )}
                </div>
            </div>
        </div>
        <p className="text-sm text-gray-700 my-3">{user.bio}</p>
        <div className="flex justify-around text-center border-t border-b border-gray-200 py-2 my-3">
            <div><span className="font-bold block">{user.postsCount}</span><span className="text-gray-500 text-sm">منشورات</span></div>
            <div><span className="font-bold block">{user.followers}</span><span className="text-gray-500 text-sm">متابعون</span></div>
            <div><span className="font-bold block">{user.following}</span><span className="text-gray-500 text-sm">متابَعة</span></div>
        </div>
    </div>
);

const ProfilePage: React.FC<{ 
    user: User | null; 
    posts: Post[];
    currentUser: User;
    onEditProfile: () => void;
    onLogout: () => void;
    onStartConversation: (user: User) => void;
    onPostClick: (post: Post) => void;
}> = ({ user, posts, currentUser, onEditProfile, onLogout, onStartConversation, onPostClick }) => {
    if (!user) return <div className="p-4 text-center">لم يتم العثور على المستخدم.</div>;
    const userPosts = posts.filter(p => p.user.id === user.id);
    const isCurrentUser = user.id === currentUser.id;

    return (
        <div className="pb-20">
            <ProfileHeader user={user} />
            <div className="px-4 space-y-2">
                 {isCurrentUser ? (
                    <>
                        <button onClick={onEditProfile} className="w-full bg-gray-200 text-gray-800 font-bold py-2 rounded-lg hover:bg-gray-300 transition-colors">
                            تعديل الملف الشخصي
                        </button>
                        <button onClick={onLogout} className="w-full bg-red-100 text-red-600 font-bold py-2 rounded-lg hover:bg-red-200 transition-colors">
                            تسجيل الخروج
                        </button>
                    </>
                 ) : (
                    <div className="flex w-full gap-2">
                        <button className="flex-1 bg-pink-500 text-white font-bold py-2 rounded-lg hover:bg-pink-600 transition-colors">
                            متابعة
                        </button>
                        <button onClick={() => onStartConversation(user)} className="flex-1 bg-gray-200 text-gray-800 font-bold py-2 rounded-lg hover:bg-gray-300 transition-colors">
                            مراسلة
                        </button>
                    </div>
                 )}
            </div>
            <div className="grid grid-cols-3 gap-1 mt-4">
                {userPosts.map(post => (
                    <button key={post.id} onClick={() => onPostClick(post)} className="aspect-square bg-gray-200 block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500">
                        <img src={post.imageUrl} alt={post.description.substring(0, 50)} className="w-full h-full object-cover"/>
                    </button>
                ))}
            </div>
        </div>
    );
};

const EditProfilePage: React.FC<{
    user: User;
    onSave: (updatedUser: User) => void;
    onBack: () => void;
}> = ({ user, onSave, onBack }) => {
    const [formData, setFormData] = useState<User>(user);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    }

    return (
        <div className="h-full flex flex-col">
             <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white shadow-sm sticky top-0">
                <button onClick={onBack} className="text-gray-600 p-2">{ICONS.back}</button>
                <h1 className="font-bold text-lg text-gray-800">تعديل الملف الشخصي</h1>
                <button onClick={handleSubmit} className="text-pink-500 font-bold p-2">حفظ</button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col items-center">
                        <img src={formData.avatarUrl} alt="Avatar" className="h-24 w-24 rounded-full object-cover"/>
                        <button type="button" className="text-sm font-bold text-blue-500 mt-2">
                            تغيير صورة الملف الشخصي
                        </button>
                    </div>
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل</label>
                        <input type="text" name="fullName" id="fullName" value={formData.fullName} onChange={handleChange} className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-pink-500 focus:border-pink-500" />
                    </div>
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">اسم المستخدم</label>
                        <input type="text" name="username" id="username" value={formData.username} readOnly className="w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100 text-gray-500" />
                    </div>
                     <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">النبذة التعريفية</label>
                        <textarea name="bio" id="bio" value={formData.bio} onChange={handleChange} rows={3} className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-pink-500 focus:border-pink-500"></textarea>
                    </div>
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-800 mb-2">روابط التواصل الاجتماعي</h3>
                         <div>
                            <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-1">انستغرام</label>
                            <input type="text" name="instagram" id="instagram" placeholder="username" value={formData.instagram || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-pink-500 focus:border-pink-500" />
                        </div>
                         <div className="mt-4">
                            <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 mb-1">تويتر</label>
                            <input type="text" name="twitter" id="twitter" placeholder="username" value={formData.twitter || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-pink-500 focus:border-pink-500" />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">الموقع الإلكتروني</label>
                            <input type="text" name="website" id="website" placeholder="your-website.com" value={formData.website || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-pink-500 focus:border-pink-500" />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

const MessagesPage: React.FC<{ 
    conversations: Conversation[];
    onConversationClick: (conversation: Conversation) => void;
}> = ({ conversations, onConversationClick }) => (
    <div className="pb-20">
        <div className="p-4 border-b border-gray-200">
             <h1 className="text-xl font-bold text-gray-800">الرسائل</h1>
        </div>
        <div>
            {conversations.map(convo => (
                <div key={convo.id} onClick={() => onConversationClick(convo)} className="flex items-center p-4 space-x-3 space-x-reverse border-b border-gray-200 cursor-pointer hover:bg-gray-100">
                    <img src={convo.user.avatarUrl} alt={convo.user.username} className="h-14 w-14 rounded-full object-cover"/>
                    <div className="flex-1">
                        <p className="font-bold text-gray-800">{convo.user.fullName}</p>
                        <p className="text-sm text-gray-500 truncate">{convo.messages[convo.messages.length - 1]?.text || 'ابدأ المحادثة'}</p>
                    </div>
                    <span className="text-xs text-gray-400">{convo.messages[convo.messages.length - 1]?.timestamp}</span>
                </div>
            ))}
        </div>
    </div>
);

const ChatPage: React.FC<{
    conversation: Conversation | null;
    currentUser: User;
    onBack: () => void;
    onSendMessage: (conversationId: number, text: string) => void;
}> = ({ conversation, currentUser, onBack, onSendMessage }) => {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [conversation?.messages]);


    const handleSend = () => {
        if (newMessage.trim() === '' || !conversation) return;
        onSendMessage(conversation.id, newMessage);
        setNewMessage('');
    }

    if (!conversation) return null;

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center p-3 border-b border-gray-200 bg-white shadow-sm sticky top-0 z-10">
                <button onClick={onBack} className="text-gray-600 p-2">{ICONS.back}</button>
                <img src={conversation.user.avatarUrl} alt="" className="h-10 w-10 rounded-full object-cover mx-3"/>
                <p className="font-bold text-gray-800">{conversation.user.fullName}</p>
            </div>
            <div className="flex-1 p-4 overflow-y-auto pb-24">
                <div className="flex flex-col space-y-2">
                {conversation.messages.map(msg => (
                    <MessageBubble key={msg.id} message={msg} isSender={msg.senderId === currentUser.id} />
                ))}
                <div ref={messagesEndRef} />
                </div>
            </div>
             <div className="p-2 border-t border-gray-200 bg-white sticky bottom-16 w-full">
                <div className="flex items-center bg-gray-100 rounded-full p-1">
                    <input 
                        type="text" 
                        placeholder="اكتب رسالتك..." 
                        className="flex-1 bg-transparent px-4 py-2 text-sm focus:outline-none"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button onClick={handleSend} className="bg-pink-500 text-white p-2 rounded-full hover:bg-pink-600 transition-colors">
                        {React.cloneElement(ICONS.send, {className: "h-5 w-5 transform -rotate-45"})}
                    </button>
                </div>
            </div>
        </div>
    );
};

const CommentsPage: React.FC<{
    post: Post;
    currentUser: User;
    onBack: () => void;
    onAddComment: (postId: number, text: string) => void;
    onProfileClick: (user: User) => void;
}> = ({ post, currentUser, onBack, onAddComment, onProfileClick }) => {
    const [newComment, setNewComment] = useState('');
    const commentsEndRef = useRef<HTMLDivElement>(null);

    const handleAddComment = () => {
        if (newComment.trim()) {
            onAddComment(post.id, newComment.trim());
            setNewComment('');
        }
    };
    
    useEffect(() => {
        commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [post.comments]);

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-3 border-b bg-white shadow-sm sticky top-0 z-10">
                <button onClick={onBack} className="text-gray-600 p-2">{ICONS.back}</button>
                <h1 className="font-bold text-lg">التعليقات</h1>
                <div className="w-10" />
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {post.comments.length === 0 ? (
                    <p className="text-center text-gray-500 pt-8">لا توجد تعليقات بعد. كن أول من يعلق!</p>
                ) : (
                    post.comments.map(comment => (
                        <div key={comment.id} className="flex items-start space-x-3 space-x-reverse">
                            <img 
                                src={comment.user.avatarUrl} 
                                alt={comment.user.username} 
                                className="h-9 w-9 rounded-full object-cover cursor-pointer"
                                onClick={() => onProfileClick(comment.user)}
                            />
                            <div className="flex-1 bg-gray-100 rounded-2xl p-3">
                                <p className="text-sm">
                                    <span 
                                        className="font-bold text-gray-800 cursor-pointer"
                                        onClick={() => onProfileClick(comment.user)}
                                    >
                                        {comment.user.username}
                                    </span>
                                    <span className="mr-2 text-gray-700">{comment.text}</span>
                                </p>
                            </div>
                        </div>
                    ))
                )}
                 <div ref={commentsEndRef} />
            </div>
            <div className="p-2 border-t border-gray-200 bg-white">
                <div className="flex items-center bg-gray-100 rounded-full p-1">
                     <img src={currentUser.avatarUrl} alt="you" className="h-9 w-9 rounded-full object-cover ml-2"/>
                    <input 
                        type="text" 
                        placeholder="أضف تعليقاً..." 
                        className="flex-1 bg-transparent px-3 py-2 text-sm focus:outline-none"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                    />
                    <button onClick={handleAddComment} className="text-pink-500 font-bold p-2 hover:text-pink-700 disabled:text-pink-300" disabled={!newComment.trim()}>
                        نشر
                    </button>
                </div>
            </div>
        </div>
    );
}

const CreatePostPage: React.FC<{
    onPostCreated: (data: { imageUrl: string; description:string; price?: number; brand?: string; category?: string; }) => void;
    onClose: () => void;
}> = ({ onPostCreated, onClose }) => {
    const [image, setImage] = useState<{file: File, url: string} | null>(null);
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const galleryInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);


    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage({
                file: file,
                url: URL.createObjectURL(file)
            });
        }
    };

    const handlePost = () => {
        if (!image || !description) return;
        onPostCreated({
            imageUrl: image.url,
            description,
            price: price ? Number(price) : undefined,
            brand: brand || undefined,
            category: category || undefined,
        });
    };
    
    if (!image) { // Step 1: Dedicated screen for image selection
        return (
            <div className="h-full flex flex-col">
                <div className="flex items-center justify-between p-3 border-b">
                     <button onClick={onClose} className="p-2 text-gray-600">{ICONS.back}</button>
                     <h1 className="font-bold text-lg">منشور جديد</h1>
                     <div className="w-10"></div>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                    {React.cloneElement(ICONS.camera, { className: "h-24 w-24 text-gray-300"})}
                    <p className="mt-4 text-xl text-gray-700">اختر صورة للبدء</p>
                    <div className="mt-6 w-full max-w-xs space-y-3">
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            ref={galleryInputRef}
                            onChange={handleImageSelect}
                        />
                        <button 
                            onClick={() => galleryInputRef.current?.click()}
                            className="w-full bg-pink-500 text-white font-bold py-3 rounded-lg hover:bg-pink-600 transition-colors"
                        >
                            اختيار من المعرض
                        </button>
                        <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            hidden
                            ref={cameraInputRef}
                            onChange={handleImageSelect}
                        />
                        <button 
                            onClick={() => cameraInputRef.current?.click()}
                            className="w-full bg-purple-500 text-white font-bold py-3 rounded-lg hover:bg-purple-600 transition-colors"
                        >
                            التقاط صورة بالكاميرا
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Step 2: Form for adding details
    return (
        <div className="h-full flex flex-col relative">
            <div className="flex items-center justify-between p-3 border-b bg-white shadow-sm sticky top-0 z-10">
                <button onClick={() => setImage(null)} className="text-gray-600 p-2">{ICONS.back}</button>
                <h1 className="font-bold text-lg">تفاصيل المنشور</h1>
                <div className="w-10" />
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4 pb-24">
                <img src={image.url} alt="Preview" className="w-full aspect-square object-cover rounded-lg shadow-md"/>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="اكتب وصفاً..."
                    className="w-full h-24 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-pink-500 focus:border-pink-500"
                    rows={4}
                />
                <div className="space-y-4 border-t border-gray-200 pt-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">السعر (اختياري)</label>
                        <input 
                            type="number" 
                            placeholder="0.00 ر.س"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-pink-500 focus:border-pink-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">الماركة (اختياري)</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Zara"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                            className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-pink-500 focus:border-pink-500"
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">النوع (اختياري)</label>
                        <input 
                            type="text" 
                            placeholder="e.g. فستان, حقيبة, ..."
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-pink-500 focus:border-pink-500"
                        />
                    </div>
                </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg">
                <button 
                    onClick={handlePost} 
                    className="w-full bg-pink-500 text-white font-bold py-3 rounded-lg hover:bg-pink-600 transition-colors text-lg shadow-md disabled:bg-pink-300"
                    disabled={!description}
                >
                    مشاركة
                </button>
            </div>
        </div>
    );
};

const PostDetailPage: React.FC<{
    post: Post;
    onBack: () => void;
    onProfileClick: (user: User) => void;
    onCommentClick: (post: Post) => void;
    currentUser: User;
    onDeletePost: (postId: number) => void;
    onToggleLike: (postId: number) => void;
    isLiked: boolean;
}> = ({ post, onBack, onProfileClick, onCommentClick, currentUser, onDeletePost, onToggleLike, isLiked }) => (
    <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white shadow-sm sticky top-0 z-10">
            <button onClick={onBack} className="text-gray-600 p-2">{ICONS.back}</button>
            <h1 className="font-bold text-lg text-gray-800">المنشور</h1>
            <div className="w-10" />
        </div>
        <div className="flex-1 overflow-y-auto">
            <PostCard
                key={post.id}
                post={post}
                onProfileClick={onProfileClick}
                onCommentClick={onCommentClick}
                currentUser={currentUser}
                onDeletePost={onDeletePost}
                onToggleLike={onToggleLike}
                isLiked={isLiked}
            />
        </div>
    </div>
);


const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeProfile, setActiveProfile] = useState<User | null>(null);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [activePost, setActivePost] = useState<Post | null>(null);
  const [commentingOnPost, setCommentingOnPost] = useState<Post | null>(null);
  const [likedPostIds, setLikedPostIds] = useState(new Set<number>());

  useEffect(() => {
    // Initialize app with some data only once
    const { initialUsers, initialPosts, initialConversations } = createInitialData();
    setAllUsers(initialUsers);
    setPosts(initialPosts);
    setConversations(initialConversations);
  }, []);

  const handleLogin = (username: string, pass: string): boolean => {
      const user = allUsers.find(u => u.username.toLowerCase() === username.toLowerCase());
      if (user && user.password === pass) {
          setCurrentUser(user);
          setIsAuthenticated(true);
          setCurrentPage('home');
          return true;
      }
      return false;
  };
  
  const handleSignUp = (newUser: {fullName: string, username: string, password: string}): boolean => {
    if (allUsers.some(u => u.username.toLowerCase() === newUser.username.toLowerCase())) {
        return false;
    }

    const createdUser: User = {
        id: allUsers.length + 1,
        username: newUser.username,
        fullName: newUser.fullName,
        password: newUser.password,
        avatarUrl: `https://picsum.photos/seed/${allUsers.length + 1}/200/200`,
        followers: 0,
        following: 0,
        postsCount: 0,
        bio: `مرحباً! أنا عضو جديد في ستايلاتي.`,
    };

    setAllUsers([...allUsers, createdUser]);
    setCurrentUser(createdUser);
    setIsAuthenticated(true);
    setCurrentPage('home');
    return true;
  };

  const handleLogout = () => {
      setIsAuthenticated(false);
      setCurrentUser(null);
  };

  const navigateToProfile = useCallback((user: User) => {
      setActiveProfile(user);
      setCurrentPage('profile');
  }, []);
  
  const navigateToPostDetail = useCallback((post: Post) => {
      setActivePost(post);
      setActiveProfile(post.user);
      setCurrentPage('postDetail');
  }, []);

  const navigateToConversation = useCallback((conversation: Conversation) => {
      setActiveConversation(conversation);
      setCurrentPage('chat');
  }, []);
  
  const navigateToComments = useCallback((post: Post) => {
    setCommentingOnPost(post);
    setCurrentPage('comments');
  }, []);

  const handleStartConversation = (targetUser: User) => {
    if (!currentUser || currentUser.id === targetUser.id) return;

    const existingConvo = conversations.find(c => c.user.id === targetUser.id);
    if (existingConvo) {
        navigateToConversation(existingConvo);
    } else {
        const newConvo: Conversation = {
            id: conversations.length > 0 ? Math.max(...conversations.map(c => c.id)) + 1 : 1,
            user: targetUser,
            messages: [],
        };
        const updatedConversations = [newConvo, ...conversations];
        setConversations(updatedConversations);
        navigateToConversation(newConvo);
    }
  };

  const handleSendMessage = (conversationId: number, text: string) => {
    if (!currentUser) return;

    const newMessage: Message = {
        id: Date.now(),
        senderId: currentUser.id,
        text,
        timestamp: "الآن"
    };
    
    let targetConvo: Conversation | undefined;

    const remainingConvos = conversations.filter(convo => {
      if (convo.id === conversationId) {
        targetConvo = { ...convo, messages: [...convo.messages, newMessage] };
        return false;
      }
      return true;
    });

    const updatedConversations = targetConvo ? [targetConvo, ...remainingConvos] : [...conversations];

    setConversations(updatedConversations);

    if (activeConversation && activeConversation.id === conversationId) {
        setActiveConversation(targetConvo);
    }
  };

  const handleProfileUpdate = useCallback((updatedUser: User) => {
    if (!currentUser) return;
    
    const updatedUsers = allUsers.map(u => u.id === updatedUser.id ? updatedUser : u);
    setAllUsers(updatedUsers);
    
    setCurrentUser(updatedUser);
    
    setPosts(prevPosts => prevPosts.map(post => {
        if (post.user.id === updatedUser.id) {
            return { ...post, user: updatedUser };
        }
        return post;
    }));

    setActiveProfile(updatedUser);
    setCurrentPage('profile');
  }, [currentUser, allUsers]);

  const handleCreatePost = (newPostData: { imageUrl: string; description: string; price?: number; brand?: string; category?: string; }) => {
    if (!currentUser) return;

    const newPost: Post = {
        id: posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1,
        user: currentUser,
        imageUrl: newPostData.imageUrl,
        description: newPostData.description,
        price: newPostData.price,
        brand: newPostData.brand,
        category: newPostData.category,
        likes: 0,
        comments: [],
        timestamp: "الآن",
    };
    
    setPosts([newPost, ...posts]);

    const updatedUser = { ...currentUser, postsCount: currentUser.postsCount + 1 };
    setCurrentUser(updatedUser);
    setAllUsers(allUsers.map(u => u.id === currentUser.id ? updatedUser : u));

    setCurrentPage('home');
  };

  const handleDeletePost = (postId: number): boolean => {
    if (!currentUser) return false;

    if (window.confirm("هل أنت متأكد أنك تريد حذف هذا المنشور؟")) {
        setPosts(posts.filter(p => p.id !== postId));

        const updatedUser = { ...currentUser, postsCount: currentUser.postsCount - 1 };
        setCurrentUser(updatedUser);
        setAllUsers(allUsers.map(u => u.id === currentUser.id ? updatedUser : u));

        if (activeProfile && activeProfile.id === currentUser.id) {
            setActiveProfile(updatedUser);
        }
        return true;
    }
    return false;
  };

  const handleToggleLike = (postId: number) => {
    const newLikedPostIds = new Set(likedPostIds);
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex === -1) return;

    const post = posts[postIndex];
    let newLikeCount = post.likes;

    if (newLikedPostIds.has(postId)) {
      newLikedPostIds.delete(postId);
      newLikeCount--;
    } else {
      newLikedPostIds.add(postId);
      newLikeCount++;
    }

    const updatedPosts = [...posts];
    updatedPosts[postIndex] = { ...post, likes: newLikeCount };
    
    setPosts(updatedPosts);
    setLikedPostIds(newLikedPostIds);
  };

  const handleAddComment = (postId: number, text: string) => {
    if (!currentUser) return;
    const newComment: Comment = {
      id: Date.now(),
      user: currentUser,
      text,
      timestamp: "الآن",
    };
    
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return { ...post, comments: [...post.comments, newComment] };
      }
      return post;
    });

    setPosts(updatedPosts);
    // Also update the post in the comments page view
    if (commentingOnPost && commentingOnPost.id === postId) {
        setCommentingOnPost(prev => prev ? {...prev, comments: [...prev.comments, newComment]} : null);
    }
  };


  if (!isAuthenticated || !currentUser) {
    return <AuthPage onLogin={handleLogin} onSignUp={handleSignUp} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage posts={posts} onProfileClick={navigateToProfile} onCommentClick={navigateToComments} currentUser={currentUser} onDeletePost={handleDeletePost} onToggleLike={handleToggleLike} likedPostIds={likedPostIds} />;
      case 'profile':
        return <ProfilePage user={activeProfile} posts={posts} currentUser={currentUser} onEditProfile={() => setCurrentPage('editProfile')} onLogout={handleLogout} onStartConversation={handleStartConversation} onPostClick={navigateToPostDetail} />;
      case 'postDetail':
        if (!activePost) return null;
        return <PostDetailPage
            post={activePost}
            onBack={() => setCurrentPage('profile')}
            onProfileClick={navigateToProfile}
            onCommentClick={navigateToComments}
            currentUser={currentUser}
            onDeletePost={(postId) => {
                if (handleDeletePost(postId)) {
                    setCurrentPage('profile');
                }
            }}
            onToggleLike={handleToggleLike}
            isLiked={likedPostIds.has(activePost.id)}
        />;
      case 'editProfile':
        return <EditProfilePage user={currentUser} onSave={handleProfileUpdate} onBack={() => {
            setActiveProfile(currentUser);
            setCurrentPage('profile');
        }} />;
      case 'messages':
        return <MessagesPage conversations={conversations} onConversationClick={navigateToConversation} />;
      case 'chat':
        return <ChatPage conversation={activeConversation} currentUser={currentUser} onBack={() => setCurrentPage('messages')} onSendMessage={handleSendMessage} />;
      case 'explore':
          return <ExplorePage posts={posts} onPostClick={navigateToPostDetail} />;
      case 'upload':
          return <CreatePostPage onPostCreated={handleCreatePost} onClose={() => setCurrentPage('home')} />;
      case 'comments':
          if (!commentingOnPost) return null;
          return <CommentsPage post={commentingOnPost} currentUser={currentUser} onBack={() => setCurrentPage('home')} onAddComment={handleAddComment} onProfileClick={navigateToProfile} />;
      default:
        return <HomePage posts={posts} onProfileClick={navigateToProfile} onCommentClick={navigateToComments} currentUser={currentUser} onDeletePost={handleDeletePost} onToggleLike={handleToggleLike} likedPostIds={likedPostIds} />;
    }
  };

  const NavItem: React.FC<{ page: Page; icon: React.ReactNode }> = ({ page, icon }) => (
    <button
      onClick={() => {
        if (page === 'profile') {
            setActiveProfile(currentUser);
        }
        setCurrentPage(page);
      }}
      className={`flex-1 flex justify-center p-3 transition-colors duration-200 ${currentPage === page ? 'text-pink-500' : 'text-gray-500 hover:text-pink-500'}`}
    >
      {icon}
    </button>
  );

  const showHeader = !['chat', 'editProfile', 'upload', 'postDetail', 'comments'].includes(currentPage);
  const showNavBar = !['chat', 'editProfile', 'upload', 'postDetail', 'comments'].includes(currentPage);

  return (
    <div className="max-w-md mx-auto h-screen bg-white shadow-2xl flex flex-col relative">
       {showHeader && <div className="p-4 border-b border-gray-200 text-center flex items-center justify-between">
            {currentPage === 'profile' && activeProfile?.id === currentUser.id ? (
                <button onClick={() => setCurrentPage('editProfile')} className="text-gray-600">{ICONS.settings}</button>
            ) : <div className="w-6"></div> }
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                ستايلاتي
            </h1>
            <div className="w-6"></div>
        </div>}
       <main className="flex-1 overflow-y-auto bg-gray-50">
        {renderPage()}
       </main>
       {showNavBar && (
         <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 shadow-[0_-1px_3px_rgba(0,0,0,0.05)]">
            <div className="flex justify-around items-center">
                <NavItem page="home" icon={ICONS.home} />
                <NavItem page="explore" icon={ICONS.explore} />
                <button onClick={() => setCurrentPage('upload')} className="text-pink-500 p-2 -mt-4 bg-white rounded-full border-4 border-white shadow-lg">
                    <div className="bg-pink-500 text-white rounded-full p-2">
                        {React.cloneElement(ICONS.add, { className: "h-7 w-7" })}
                    </div>
                </button>
                <NavItem page="messages" icon={ICONS.messages} />
                <NavItem page="profile" icon={ICONS.profile} />
            </div>
         </div>
       )}
    </div>
  );
};

export default App;