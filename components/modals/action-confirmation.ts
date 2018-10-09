import { Component, EventEmitter } from '@angular/core'
import { LocaleService, TranslationService, Language } from 'angular-l10n'
import { MzBaseModal } from 'ngx-materialize'


@Component({
  templateUrl: '../../templates/modals/action-confirmation.html'
})
export class ActionConfirmationModalComponent extends MzBaseModal {
  
  @Language()
  lang: string
  
  title: string = null
  message: string = null
  context: any
  readonly actionConfirmation: EventEmitter<any> = new EventEmitter()

  constructor(
    public locale: LocaleService,
    public textTranslator: TranslationService
  ) {
    super()
  }

  protected onActionConfirmed(): void {
    this.actionConfirmation.emit(this.context)
  }
}
