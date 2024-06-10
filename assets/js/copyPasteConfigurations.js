function successNotification(message) {
  const notification = document.getElementById('success-notification-wrapper')
  const messageElement = notification.querySelector('.moj-banner__message')
  messageElement.textContent = message
  notification.classList.remove('govuk-!-display-none')
  setTimeout(() => {
    notification.classList.add('govuk-!-display-none')
  }, 7000)
}

function warningNotification(message) {
  const notification = document.getElementById('warning-notification-wrapper')
  const messageElement = notification.querySelector('.moj-banner__message')
  messageElement.textContent = message
  notification.classList.remove('govuk-!-display-none')
  setTimeout(() => {
    notification.classList.add('govuk-!-display-none')
  }, 7000)
}

function copyFormConfigurationToClipboard() {
  const form = document.getElementById('form')
  if (form) {
    const formData = new FormData(form)
    const entries = Array.from(formData.entries())

    const groupedData = entries.reduce((acc, [key, value]) => {
      const element = form.elements[key]
      const group = element.dataset.inputGroup
      if (group !== undefined) {
        if (group === 'root') {
          acc[key] = value // Add directly to the root
        } else {
          if (!acc[group]) {
            acc[group] = {}
          }
          acc[group][key] = value
        }
      }
      return acc
    }, {})

    const clipboardContent = JSON.stringify(groupedData, null, 2)

    navigator.clipboard
      .writeText(clipboardContent)
      .then(() => {
        successNotification('Configuration was copied successfully to your clipboard')
      })
      .catch(err => {
        warningNotification('Failed to copy configuration to your clipboard')
        console.log(err)
      })
  }
}

function pasteFormConfigurationFromClipboard() {
  navigator.clipboard
    .readText()
    .then(text => {
      const data = JSON.parse(text)
      const form = document.getElementById('form')

      for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'object' && value !== null) {
          for (const [subKey, subValue] of Object.entries(value)) {
            const element = form.elements[subKey]
            if (element) {
              element.value = subValue
            }
          }
        } else {
          const element = form.elements[key]
          if (element) {
            element.value = value
          }
        }
      }

      successNotification('Configuration was pasted successfully from your clipboard')
    })
    .catch(err => {
      warningNotification('Failed to paste configuration from your clipboard')
      console.log(err)
    })
}

function copyHandoverLinkToClipboard() {
  const handoverLink = document.getElementById('one-time-link')
  handoverLink.select()
  handoverLink.setSelectionRange(0, 99999)
  navigator.clipboard
    .writeText(handoverLink.value)
    .then(() => {
      successNotification('Handover link was successfully copied to your clipboard')
    })
    .catch(err => {
      warningNotification('Failed to copy handover link to your clipboard')
      console.log(err)
    })
}

document.addEventListener('DOMContentLoaded', event => {
  document.getElementById('copy-configuration-btn')?.addEventListener('click', copyFormConfigurationToClipboard)
  document.getElementById('paste-configuration-btn')?.addEventListener('click', pasteFormConfigurationFromClipboard)
  document.getElementById('one-time-link-copy-btn')?.addEventListener('click', copyHandoverLinkToClipboard)
})
