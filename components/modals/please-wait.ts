import { Component } from '@angular/core'
import { LocaleService, TranslationService, Language } from 'angular-l10n'
import { MzBaseModal } from 'ngx-materialize'
import { environment } from '../../../environments/environment'


@Component({
  templateUrl: '../../templates/modals/please-wait.html'
})
export class ProgressModalComponent extends MzBaseModal {
  
  @Language()
  lang: string

  private readonly options = {
    dismissible: !environment.production
  }

  constructor(
    locale: LocaleService,
    textTranslator: TranslationService
  ) {
    super()
  }
}
