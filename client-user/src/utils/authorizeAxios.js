import axios from 'axios'
import { toast } from 'vue3-toastify'
import { interceptorLoadingElements } from './formatters'

/**
 * Không thể import { store } from '~/redux/store' theo cách thông thường ở đây
 * Giải pháp: Inject store: là kỹ thuật khi cần sử dụng biến redux store ở các file ngoài phạm vi component như file authorizeAxios hiện tại
 * Hiểu đơn giản: khi ứng dụng bắt đầu chạy lên, code sẽ chạy vào main.jsx đầu tiên, từ bên đó chúng ta gọi hàm injectStore ngay lập tức để gán biến mainStore vào biến axiosReduxStore cục bộ trong file này
 * https://redux.js.org/faq/code-structure#how-can-i-use-the-redux-store-in-non-component-files
 */


// Khởi tạo một đối tượng Axios (authorizedAxiosInstance) mục đích để custom và cấu hình chung cho dự án
let authorizedAxiosInstance = axios.create()
// Thời gian chờ tối đa của 1 request: 10 phút
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10
// withCredentials: sẽ cho phép Axios tự động gửi cookie trong mỗi request lên BE (phục vụ việc chúng ta sẽ lưu JWT tokens (refresh & access) vào trong httpOnly Cookie của trình duyệt)
authorizedAxiosInstance.defaults.withCredentials = true

// Cấu hình interceptors (bộ đánh chặn giữa mọi Request & Response)
// Add a request interceptor: can thiệp vào những request API
authorizedAxiosInstance.interceptors.request.use(
  (config) => {
    interceptorLoadingElements(true)
    return config
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error)
  }
)

authorizedAxiosInstance.interceptors.response.use(
  (response) => {
    interceptorLoadingElements(false)
    return response
  },
  (error) => {
    interceptorLoadingElements(false)
    let errorMessage = error?.message
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    }
    
    if (error.response?.status !== 410) {
      toast.error(errorMessage)
    }

    return Promise.reject(error)
  }
)
export default authorizedAxiosInstance
