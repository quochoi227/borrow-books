let id = 0

export function useToast() {
  const show = (message, type = 'info', duration = 3000) => {
    const toast = { id: id++, message, type, duration }
    window.dispatchEvent(new CustomEvent('add-toast', { detail: { toast } }))
  }

  return {
    info: (msg, duration) => show(msg, 'info', duration),
    success: (msg, duration) => show(msg, 'success', duration),
    error: (msg, duration) => show(msg, 'error', duration),
    warning: (msg, duration) => show(msg, 'warning', duration),
  }
}
