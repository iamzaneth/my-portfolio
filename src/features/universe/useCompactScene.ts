import { useSyncExternalStore } from 'react'
const query = '(max-width: 900px)'
function subscribe(callback: () => void) {
  const media = matchMedia(query)
  media.addEventListener('change', callback)
  return () => media.removeEventListener('change', callback)
}
export function useCompactScene() {
  return useSyncExternalStore(subscribe, () => matchMedia(query).matches, () => true)
}
