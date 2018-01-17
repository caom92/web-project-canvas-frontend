import { MzBaseModal } from 'ng2-materialize'
import { LanguageService } from '../../services/language'


export class Modal extends MzBaseModal {
  protected properties: any = {}

  constructor(protected langManager: LanguageService) {
    super()
  }
}