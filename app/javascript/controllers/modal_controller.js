import { Controller } from "@hotwired/stimulus"
import Rails from "@rails/ujs"
import * as bootstrap from 'bootstrap'

export default class extends Controller {
  static targets = ["container"]

  connect() {
    this.element.addEventListener('turbo:before-fetch-response', this.populate)
    this.element.addEventListener('turbo:submit-start', this.beforeSend)
  }

  disconnect() {
    this.element.removeEventListener('turbo:before-fetch-response', this.populate)
    this.element.removeEventListener('turbo:submit-start', this.beforeSend)
  }

  open(ev) {
    ev.preventDefault()

    const url = ev.currentTarget.href
    Rails.ajax({
      type: 'get',
      url: url,
      dataType: 'html',
      beforeSend: (xhr, options) => {
        xhr.setRequestHeader('X-Show-In-Modal', true)
        return true
      },
      success: (data) => {
        if (this.hasContainerTarget) {
          this.containerTarget.replaceWith(data.body.firstChild)
        } else {
          this.element.appendChild(data.body.firstChild)
        }

        this.modal = new bootstrap.Modal(this.containerTarget)
        this.modal.show()
      },
      error: (data) => {
        console.log('error', data)
      }
    })
  }

  beforeSend = (event) => {
    const { detail: { formSubmission } } = event
    formSubmission.fetchRequest.headers['X-Show-In-Modal'] = true
  }

  populate = async (event) => {
    const { detail: { fetchResponse } } = event
    if (!fetchResponse.succeeded) {
      event.preventDefault()
      const html = await fetchResponse.responseText
      this.replaceModalContent(html)
    }
  }

  replaceModalContent(html) {
    const fragment = document.createElement('div')
    fragment.innerHTML = html
    const newContent = fragment.querySelector('.modal-content')
    this.containerTarget.querySelector('.modal-content').replaceWith(newContent)
  }
}
