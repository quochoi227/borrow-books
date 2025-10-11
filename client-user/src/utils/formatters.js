import { format, parseISO } from 'date-fns'

export const formatDate = (rawDate) => {
  const formatted = format(parseISO(rawDate), 'dd-MM-yyyy')
  return formatted
}

export const formatCurrency = (amount) => {
  const formatted = amount.toLocaleString('vi-VN') + ' VNĐ'
  return formatted
}

export const interceptorLoadingElements = (calling) => {
  const elements = document.querySelectorAll('.interceptor-loading')
  for (let i = 0; i < elements.length; i++) {
    if (calling) {
      elements[i].style.opacity = '0.5'
      elements[i].style.pointerEvents = 'none'
    } else {
      elements[i].style.opacity = 'initial'
      elements[i].style.pointerEvents = 'initial'
    }
  }
}
