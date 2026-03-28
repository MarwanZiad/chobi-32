# 🧱 البنية الخلفية المتكاملة لتطبيق Chobi Live

## 📋 نظرة عامة

هذه هي البنية الخلفية المتكاملة لتطبيق Chobi Live، والتي تدعم:

- 📡 البث المباشر (فيديو/صوت)
- 💬 الدردشة الفورية
- 🎁 نظام الهدايا والعملات
- 👥 إدارة المستخدمين
- 🎥 الفيديوهات المسجلة
- 🔔 الإشعارات
- 📊 التحليلات والإحصائيات

## 🏗️ البنية المعمارية

```
backend/
├── trpc/                    # tRPC API Routes
│   ├── routes/
│   │   ├── streaming/       # البث المباشر
│   │   ├── chat/           # الدردشة
│   │   ├── gifts/          # الهدايا
│   │   ├── users/          # المستخدمين
│   │   ├── videos/         # الفيديوهات
│   │   ├── notifications/  # الإشعارات
│   │   └── analytics/      # التحليلات
│   ├── app-router.ts       # Router الرئيسي
│   └── create-context.ts   # Context
├── services/               # خدمات الأعمال
│   ├── streaming-service.ts
│   ├── chat-service.ts
│   ├── gift-service.ts
│   └── notification-service.ts
├── database/               # نماذج قاعدة البيانات
│   └── models.ts
├── config/                 # إعدادات التكوين
│   └── database.ts
├── utils/                  # أدوات مساعدة
│   └── websocket-manager.ts
├── types/                  # أنواع البيانات
│   └── api-types.ts
└── hono.ts                # خادم Hono الرئيسي
```

## 🚀 الميزات المتاحة

### 1. 📡 البث المباشر (Streaming API)

#### إنشاء جلسة بث
```typescript
const session = await trpc.streaming.createSession.mutate({
  title: "بث مباشر - أغاني عربية",
  description: "أجمل الأغاني العربية الكلاسيكية",
  type: "audio", // أو "video"
  category: "music",
  isPrivate: false
});
```

#### الانضمام لجلسة بث
```typescript
const viewerSession = await trpc.streaming.joinSession.mutate({
  sessionId: "session_123",
  role: "viewer" // أو "co-host"
});
```

#### الحصول على الجلسات النشطة
```typescript
const activeSessions = await trpc.streaming.getActiveSessions.query({
  type: "all", // "video", "audio", "all"
  category: "music",
  limit: 20
});
```

#### إنهاء جلسة البث
```typescript
const stats = await trpc.streaming.endSession.mutate({
  sessionId: "session_123"
});
```

### 2. 💬 الدردشة (Chat API)

#### إرسال رسالة
```typescript
const message = await trpc.chat.sendMessage.mutate({
  sessionId: "session_123",
  message: "أهلاً وسهلاً بالجميع! 👋",
  type: "text"
});
```

#### الحصول على الرسائل
```typescript
const messages = await trpc.chat.getMessages.query({
  sessionId: "session_123",
  limit: 50
});
```

### 3. 🎁 الهدايا (Gifts API)

#### الحصول على الهدايا المتاحة
```typescript
const gifts = await trpc.gifts.getAvailableGifts.query();
```

#### إرسال هدية
```typescript
const transaction = await trpc.gifts.sendGift.mutate({
  sessionId: "session_123",
  giftId: "gift_rose",
  recipientId: "user_456",
  quantity: 1,
  message: "هدية جميلة! 🌹"
});
```

### 4. 👥 المستخدمين (Users API)

#### الحصول على الملف الشخصي
```typescript
const profile = await trpc.users.getProfile.query({
  userId: "user_123" // اختياري - إذا لم يُحدد، يُرجع الملف الحالي
});
```

#### تحديث الملف الشخصي
```typescript
const updatedProfile = await trpc.users.updateProfile.mutate({
  displayName: "أحمد محمد",
  bio: "مبدع محتوى ومحب للموسيقى العربية 🎵",
  preferences: {
    language: "ar",
    theme: "dark"
  }
});
```

### 5. 🎥 الفيديوهات (Videos API)

#### رفع فيديو
```typescript
const video = await trpc.videos.uploadVideo.mutate({
  title: "أجمل الأغاني العربية الكلاسيكية",
  description: "مجموعة من أروع الأغاني العربية التراثية",
  category: "music",
  tags: ["موسيقى", "عربي", "تراث"],
  videoUrl: "https://example.com/video.mp4",
  duration: 180
});
```

