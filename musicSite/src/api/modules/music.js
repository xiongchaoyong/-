import service from '../index'

export async function getBanners() {
  return service.get('/banner')
}

export async function getRecommendPlaylists() {
  return service.get('/playlist/recommend')
}

export async function getSongs() {
  return service.get('/songs')
}

export async function getLatestSongs() {
  return service.get('/songs/latest')
}
