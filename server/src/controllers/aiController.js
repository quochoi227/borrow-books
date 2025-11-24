import { env } from '../configs/environment.js'
import { GoogleGenAI } from '@google/genai'
import Book from '../models/bookModel.js'

const ai = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY
})

// const SYSTEM_INSTRUCTION = `
//   Bạn là "Thư Viện Trợ Lý" - trợ lý AI chuyên biệt cho hệ thống quản lý mượn sách.
//   Nhiệm vụ của bạn là giao tiếp và trả lời các câu hỏi liên quan đến sách, quy trình mượn, và hệ thống một cách ngắn gọn, chuyên nghiệp và thân thiện.
//   Hãy hướng dẫn người dùng sử dụng chức năng tìm kiếm hoặc đăng nhập khi họ hỏi về dữ liệu cụ thể (như sách còn hay hết).
// `

const SYSTEM_INSTRUCTION = `
  Bạn là một trợ lý AI hữu ích cho trang web quản lý mượn sách.
  Bạn có thể giao tiếp với người dùng và trả lời các câu hỏi liên quan đến sách, quy trình mượn.
  Quy trình mượn sách như sau: người dùng cần đăng nhập, tìm kiếm sách, và gửi yêu cầu mượn sách.
  Quy định về việc mượn sách: Mỗi người dùng chỉ được mượn tối đa 3 cuốn sách cùng một lúc trong vòng 14 ngày.
  Nếu người dùng hỏi về tình trạng sách cụ thể (còn hay hết), hãy hướng dẫn họ sử dụng chức năng tìm kiếm hoặc đăng nhập để xem thông tin chi tiết.
  Lưu ý trả lời chỉ dựa trên thông tin hiện có trong thư viện.
  Hãy trả lời một cách ngắn gọn, chuyên nghiệp và thân thiện.
`

const getStoreInfo = async () => {
  const [books, bookCount] = await Promise.all([
    Book.find().limit(10).exec(),
    Book.countDocuments()
  ])

  const mappedBooks = books.map((book) => `
    Mã sách: ${book.maSach},Tiêu đề: ${book.tenSach}, Tác giả: ${book.tacGia}, Số lượng còn lại: ${book.soQuyenConLai}.
  `)

  return `
    Thư viện hiện có tổng cộng ${bookCount} cuốn sách.
    Dưới đây là danh sách một số sách hiện có trong thư viện:
    ${mappedBooks.join('')}
  `
}

const aiController = {
  generateText: async (req, res) => {
    try {
      const storeInfo = await getStoreInfo()
      const finalInstruction = SYSTEM_INSTRUCTION + '\n' + storeInfo
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: finalInstruction,
        },
        contents: req.body.topic
      })
      res.status(200).json({ answer: response.text })
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }
}

export default aiController