#### الحصول على الفيديوهات
```typescript
const videos = await trpc.videos.getVideos.query({
  category: "music",
  sortBy: "popular", // "recent", "popular", "trending"
  limit: 20
});
```

### 6. 🔔 الإشعارات (Notifications API)

#### الحصول على الإشعارات
```typescript
const notifications = await trpc.notifications.getNotifications.query({
  type: "all", // "follow", "gift", "comment", "stream", "system"
  unreadOnly: false,
  limit: 20
});
```

#### تحديد الإشعارات كمقروءة
```typescript
const result = await trpc.notifications.markAsRead.mutate({
  notificationIds: ["notif_1", "notif_2"],
  markAll: false
});
```

### 7. 📊 التحليلات (Analytics API)

#### الحصول على إحصائيات البث
```typescript
const stats = await trpc.analytics.getStreamStats.query({
  userId: "user_123",
  period: "week" // "day", "week", "month", "year"
});
```

## 🔧 التكوين والإعداد

### متطلبات النظام

- Node.js 18+
- TypeScript 5+
- قاعدة بيانات PostgreSQL (للإنتاج)
- Redis (للتخزين المؤقت)
- MongoDB (للتحليلات)
- AWS S3 (لتخزين الملفات)

### متغيرات البيئة

```env
# Database
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=chobi_live
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# MongoDB
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=chobi_analytics

# AWS S3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
S3_BUCKET=chobi-live

# Streaming
RTMP_SERVER_URL=rtmp://live.chobi.app/live
HLS_SERVER_URL=https://live.chobi.app/hls

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Environment
NODE_ENV=development
```

## 🛠️ الخدمات المتاحة

### StreamingService
- إدارة جلسات البث المباشر
- تتبع المشاهدين
- إحصائيات البث

### ChatService
- الدردشة الفورية
- البث عبر WebSocket
- إدارة الرسائل

### GiftService
- إدارة الهدايا الافتراضية
- معاملات العملات
- إحصائيات الهدايا

### NotificationService
- الإشعارات الفورية
- إشعارات الدفع
- إعدادات الإشعارات

## 🔌 WebSocket API

### الاتصال
```javascript
const ws = new WebSocket('wss://api.chobi.app/ws');
```

### الرسائل المدعومة
```javascript
// الانضمام لجلسة
ws.send(JSON.stringify({
  type: 'join_session',
  sessionId: 'session_123'
}));

// مغادرة جلسة
ws.send(JSON.stringify({
  type: 'leave_session',
  sessionId: 'session_123'
}));

// ping/pong للحفاظ على الاتصال
ws.send(JSON.stringify({
  type: 'ping'
}));
```

### الأحداث الواردة
```javascript
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  
  switch (message.type) {
    case 'new_message':
      // رسالة دردشة جديدة
      break;
    case 'gift_animation':
      // تأثير هدية
      break;
    case 'viewer_joined':
      // مشاهد جديد انضم
      break;
    case 'viewer_left':
      // مشاهد غادر
      break;
    case 'session_ended':
      // انتهت الجلسة
      break;
    case 'notification':
      // إشعار جديد
      break;
  }
};
```

## 📈 الأداء والتحسين

### التخزين المؤقت
- Redis للبيانات الفورية
- تخزين مؤقت للجلسات النشطة
- تخزين مؤقت لملفات المستخدمين

### قاعدة البيانات
- فهرسة محسنة للاستعلامات
- تقسيم البيانات حسب التاريخ
- تنظيف البيانات القديمة تلقائياً

### الشبكة
- ضغط البيانات
- CDN للملفات الثابتة
- Load balancing للخوادم

## 🔒 الأمان

### المصادقة
- JWT tokens
- تشفير كلمات المرور
- معدل محدود للطلبات

### الحماية
- CORS محكوم
- تنظيف البيانات المدخلة
- حماية من SQL injection

### الخصوصية
- تشفير البيانات الحساسة
- إعدادات الخصوصية للمستخدمين
- حذف البيانات عند الطلب

## 🚀 النشر

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm run start
```

### Docker
```bash
docker build -t chobi-live-backend .
docker run -p 3000:3000 chobi-live-backend
```

## 📝 المساهمة

1. Fork المشروع
2. إنشاء branch جديد (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push للـ branch (`git push origin feature/amazing-feature`)
5. فتح Pull Request

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

## 🤝 الدعم

للحصول على الدعم، يرجى فتح issue في GitHub أو التواصل معنا على:
- البريد الإلكتروني: support@chobi.app
- Discord: [Chobi Live Community](https://discord.gg/chobi-live)

---

تم تطوير هذه البنية الخلفية بـ ❤️ لتطبيق Chobi Live