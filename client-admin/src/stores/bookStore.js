import { defineStore } from 'pinia'
import { fetchBooksAPI } from '@/apis'

export const useBookStore = defineStore('book', {
  state: () => ({
    books: []
  }),
  getters: {
    getBooks: (state) => state.books
  },
  actions: {
    async fetchBooks() {
      try {
        const data = await fetchBooksAPI()
        this.books = this.books.concat(data)
        return data
      } catch (error) {
        throw error
      }
    },
    setBooks(data) {
      this.books = data
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
