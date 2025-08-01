# N8N Workflows - Smart Photo Manager

## Mô tả chức năng

N8N workflows cung cấp các quy trình tự động hóa cho hệ thống quản lý ảnh thông minh. Các workflow này xử lý các tác vụ phức tạp như quét Google Drive, phân tích ảnh bằng AI, và tích hợp chatbot.

## Các nhóm workflow chính

### 🔄 Core Workflows
**Xử lý các tác vụ cốt lõi của hệ thống**

- **google-drive-scanner.json**: 
  - Quét Google Drive định kỳ để tìm ảnh mới
  - Lọc file theo định dạng và metadata
  - Lưu thông tin ảnh vào database
  - Trigger workflow processing tiếp theo

- **deepface-processing.json**:
  - Xử lý ảnh bằng DeepFace AI
  - Extract face embeddings và detect faces
  - Tính toán quality scores
  - Cập nhật status processing trong database

- **image-selection.json**:
  - So sánh embeddings để tìm ảnh tương tự
  - Áp dụng thuật toán chọn ảnh đẹp nhất
  - Sao chép ảnh được chọn vào thư mục kết quả
  - Thiết lập permissions và tạo public links

- **chatbot-response.json**:
  - Gửi notifications đến users qua chatbot
  - Format messages cho Zalo/Facebook
  - Xử lý callback và confirmations
  - Log activities và responses

### 🤖 AI Integration Workflows
**Tích hợp các service AI và machine learning**

- **face-detection.json**:
  - Detect faces trong ảnh với DeepFace
  - Extract facial landmarks và attributes
  - Validate quality của face detection
  - Store face metadata và embeddings

- **quality-assessment.json**:
  - Đánh giá chất lượng ảnh multi-criteria
  - Tính toán blur, exposure, composition scores
  - Combine với face quality metrics
  - Generate overall quality rating

- **best-photo-selection.json**:
  - Thuật toán AI để chọn ảnh đẹp nhất
  - Weight similarity vs quality scores
  - Apply business rules và constraints
  - Rank và select top results

### 💬 Chatbot Integration Workflows
**Xử lý tương tác chatbot và messaging**

- **message-processing.json**:
  - Parse và classify user messages
  - Extract intents và commands
  - Route messages đến appropriate handlers
  - Support commands: help, process, status, scan

- **zalo-webhooks.json**:
  - Handle incoming Zalo messages
  - Validate webhook signatures
  - Extract message data và attachments
  - Forward đến message processing workflow

- **facebook-webhooks.json**:
  - Process Facebook Messenger webhooks
  - Handle verification challenges
  - Extract page messaging events
  - Support text, image, attachment messages

### 🔒 Security Workflows
**Bảo mật và monitoring hệ thống**

- **authentication.json**:
  - Validate API tokens và credentials
  - Handle OAuth flows và refreshing
  - Manage user sessions và permissions
  - Log security events

- **rate-limiting.json**:
  - Implement API rate limiting
  - Track usage per user/IP
  - Apply throttling và blocking rules
  - Send alerts when limits exceeded

- **error-handling.json**:
  - Centralized error processing
  - Log errors với detailed context
  - Send notifications for critical issues
  - Retry failed operations với backoff

## Workflow Orchestration

### Trigger Patterns
- **Schedule triggers**: Định kỳ quét Drive, cleanup tasks
- **Webhook triggers**: Chatbot messages, API callbacks
- **Manual triggers**: Admin-initiated workflows
- **Event triggers**: File uploads, user actions

### Data Flow
1. **Input validation** và sanitization
2. **Business logic** processing
3. **External API calls** (Google Drive, DeepFace)
4. **Database operations** (read/write/update)
5. **Output formatting** và response
6. **Error handling** và logging

### Integration Points
- **Backend API endpoints** cho workflow triggering
- **Google Drive API** cho file operations
- **DeepFace Python service** cho AI processing
- **Chatbot platforms** (Zalo, Facebook)
- **MongoDB database** cho data persistence

## Environment Configuration

### Required Variables
```bash
# N8N Configuration
N8N_PORT=5678
N8N_PROTOCOL=http
N8N_HOST=localhost

# Google Drive API
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_DRIVE_FOLDER_ID=your_folder_id

# Chatbot Integration  
ZALO_ACCESS_TOKEN=your_zalo_token
FACEBOOK_PAGE_TOKEN=your_facebook_token
WEBHOOK_SECRET=your_webhook_secret

# Backend Integration
BACKEND_API_URL=http://localhost:5000/api
API_AUTH_TOKEN=your_api_token
```

## Workflow Execution Flow

### Photo Processing Pipeline
1. **User uploads** ảnh qua chatbot → `message-processing.json`
2. **Extract faces** từ uploaded images → `face-detection.json`
3. **Scan Google Drive** cho matching → `google-drive-scanner.json`
4. **Compare embeddings** và find similar → `image-selection.json`
5. **Select best photos** dựa trên AI criteria → `best-photo-selection.json`
6. **Create result folder** và copy files → `image-selection.json`
7. **Send notification** với results → `chatbot-response.json`

### Error Recovery
- **Automatic retries** với exponential backoff
- **Dead letter queues** cho failed messages
- **Manual intervention** triggers cho critical errors
- **Rollback mechanisms** cho data consistency

# Database Configuration
DB_TYPE=sqlite
DB_PATH=./.n8n/database.sqlite

# Google Drive API
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_DRIVE_FOLDER_ID=your_folder_id

# DeepFace Local Configuration (No API key required)
# DeepFace is now integrated locally via Python scripts

# Chatbot Integration
ZALO_ACCESS_TOKEN=your_zalo_token
FACEBOOK_PAGE_TOKEN=your_facebook_token
WEBHOOK_SECRET=your_webhook_secret
```

### Running n8n

Start the n8n server:

```bash
n8n start
```

Access the n8n editor at: http://localhost:5678

### Importing Workflows

1. Open n8n editor
2. Go to Workflows
3. Click "Import from File"
4. Select the workflow JSON file you want to import

## 📋 Workflow Descriptions

### Core Workflows

- **Google Drive Scanner**: Scans specified Google Drive folders for new images
- **DeepFace Processing**: Processes images with DeepFace API for face detection
- **Image Selection**: Selects the best images based on quality scores
- **Chatbot Response**: Sends notifications to users via Zalo/Facebook

### AI Integration

- **Face Detection**: Detects faces in images and stores metadata
- **Quality Assessment**: Assesses image quality based on multiple factors
- **Best Photo Selection**: Algorithm to select the best photos of each person

### Chatbot Integration

- **Zalo Webhooks**: Handles incoming messages from Zalo
- **Facebook Webhooks**: Handles incoming messages from Facebook Messenger
- **Message Processing**: Processes user commands and responds accordingly

### Security

- **Authentication**: Handles user authentication and token management
- **Rate Limiting**: Implements API rate limiting to prevent abuse
- **Error Handling**: Centralized error handling and logging 