// 用户 Mock 数据
export const mockUsers = [
  {
    id: 1,
    username: 'testuser',
    email: 'test@music.com',
    password: 'Abc123',
    nickname: '音乐爱好者',
    avatar: '',
    createTime: '2024-01-15',
    stats: { dynamic: 12, fans: 56, follow: 38 }
  }
]

// 查找用户
export function findUser(email) {
  return mockUsers.find(u => u.email === email || u.username === email)
}

// 添加用户
export function addUser(user) {
  const newUser = {
    id: mockUsers.length + 1,
    ...user,
    nickname: user.username || user.email.split('@')[0],
    avatar: '',
    createTime: new Date().toISOString().split('T')[0]
  }
  mockUsers.push(newUser)
  return newUser
}
