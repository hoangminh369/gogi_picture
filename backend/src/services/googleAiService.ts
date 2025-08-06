import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Simple wrapper around Google Generative AI SDK.
 * Requires env var GOOGLE_GENAI_API_KEY.
 */
class GoogleAiService {
  private client: GoogleGenerativeAI | null = null;

  private getClient() {
    if (!this.client) {
      const apiKey = process.env.GOOGLE_GENAI_API_KEY;
      if (!apiKey) {
        throw new Error("Missing GOOGLE_GENAI_API_KEY env variable");
      }
      this.client = new GoogleGenerativeAI(apiKey);
    }
    return this.client;
  }

  async generateChatResponse(
    prompt: string,
    history: { role: "user" | "model"; parts: string }[] = [],
    images?: Array<{ data: string; mimeType: string }>
  ) {
    try {
      const modelId = process.env.GEMINI_MODEL_ID || 'gemini-1.5-pro';
      const model = this.getClient().getGenerativeModel({ model: modelId });
      // Optional: log once for debugging
      if (process.env.NODE_ENV !== 'production') {
        console.debug(`[GoogleAiService] Using Gemini model: ${modelId}`);
      }

      // Add system instruction for better formatting
      const systemInstruction = `Bạn là một trợ lý AI chuyên nghiệp về nhiếp ảnh và phân tích hình ảnh. Khi trả lời:

1. **Định dạng chuyên nghiệp**: Sử dụng markdown để định dạng câu trả lời rõ ràng, bao gồm:
   - **Bold** cho tiêu đề và điểm quan trọng
   - *Italic* cho nhấn mạnh nhẹ
   - \`code\` cho thuật ngữ kỹ thuật
   - > Blockquote cho lời khuyên quan trọng
   - Danh sách có thứ tự (1. 2. 3.) và không thứ tự (- ) cho liệt kê

2. **Bảng phân tích**: Khi đánh giá ảnh, hãy tạo bảng so sánh với định dạng:
   | Tiêu chí | Đánh giá | Điểm số | Ghi chú |
   |----------|----------|---------|---------|
   | Chất lượng | Tốt | 8/10 | Ảnh sắc nét |

3. **Cấu trúc rõ ràng**: Chia thành các phần: Tổng quan → Phân tích chi tiết → Đánh giá → Khuyến nghị

4. **Emoji phù hợp**: Sử dụng emoji một cách tinh tế để tăng tính thân thiện (📸 🎯 ✨ 💡)

Luôn trả lời bằng tiếng Việt với văn phong chuyên nghiệp nhưng thân thiện.`

      // Build user parts with optional inline images
      const userParts: any[] = [{ text: prompt }];
      if (images && images.length) {
        for (const img of images) {
          if (img?.data && img?.mimeType) {
            userParts.push({ inlineData: { data: img.data, mimeType: img.mimeType } });
          }
        }
      }

      const contents = [
        { role: 'user', parts: [{ text: systemInstruction }] },
        { role: 'model', parts: [{ text: 'Tôi hiểu. Tôi sẽ trả lời một cách chuyên nghiệp với định dạng markdown rõ ràng, bao gồm bảng phân tích khi cần thiết. Hãy gửi câu hỏi hoặc hình ảnh để tôi phân tích.' }] },
        ...history.map(h => ({ role: h.role, parts: [{ text: h.parts }] })),
        { role: 'user', parts: userParts }
      ];

      const result = await model.generateContent({ contents });
      return result.response.text();
    } catch (err: any) {
      // Log full error details for server-side debugging
      console.error('[GoogleAiService] generateChatResponse error:', err);

      // Provide more user-friendly error messages to upstream callers
      const rawMsg = typeof err?.message === 'string' ? err.message : '';
      const msg = rawMsg.toLowerCase();

      if (msg.includes('missing google_genai_api_key')) {
        throw new Error('AI service not configured. Please set GOOGLE_GENAI_API_KEY on the server.');
      }

      if (msg.includes('permission') || msg.includes('401') || msg.includes('unauthorized')) {
        throw new Error('Invalid or unauthorized Google GenAI API key.');
      }

      if (msg.includes('quota') || msg.includes('rate') || msg.includes('exceed')) {
        throw new Error('Google AI quota exceeded. Please try again later.');
      }

      // Generic fallback
      throw new Error('Google AI service is currently unavailable.');
    }
  }
}

export default new GoogleAiService(); 