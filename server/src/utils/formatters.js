import { pick } from 'lodash'

export const pickUser = (user) => {
  if (!user) return {}
  return pick(user, ['_id', 'maDocGia', 'ten', 'hoLot', 'ngaySinh', 'phai', 'diaChi', 'dienThoai'])
}
