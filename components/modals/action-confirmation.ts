import { MzBaseModal } from 'ng2-materialize'
import { LocaleService, TranslationService } from 'angular-l10n'


// @Component({
//   // Para todos los componentes hijos de este componente, se puede usar 
//   // exactamente la misma vista
//   templateUrl: '../../templates/modals/action.confirmation.html'
// })
export abstract class ActionConfirmationModalComponent extends MzBaseModal
{
  protected _title: string = null
  protected _message: string = null

  constructor(
    public locale: LocaleService,
    public textTranslator: TranslationService
  ) {
    super()
  }

  set title(value: string) {
    this._title = value
  }

  set message(value: string) {
    this._message = value
  }

  protected abstract onActionConfirmed(): void
}