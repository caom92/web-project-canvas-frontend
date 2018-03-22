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
    dismissible: false
  }

  constructor(
    locale: LocaleService,
    textTranslator: TranslationService
  ) {
    super()
  }
}
