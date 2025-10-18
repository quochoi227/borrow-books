// composables/useCarouselAutoScroll.js
import { onMounted, onUnmounted } from 'vue'

export function useCarouselAutoScroll({
  selector = '.carousel',
  itemSelector = '.carousel-item',
  interval = 3000,
  direction = 'forward'
} = {}) {
  let intervalId = null

  onMounted(() => {
    const carousel = document.querySelector(selector)
    const items = carousel?.querySelectorAll(itemSelector)

    if (!carousel || !items || items.length < 2) return

    let index = 0

    intervalId = setInterval(() => {
      if (direction === 'forward') {
        index = (index + 1) % items.length
      } else {
        index = (index - 1 + items.length) % items.length
      }

      items[index].scrollIntoView({
        behavior: 'smooth',
        inline: 'center'
      })
    }, interval)
  })

  onUnmounted(() => {
    if (intervalId) clearInterval(intervalId)
  })
}
