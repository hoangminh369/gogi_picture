# Frontend - Smart Photo Manager

## Mô tả chức năng

Frontend được xây dựng bằng Vue.js để cung cấp giao diện người dùng cho hệ thống quản lý ảnh thông minh. Ứng dụng có 2 interface riêng biệt cho Admin và User với các chức năng khác nhau.

## Các chức năng chính

### 🔐 Authentication & Authorization
- **Login/Register forms** với validation
- **JWT token management** tự động
- **Route guards** phân quyền admin/user
- **Auto-redirect** dựa trên role sau khi login

### 👨‍💼 Admin Interface
- **User Management**: CRUD operations cho tất cả users
- **System Configuration**: 
  - Cấu hình Google Drive (Client ID, Client Secret, Folder ID)
  - Cấu hình Chatbot (Zalo, Facebook tokens và webhooks)
  - Cài đặt AI parameters (DeepFace models, thresholds)
- **Drive Explorer**: Browse và quản lý files/folders trên Google Drive
- **Workflow Management**: Monitor và quản lý N8N workflows
- **Dashboard**: Thống kê hệ thống và monitoring

### 👤 User Interface  
- **Image Gallery**: Upload và xem ảnh cá nhân
- **Dashboard**: Overview thống kê ảnh đã upload
- **Chatbot Interface**: 
  - Chat với AI assistant
  - Upload ảnh để so sánh và tìm ảnh đẹp
  - Xem kết quả processing real-time

### 🎨 UI/UX Features
- **Responsive design** với Element Plus components
- **Dark/Light theme** support
- **Loading states** và progress indicators
- **Error handling** với user-friendly messages  
- **Animation effects** cho better user experience
- **File upload** với drag-drop support
- **Image preview** và thumbnail generation

## Công nghệ sử dụng

- **Vue 3** với Composition API
- **TypeScript** cho type safety
- **Element Plus** UI component library
- **Pinia** cho state management
- **Vue Router** cho routing và navigation
- **Axios** cho API calls với interceptors
- **Vite** build tool và dev server
- **CSS3** với custom animations

## Cấu trúc thư mục

```
src/
├── assets/         # Static assets (CSS, images, icons)
├── components/     # Reusable Vue components
├── layouts/        # Layout components (AdminLayout, UserLayout)
├── pages/          # Page components
│   ├── admin/      # Admin-only pages
│   └── user/       # User pages và shared pages
├── router/         # Vue Router configuration
├── services/       # API service layer
├── stores/         # Pinia stores cho state management
└── types/          # TypeScript type definitions
```

## Key Components

### Layouts
- **AdminLayout**: Sidebar navigation cho admin features
- **UserLayout**: Simplified layout cho user interface

### Admin Pages
- **AdminDashboard**: System overview và quick actions
- **UserManagement**: Table-based user management với search/filter
- **SystemConfig**: Form-based configuration với validation
- **DriveExplorer**: File browser interface cho Google Drive
- **WorkflowManagement**: N8N workflow monitoring

### User Pages  
- **UserDashboard**: Personal stats và recent photos
- **ImageGallery**: Grid/list view cho ảnh với upload functionality
- **ChatbotInterface**: Chat UI với image upload cho photo comparison

## State Management

### Auth Store (Pinia)
- **User authentication** state
- **JWT token** management
- **Role-based** permissions
- **Auto-logout** on token expiry

### API Service Layer
- **Centralized HTTP client** với Axios
- **Request/Response interceptors** cho auth và error handling
- **Modular API endpoints** (authApi, imageApi, driveApi, chatbotApi)
- **Mock API support** cho development

## Workflow tương tác

### Admin Flow
1. **Login** → Admin Dashboard
2. **Cấu hình Google Drive** trong System Config
3. **Authorize OAuth** để connect Drive account  
4. **Browse files** trong Drive Explorer
5. **Monitor workflows** và system stats

### User Flow
1. **Login** → User Dashboard
2. **Upload ảnh** trong Image Gallery
3. **Chat với AI** trong Chatbot Interface
4. **Upload ảnh khách** để tìm ảnh matching
5. **Nhận kết quả** với link Drive folder chứa ảnh đẹp nhất

## Responsive Design

- **Mobile-first** approach
- **Breakpoint-based** layout adjustments
- **Touch-friendly** interface elements
- **Optimized performance** cho mobile devices
   - Use the Drive Explorer to browse your files

## Default Accounts

- Admin: `admin@example.com` / `admin123`
- User: `user@example.com` / `user123`

## Features

- User authentication and management
- Google Drive integration
- Image gallery and management
- Chatbot integration (Zalo and Facebook)
- AI-powered photo analysis
