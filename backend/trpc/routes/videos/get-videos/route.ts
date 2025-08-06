import { z } from 'zod';
import { publicProcedure } from '../../../create-context';

const getVideosSchema = z.object({
  category: z.string().optional(),
  userId: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['recent', 'popular', 'trending']).default('recent'),
  limit: z.number().min(1).max(50).default(20),
  offset: z.number().min(0).default(0),
});

export const getVideosProcedure = publicProcedure
  .input(getVideosSchema)
  .query(async ({ input }) => {
    const { category, userId, search, sortBy, limit, offset } = input;
    
    // Mock videos data
    const mockVideos = [
      {
        id: 'video_1',
        userId: 'user_1',
        userName: 'أحمد محمد',
        userAvatar: 'https://picsum.photos/100/100?random=1',
        title: 'أجمل الأغاني العربية الكلاسيكية',
        description: 'مجموعة من أروع الأغاني العربية التراثية',
        category: 'music',
        tags: ['موسيقى', 'عربي', 'تراث'],
        thumbnail: 'https://picsum.photos/400/300?random=1',
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        duration: 180, // 3 minutes
        views: 1234,
        likes: 89,
        dislikes: 5,
        comments: 23,
        shares: 12,
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
        isPrivate: false,
        allowComments: true,
        status: 'ready' as const,
      },
      {
        id: 'video_2',
        userId: 'user_2',
        userName: 'فاطمة علي',
        userAvatar: 'https://picsum.photos/100/100?random=2',
        title: 'وصفة الكنافة الشامية الأصلية',
        description: 'تعلمي طريقة عمل الكنافة الشامية بالطريقة التقليدية',
        category: 'cooking',
        tags: ['طبخ', 'حلويات', 'شامي'],
        thumbnail: 'https://picsum.photos/400/300?random=2',
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
        duration: 420, // 7 minutes
        views: 2567,
        likes: 156,
        dislikes: 8,
        comments: 45,
        shares: 28,
        createdAt: new Date(Date.now() - 172800000), // 2 days ago
        isPrivate: false,
        allowComments: true,
        status: 'ready' as const,
      },
      {
        id: 'video_3',
        userId: 'user_3',
        userName: 'محمد حسن',
        userAvatar: 'https://picsum.photos/100/100?random=3',
        title: 'تعلم البرمجة من الصفر - الدرس الأول',
        description: 'سلسلة تعليمية لتعلم البرمجة للمبتدئين',
        category: 'education',
        tags: ['برمجة', 'تعليم', 'تقنية'],
        thumbnail: 'https://picsum.photos/400/300?random=3',
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4',
        duration: 900, // 15 minutes
        views: 3456,
        likes: 234,
        dislikes: 12,
        comments: 67,
        shares: 45,
        createdAt: new Date(Date.now() - 259200000), // 3 days ago
        isPrivate: false,
        allowComments: true,
        status: 'ready' as const,
      },
      {
        id: 'video_4',
        userId: 'user_4',
        userName: 'سارة أحمد',
        userAvatar: 'https://picsum.photos/100/100?random=4',
        title: 'رحلة إلى الأردن - وادي رم',
        description: 'استكشاف جمال الطبيعة في وادي رم الأردني',
        category: 'travel',
        tags: ['سفر', 'أردن', 'طبيعة'],
        thumbnail: 'https://picsum.photos/400/300?random=4',
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        duration: 600, // 10 minutes
        views: 1890,
        likes: 145,
        dislikes: 3,
        comments: 34,
        shares: 22,
        createdAt: new Date(Date.now() - 345600000), // 4 days ago
        isPrivate: false,
        allowComments: true,
        status: 'ready' as const,
      },
    ];
    
    // Filter videos
    let filteredVideos = mockVideos;
    
    if (category) {
      filteredVideos = filteredVideos.filter(video => video.category === category);
    }
    
    if (userId) {
      filteredVideos = filteredVideos.filter(video => video.userId === userId);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredVideos = filteredVideos.filter(video => 
        video.title.toLowerCase().includes(searchLower) ||
        video.description?.toLowerCase().includes(searchLower) ||
        video.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    // Sort videos
    switch (sortBy) {
      case 'popular':
        filteredVideos.sort((a, b) => b.views - a.views);
        break;
      case 'trending':
        filteredVideos.sort((a, b) => (b.likes + b.shares) - (a.likes + a.shares));
        break;
      case 'recent':
      default:
        filteredVideos.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
    }
    
    // Apply pagination
    const paginatedVideos = filteredVideos.slice(offset, offset + limit);
    
    return {
      videos: paginatedVideos,
      total: filteredVideos.length,
      hasMore: offset + limit < filteredVideos.length,
    };
  });