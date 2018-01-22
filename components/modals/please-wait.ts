import { Component } from '@angular/core'
import { Modal } from './base'


@Component({
  templateUrl: '../../templates/modals/please.wait.html'
})
export class ProgressModalComponent extends Modal 
{
  constructor() {
    super()
    this.properties.dismissible = false
  }
}