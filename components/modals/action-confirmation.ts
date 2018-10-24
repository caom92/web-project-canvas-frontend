import { Component, EventEmitter, Input } from '@angular/core'
import { TranslationService, Language } from 'angular-l10n'
import { MzBaseModal } from 'ngx-materialize'


@Component({
  templateUrl: '../../templates/modals/action-confirmation.html'
})
export class ActionConfirmationModalComponent extends MzBaseModal {

  @Language()
  lang: string

  @Input()
  title: string

  @Input()
  message: string

  @Input()
  set context(value: any) {
    this._context = value
  }

  readonly actionConfirmation: EventEmitter<any> = new EventEmitter()

  private _context: any

  constructor(readonly textTranslator: TranslationService) {
    super()
  }

  onActionConfirmed(): void {
    this.actionConfirmation.emit(this._context)
  }
}
