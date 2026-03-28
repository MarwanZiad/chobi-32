export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    isVerified: boolean;
  };
  createdAt: Date;
  tags: string[];
}

export const mockVideos: Video[] = [
  {
    id: '1',
    title: 'رحلة إلى الطبيعة الخلابة',
    description: 'استكشاف أجمل المناظر الطبيعية في المنطقة',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
    duration: '2:45',
    views: 12500,
    likes: 1250,
    comments: 89,
    shares: 45,
    author: {
      id: 'user1',
      name: 'أحمد محمد',
      username: '@ahmed_m',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      isVerified: true
    },
    createdAt: new Date('2024-01-15'),
    tags: ['طبيعة', 'سفر', 'مغامرة']
  },
  {
    id: '2',
    title: 'وصفة الكنافة الشهية',
    description: 'طريقة تحضير الكنافة بالطريقة التقليدية',
    thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=600&fit=crop',
    duration: '5:20',
    views: 8900,
    likes: 890,
    comments: 156,
    shares: 78,
    author: {
      id: 'user2',
      name: 'فاطمة الزهراء',
      username: '@fatima_chef',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      isVerified: false
    },
    createdAt: new Date('2024-01-14'),
    tags: ['طبخ', 'حلويات', 'تقليدي']
  },
  {
    id: '3',
    title: 'تعلم البرمجة من الصفر',
    description: 'دورة مجانية لتعلم أساسيات البرمجة',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=600&fit=crop',
    duration: '15:30',
    views: 25600,
    likes: 2100,
    comments: 340,
    shares: 180,
    author: {
      id: 'user3',
      name: 'محمد علي',
      username: '@coder_ali',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      isVerified: true
    },
    createdAt: new Date('2024-01-13'),
    tags: ['تعليم', 'برمجة', 'تقنية']
  },
  {
    id: '4',
    title: 'تمارين رياضية منزلية',
    description: 'تمارين بسيطة يمكن ممارستها في المنزل',
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop',
    duration: '8:15',
    views: 15400,
    likes: 1340,
    comments: 98,
    shares: 67,
    author: {
      id: 'user4',
      name: 'سارة أحمد',
      username: '@sara_fitness',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      isVerified: false
    },
    createdAt: new Date('2024-01-12'),
    tags: ['رياضة', 'صحة', 'لياقة']
  },
  {
    id: '5',
    title: 'جولة في المدينة القديمة',
    description: 'استكشاف التاريخ والثقافة في المدينة القديمة',
    thumbnail: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=600&fit=crop',
    duration: '12:00',
    views: 9800,
    likes: 780,
    comments: 123,
    shares: 56,
    author: {
      id: 'user5',
      name: 'عبدالله حسن',
      username: '@abdullah_travel',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      isVerified: true
    },
    createdAt: new Date('2024-01-11'),
    tags: ['تاريخ', 'ثقافة', 'سياحة']
  },
  {
    id: '6',
    title: 'فن الرسم بالألوان المائية',
    description: 'تعلم تقنيات الرسم بالألوان المائية',
    thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop',
    duration: '18:45',
    views: 6700,
    likes: 890,
    comments: 145,
    shares: 89,
    author: {
      id: 'user6',
      name: 'نور الدين',
      username: '@noor_artist',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face',
      isVerified: false
    },
    createdAt: new Date('2024-01-10'),
    tags: ['فن', 'رسم', 'إبداع']
  },
  {
    id: '7',
    title: 'موسيقى عربية أصيلة',
    description: 'عزف على العود لأجمل الألحان العربية',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=600&fit=crop',
    duration: '6:30',
    views: 18900,
    likes: 1560,
    comments: 234,
    shares: 123,
    author: {
      id: 'user7',
      name: 'يوسف محمود',
      username: '@youssef_music',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
      isVerified: true
    },
    createdAt: new Date('2024-01-09'),
    tags: ['موسيقى', 'عود', 'تراث']
  },
  {
    id: '8',
    title: 'تصوير المناظر الطبيعية',
    description: 'نصائح لتصوير المناظر الطبيعية الخلابة',
    thumbnail: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=600&fit=crop',
    duration: '9:20',
    views: 11200,
    likes: 945,
    comments: 87,
    shares: 54,
    author: {
      id: 'user8',
      name: 'ليلى سالم',
      username: '@layla_photo',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
      isVerified: false
    },
    createdAt: new Date('2024-01-08'),
    tags: ['تصوير', 'طبيعة', 'فوتوغرافيا']
  },
  {
    id: '9',
    title: 'قصص من التراث العربي',
    description: 'حكايات شعبية من التراث العربي الأصيل',
    thumbnail: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=600&fit=crop',
    duration: '14:15',
    views: 7800,
    likes: 650,
    comments: 156,
    shares: 78,
    author: {
      id: 'user9',
      name: 'مريم أحمد',
      username: '@mariam_stories',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face',
      isVerified: true
    },
    createdAt: new Date('2024-01-07'),
    tags: ['قصص', 'تراث', 'ثقافة']
  },
  {
    id: '10',
    title: 'تعلم اللغة الإنجليزية',
    description: 'دروس مبسطة لتعلم اللغة الإنجليزية',
    thumbnail: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop',
    duration: '11:40',
    views: 22100,
    likes: 1890,
    comments: 267,
    shares: 145,
    author: {
      id: 'user10',
      name: 'خالد عمر',
      username: '@khalid_english',
      avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=100&h=100&fit=crop&crop=face',
      isVerified: false
    },
    createdAt: new Date('2024-01-06'),
    tags: ['تعليم', 'لغة', 'إنجليزية']
  },
  {
    id: '11',
    title: 'صناعة الحرف اليدوية',
    description: 'تعلم صناعة الحرف اليدوية التقليدية',
    thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=600&fit=crop',
    duration: '16:25',
    views: 5600,
    likes: 456,
    comments: 89,
    shares: 34,
    author: {
      id: 'user11',
      name: 'زينب محمد',
      username: '@zeinab_crafts',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      isVerified: false
    },
    createdAt: new Date('2024-01-05'),
    tags: ['حرف', 'يدوية', 'تقليدية']
  },
  {
    id: '12',
    title: 'رياضة كرة القدم',
    description: 'تحليل مباراة كرة القدم الأخيرة',
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=600&fit=crop',
    duration: '7:50',
    views: 31200,
    likes: 2340,
    comments: 456,
    shares: 234,
    author: {
      id: 'user12',
      name: 'عمر حسين',
      username: '@omar_sports',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
      isVerified: true
    },
    createdAt: new Date('2024-01-04'),
    tags: ['رياضة', 'كرة قدم', 'تحليل']
  }
];

// Function to get random videos
export const getRandomVideos = (count: number = 12): Video[] => {
  const shuffled = [...mockVideos].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Function to get videos for specific tab
export const getVideosForTab = (tab: string, count: number = 12): Video[] => {
  let filteredVideos = [...mockVideos];
  
  switch (tab) {
    case 'forYou':
      // Mix of popular and recent videos
      filteredVideos = mockVideos.filter(video => video.views > 10000 || video.likes > 1000);
      break;
    case 'following':
      // Videos from verified users (simulating followed users)
      filteredVideos = mockVideos.filter(video => video.author.isVerified);
      break;
    case 'profile':
      // User's own videos (can be customized)
      filteredVideos = mockVideos.slice(0, 6);
      break;
    default:
      filteredVideos = mockVideos;
  }
  
  return filteredVideos.sort(() => 0.5 - Math.random()).slice(0, count);
};