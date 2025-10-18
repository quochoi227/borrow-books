import cloudinary from 'cloudinary'
import streamifier from 'streamifier'

/**
 * Tài liệu tham khảo
 * https://cloudinary.com/blog/node_js_file_upload_to_a_local_server_or_to_the_cloud
 */

// Bước đầu cấu hình v2 - version 2
const cloudinaryV2 = cloudinary.v2
cloudinaryV2.config({
  cloud_name: 'dkg5xoyc0',
  api_key: '835786383543544',
  api_secret: 'udUnh8Lw5SKXwtMa533dXiejUu0'
})

// Khởi tạo 1 function để thực hiện upload file lên Cloudinary
const streamUpload = (fileBuffer, folderName) => {
  return new Promise((resolve, reject) => {
    // Tạo một luồng tream upload lên Cloudinary
    const stream = cloudinaryV2.uploader.upload_stream({ folder: folderName }, (err, result) => {
      if (err) reject(err)
      else resolve(result)
    })
    // Thực hiện upload cái luồng trên bằng lib streamifier
    streamifier.createReadStream(fileBuffer).pipe(stream)
  })
}

const deleteImage = async (publicId) => {
  await cloudinaryV2.uploader.destroy(publicId)
}

export const CloudinaryProvider = {
  streamUpload,
  deleteImage
}
