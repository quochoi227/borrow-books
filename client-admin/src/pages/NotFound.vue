<script setup>
import { Cropper } from 'vue-advanced-cropper';
import { uploadImageAPI } from '@/apis';
import 'vue-advanced-cropper/dist/style.css';
import { ref } from 'vue';

const img = 'https://images.unsplash.com/photo-1600984575359-310ae7b6bdf2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=80';
const cropperRef = ref(null);

// Khởi tạo một đối tượng FormData duy nhất và reactive
const uploadFormData = ref(new FormData()); 
const IMAGE_KEY = 'bookImg'; // Key mà server của bạn mong đợi

function change({ canvas }) {
    if (canvas) {
        // GỌI HÀM CẬP NHẬT: Không gửi đi ngay, chỉ cập nhật FormData
        prepareForUpload(canvas); 
    }
}

function prepareForUpload(canvas) {
    canvas.toBlob((blob) => {
        if (blob) {
            // SỬ DỤNG SET() ĐỂ GHI ĐÈ:
            // Nếu 'cover_image' đã tồn tại, nó sẽ bị ghi đè bằng 'blob' mới.
            uploadFormData.value.set(IMAGE_KEY, blob, 'cropped_cover.jpg');
            
            console.log(`FormData đã được cập nhật. Key '${IMAGE_KEY}' chỉ có 1 giá trị.`);
        }
    }, 'image/jpeg', 0.9);
}

// Hàm gửi dữ liệu lên server (chỉ gọi khi người dùng BẤM NÚT)
function submitForm() {
    // Kiểm tra xem đã có ảnh trong FormData chưa trước khi gửi
    if (uploadFormData.value.has(IMAGE_KEY)) {
        uploadImageAPI(uploadFormData.value)
            .then(response => {
                console.log('Ảnh bìa đã được tải lên thành công:', response);
            })
            .catch(error => {
                console.error('Lỗi khi tải lên ảnh bìa:', error);
            });
        // Ví dụ: axios.post('/api/upload', uploadFormData.value);
    } else {
        console.warn('Chưa có ảnh bìa để upload.');
    }
}
</script>

<template>
    <div class="w-full h-screen flex flex-col items-center justify-center">
        <cropper
            ref="cropperRef"
            :src="img"
            :stencil-props="{ aspectRatio: 2/3 }"
            @change="change"
        />
        
        <button @click="submitForm" class="mt-4 bg-green-500 text-white p-2 rounded">
            Lưu và Tải lên Ảnh Bìa
        </button>
    </div>
</template>