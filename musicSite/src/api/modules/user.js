import service from '../index'

export async function loginAPI(credentials) {
  const res = await service.post('/user/login', credentials)
  return res.data
}

export async function registerAPI(data) {
  const res = await service.post('/user/register', data)
  return res.data
}

export async function sendVerifyCodeAPI(email) {
  const res = await service.post('/user/verify-code', { email })
  return res.data
}

export async function changePasswordAPI(data) {
  const res = await service.post('/user/change-password', data)
  return res.data
}
