function copyOtlToClipboard() {
  const oneTimeLink = document.getElementById('one-time-link')
  oneTimeLink.select()
  oneTimeLink.setSelectionRange(0, 99999)
  navigator.clipboard.writeText(oneTimeLink.value)
  const notification = document.getElementById('one-time-link-notification')
  notification.classList.remove('govuk-visually-hidden')
}

;(function setupOtlButton() {
  const button = document.getElementById('one-time-link-copy')
  button.addEventListener('click', () => {
    copyOtlToClipboard()
    button.setAttribute('disabled', 'disabled')
  })
})()
