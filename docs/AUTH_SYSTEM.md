# نظام المصادقة - Chobi Live

## نظرة عامة

تم تطوير نظام مصادقة شامل لتطبيق Chobi Live يتضمن تسجيل الدخول، إنشاء الحسابات، إعادة تعيين كلمة المرور، وإدارة جلسات المستخدمين.

## المكونات الرئيسية

### 1. نظام إدارة الحالة (`hooks/use-auth-store.ts`)

يستخدم `@nkzw/create-context-hook` لإدارة حالة المصادقة على مستوى التطبيق:

```typescript
interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
}
```

#### الوظائف المتاحة:
- `login(userData, email)` - تسجيل الدخول
- `logout()` - تسجيل الخروج
- `updateUser(updates)` - تحديث بيانات المستخدم
- `validateSession()` - التحقق من صحة الجلسة
- `resetPassword(email)` - إعادة تعيين كلمة المرور
- `completeOnboarding()` - إكمال الإعداد الأولي

### 2. واجهات المستخدم

#### أ. صفحة تسجيل الدخول/التسجيل (`app/auth/login.tsx`)
- نموذج موحد للتسجيل وإنشاء الحسابات
- التحقق من صحة البيانات
- دعم إظهار/إخفاء كلمة المرور
- رابط إعادة تعيين كلمة المرور

#### ب. صفحة إعادة تعيين كلمة المرور (`app/auth/forgot-password.tsx`)
- إرسال رابط إعادة التعيين
- واجهة تأكيد الإرسال
- إمكانية إعادة الإرسال

#### ج. صفحة الترحيب (`app/onboarding.tsx`)
- 4 شاشات تعريفية
- تصميم تفاعلي مع الرسوم المتحركة
- إمكانية التخطي

### 3. التكامل مع التطبيق الرئيسي

#### تحديث `app/_layout.tsx`:
```typescript
function RootLayoutNav() {
  const { isLoggedIn, isLoading, hasCompletedOnboarding } = useAuth();

  if (isLoading) return <LoadingScreen />;

  return (
    <Stack>
      {isLoggedIn ? (
        <Stack.Screen name="(tabs)" />
      ) : !hasCompletedOnboarding ? (
        <Stack.Screen name="onboarding" />
      ) : (
        <Stack.Screen name="auth/login" />
      )}
    </Stack>
  );
}
```

## تخزين البيانات

### AsyncStorage Keys:
- `user_data` - بيانات المستخدم
- `isLoggedIn` - حالة تسجيل الدخول
- `onboarding_completed` - حالة إكمال الإعداد الأولي
- `userEmail` - البريد الإلكتروني
- `userName` - اسم المستخدم

## الأمان

### التحقق من البيانات:
- التحقق من صحة البريد الإلكتروني
- كلمة المرور 6 أحرف على الأقل
- اسم المستخدم 3 أحرف على الأقل
- تطابق كلمات المرور عند التسجيل

### إدارة الجلسات:
- التحقق التلقائي من صحة الجلسة عند بدء التطبيق
- تسجيل خروج آمن مع حذف جميع البيانات المحفوظة
- معالجة الأخطاء والحالات الاستثنائية

## الاستخدام

### تسجيل الدخول:
```typescript
const { login } = useAuth();

const userData = {
  id: 'user_123',
  name: 'اسم المستخدم',
  email: 'user@example.com',
  // ... باقي البيانات
};

const result = await login(userData, email);
if (result.success) {
  // تم تسجيل الدخول بنجاح
}
```

### تسجيل الخروج:
```typescript
const { logout } = useAuth();

const result = await logout();
if (result.success) {
  // تم تسجيل الخروج بنجاح
}
```

### الحصول على بيانات المستخدم:
```typescript
const { user, isLoggedIn } = useAuth();

if (isLoggedIn && user) {
  console.log(user.name, user.email);
}
```

## الخطوات التالية

1. **تكامل مع الخادم**: ربط النظام بـ API حقيقي
2. **المصادقة الثنائية**: إضافة طبقة أمان إضافية
3. **تسجيل الدخول الاجتماعي**: دعم Google, Facebook, Apple
4. **إدارة الأذونات**: نظام صلاحيات متقدم
5. **تشفير البيانات**: تشفير البيانات الحساسة

## الملاحظات

- النظام الحالي يستخدم محاكاة للطلبات (mock requests)
- جميع النصوص باللغة العربية مع دعم RTL
- التصميم متوافق مع iOS و Android
- يدعم React Native Web

## الاختبار

للاختبار، يمكن استخدام أي بريد إلكتروني وكلمة مرور صحيحة التنسيق. النظام سيقوم بإنشاء بيانات مستخدم تلقائياً للاختبار.