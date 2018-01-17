import { Component } from '@angular/core'
import { Modal } from './base'
import { LanguageService } from '../../services/language'


@Component({
  templateUrl: '../../templates/modals/please.wait.html'
})
export class ProgressModalComponent extends Modal 
{
  constructor(langManager: LanguageService) {
    super(langManager)
    this.properties.dismissible = false
  }
}