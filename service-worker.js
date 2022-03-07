const networkCacheName = 'offline-arcade 0.1'

self.addEventListener('install', async event => {
  const keys = await caches.keys()

  keys.forEach(key => {
    if (key !== networkCacheName && key !== fileCacheName) {
      caches.delete(key)
    }
  })
})

self.addEventListener("fetch", event => {
  event.respondWith(
    respond(event.request)
  )
})

async function respond(req) {
  const url = new URL(req.url)

  const cache = await caches.open(networkCacheName)
  const cachedResponse = await cache.match(req)
  
  if (url.hostname === 'localhost') {
    try {
      const networkResponse = await fetch(req)
      cacheRequest(req, networkResponse.clone())

      return networkResponse
    } catch (err) {
      if (cachedResponse) {
        return cachedResponse
      } else {
        throw err
      }
    }
  } else {
    const networkFetch = fetch(req).then(networkResponse => {
      cacheRequest(req, networkResponse.clone())

      return networkResponse
    })

    if (cachedResponse) {
      return cachedResponse
    } else {
      return networkFetch
    }
  }
}

async function cacheRequest(req, res) {
  if (!res.ok) return

  const cache = await caches.open(networkCacheName)
  await cache.put(req, res)
}