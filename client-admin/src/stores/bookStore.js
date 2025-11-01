import { defineStore } from 'pinia'
import { fetchBooksAPI, addNewBookAPI, fetchPublishersAPI } from '@/apis'

import { useToast } from '@/composables/useToast'
const toast = useToast()

export const useBookStore = defineStore('book', {
  state: () => ({
    books: [],
    totalPages: 0,
    count: 0,
    publishers: []
  }),
  getters: {
    getBooks: (state) => state.books
  },
  actions: {
    fetchPublishers() {
      fetchPublishersAPI().then((publishers) => {
        this.publishers = publishers
      })
    },
    addPublisher(publisherData) {
      this.publishers.push(publisherData)
    },
    fetchBooks({ page = 1, limit = 5, search = '', publisher = '', stockState = '' } = {}) {
      fetchBooksAPI({ page, limit, search, publisher, stockState }).then(({ books, totalPages, count }) => {
        this.books = books
        this.count = count
        this.totalPages = totalPages
      })
    },
    addBook(bookData) {
      const formData = new FormData()
      Object.keys(bookData).forEach((key) => {
        if (key === 'anhChiTiet' && bookData.anhChiTiet) {
          for (let i = 0; i < bookData.anhChiTiet.length; i++) {
            formData.append('bookImgs', bookData.anhChiTiet[i])
          }
        } else if (key === 'anhBia') {
          formData.append('bookImg', bookData.anhBia)
        } else if (key === 'theLoai') {
          formData.append('theLoai', JSON.stringify(bookData[key]))
        } else if (key === 'soQuyenConLai') {
          formData.append('soQuyenConLai', bookData.soQuyen)
        } else {
          formData.append(key, bookData[key])
        }
      })
      addNewBookAPI(formData).then((data) => {
        toast.success('Thêm sách thành công')
        if (this.books.length < 5) {
          const newPublisher = this.publishers.find((publisher) => publisher.maNXB === data.maNXB)
          this.books.push({
            ...data,
            nhaXuatBan: {
              ...newPublisher || {}
            }
          })
        }
        if (this.count % 5 === 0) {
          this.totalPages += 1
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    deleteBook(bookId) {
      this.books = this.books.filter((b) => b._id !== bookId)
      if (this.books.length === 0 && this.totalPages > 1) {
        this.totalPages -= 1
      }
    },
    setBook(data) {
      const targetBook = this.books.find((b) => b._id === data._id)
      if (targetBook) {
        Object.assign(targetBook, data)
      }
    },
    decrementBookCopyCount(bookId) {
      const book = this.books.find((b) => b.maSach === bookId)
      if (book && book.soQuyenConLai > 0) {
        book.soQuyenConLai -= 1
      }
    },
    incrementBookCopyCount(bookId) {
      const book = this.books.find((b) => b.maSach === bookId)
      if (book) {
        book.soQuyenConLai += 1
      }
    }
  }
})
