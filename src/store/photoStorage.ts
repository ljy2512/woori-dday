const PREFIX = 'dday-photos-'

export function loadPhotos(id: string): string[] {
  try {
    const raw = localStorage.getItem(PREFIX + id)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function savePhotos(id: string, photos: string[]) {
  if (photos.length === 0) {
    localStorage.removeItem(PREFIX + id)
  } else {
    localStorage.setItem(PREFIX + id, JSON.stringify(photos))
  }
}

export function deletePhotos(id: string) {
  localStorage.removeItem(PREFIX + id)
}

export function resizeImage(file: File, maxPx = 800, quality = 0.72): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        let { width, height } = img
        if (width > height && width > maxPx) {
          height = Math.round((height * maxPx) / width)
          width = maxPx
        } else if (height > maxPx) {
          width = Math.round((width * maxPx) / height)
          height = maxPx
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        canvas.getContext('2d')!.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.onerror = reject
      img.src = e.target!.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
