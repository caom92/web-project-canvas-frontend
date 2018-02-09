import { Component } from '@angular/core'
import { LocaleService, TranslationService, Language } from 'angular-l10n'
import { MzBaseModal } from 'ng2-materialize'


@Component({
  templateUrl: '../../templates/modals/please-wait.html'
})
export class ProgressModalComponent extends MzBaseModal {

  @Language()
  lang: string

  private readonly options = {
    dismissable: false
  }

  constructor(
    public locale: LocaleService,
    public textTranslator: TranslationService
  ) {
    super()
  }
}