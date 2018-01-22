import { Component, Input, OnInit } from '@angular/core'
import { Modal } from './base'


@Component({
  // Para todos los componentes hijos de este componente, se puede usar 
  // exactamente la misma vista
  templateUrl: '../../templates/modals/action.confirmation.html'
})
export abstract class ActionConfirmationModalComponent extends Modal
{
  @Input()
  title: string = null

  @Input()
  message: string = null

  @Input()
  invokingComponent: any = null

  constructor() {
    super()
    this.properties.dismissible = false
  }

  abstract onActionConfirmed(): void
}