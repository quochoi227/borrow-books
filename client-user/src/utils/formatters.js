import { format, parseISO } from 'date-fns'

export const formatDate = (rawDate) => {
  const formatted = format(parseISO(rawDate), 'dd-MM-yyyy')
  return formatted
}

export const formatCurrency = (amount) => {
  const formatted = amount.toLocaleString('vi-VN') + ' VNĐ'
  return formatted
}
