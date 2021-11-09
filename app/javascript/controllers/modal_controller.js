import { Controller } from "@hotwired/stimulus"
import Rails from "@rails/ujs"
import * as bootstrap from 'bootstrap'

export default class extends Controller {
  static targets = ["container"]

  open(ev) {
    ev.preventDefault()

    const url = ev.currentTarget.href
    Rails.ajax({
      type: 'get',
      url: url,
      dataType: 'html',
      beforeSend: (xhr, options) => {
        xhr.setRequestHeader('X-Show-In-Modal', true)
      },
      success: (data) => {
        console.log('hoge', data)
        if (this.hasContainerTarget) {
          this.containerTarget.replaceWith(data.body.firstChild)
        } else {
          this.element.appendChild(data.body.firstChild)
        }
        this.openModal()
      },
      error: (data) => {
        console.log('error', data)
      }
    })
  }

  openModal() {
    const modal = bootstrap.Modal(this.containerTarget)
    modal.show()
  }
}
