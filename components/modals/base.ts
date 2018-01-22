import { MzBaseModal } from 'ng2-materialize'
import { Language } from 'angular-l10n'


export class Modal extends MzBaseModal {
  @Language()
  lang: string

  protected properties: any = {}

  constructor() {
    super()
  }
}