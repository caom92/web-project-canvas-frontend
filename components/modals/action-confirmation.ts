import { Component } from '@angular/core'
import { SubjectModal } from './subject'
import { LocaleService, TranslationService, Language } from 'angular-l10n'


@Component({
  templateUrl: '../../templates/modals/action-confirmation.html'
})
export class ActionConfirmationModalComponent extends SubjectModal
{
  @Language()
  lang: string
  
  title: string = null
  message: string = null
  context: any

  constructor(
    public locale: LocaleService,
    public textTranslator: TranslationService
  ) {
    super()
  }

  protected onActionConfirmed(): void {
    this.notifyObservers(this.context)
  }
}