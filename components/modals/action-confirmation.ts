import { Component, Input, OnInit } from '@angular/core'
import { MzBaseModal } from 'ng2-materialize'
import { LocaleService, TranslationService, Language } from 'angular-l10n'


@Component({
  // Para todos los componentes hijos de este componente, se puede usar 
  // exactamente la misma vista
  templateUrl: '../../templates/modals/action.confirmation.html'
})
export abstract class ActionConfirmationModalComponent extends MzBaseModal
{
  @Language()
  lang: string

  @Input()
  title: string = null

  @Input()
  message: string = null

  @Input()
  invokingComponent: any = null

  constructor(
    public locale: LocaleService,
    public textTranslator: TranslationService
  ) {
    super()
  }

  abstract onActionConfirmed(): void
}