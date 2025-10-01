export const formatDate = (rawDate) => {
  const date = new Date(rawDate);

  // Lấy ngày, tháng, năm
  const day = date.getDate(); // 29
  const month = date.getMonth() + 1; // 9 (getMonth trả về 0–11)
  const year = date.getFullYear(); // 2025

  return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`
}
