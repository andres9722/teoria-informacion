const CACHE_NAME = 'teoria'
const urlsToCache = [
  './',
  './?utm=homescreen',
  './index.html',
  './index.html?utm=homescreen',
  './style.css',
  './index.js',
  './favicon.ico',
  './icon_192x192.png'
]

self.addEventListener('install', e => {
  console.log('Evento: SW Instalado')
  e.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => {
        console.log('Archivos en cache')
        return cache.addAll(urlsToCache)
      })
      .catch(err => console.log('Fallo registro de cache', err))
  )
})

self.addEventListener('activate', e => {
  console.log('Evento: SW Activado')
  const cacheList = [CACHE_NAME]
  e.waitUntil(
    caches
      .keys()
      .then(cachesNames => {
        return Promise.all(
          cachesNames.map(cacheName => {
            if (cacheList.indexOf(cacheName) === -1) {
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('El cache esta limpio y actualizado')
        return self.clients.claim()
      })
  )
})

self.addEventListener('fetch', e => {
  console.log('Evento: SW Recuperando')
  e.respondWith(
    caches.match(e.request).then(res => {
      if (res) {
        return res
      }

      return fetch(e.request)
    })
  )
})

self.addEventListener('push', e => {
  console.log('Evento: Push')
  let title = 'Notificacion Demo'
  let options = {
    body: 'Click para regresar a la Aplicacion',
    icon: './icon_192x192.png',
    vibrate: [100, 50, 100],
    data: { id: 1 },
    actions: [
      { action: 'SI', title: 'Amo esta App', icon: './img/icon_192x192.png' },
      {
        action: 'NO',
        title: 'No me gusta esta App',
        icon: './img/icon_192x192.png'
      }
    ]
  }
  e.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', e => {
  console.log(e)
  if (e.action === 'SI') {
    console.log('Notes')
  } else if (e.action === 'NO') {
    console.log('No me gusta la app')
  }
  e.notification.close()
})

self.addEventListener('sync', e => {
  console.log('Sincronizacion de fondo', e)
  if (e.tag === 'github' || e.tag === 'test-tags-from-devtools') {
    e.waitUntil(
      self.clients
        .matchAll()
        .then(all => {
          return all.map(client => {
            return client.postMessage('online')
          })
        })
        .catch(err => console.log(err))
    )
  }
})
