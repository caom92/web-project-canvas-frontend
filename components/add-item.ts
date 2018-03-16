import { OnInit, ComponentRef } from '@angular/core'
import { MzBaseModal, MzModalService } from 'ng2-materialize'
import { LocaleService, TranslationService } from 'angular-l10n'
import { FormBuilder, FormGroup } from '@angular/forms'
import { 
  BackendServiceImp 
} from './../../services/backend'
import { 
  BackendResponse, 
  OnSuccessCallback 
} from './../../web-project-canvas-frontend/services/backend'
import { 
  FormErrorsTranslationServiceImp 
} from '../../services/form-error-translations'
import { 
  ProgressModalComponent 
} from '../../web-project-canvas-frontend/components/modals/please-wait'
import { 
  RoundedToastService 
} from '../../web-project-canvas-frontend/services/toast'
import { 
  getServiceMessage
} from '../../web-project-canvas-frontend/functions/utility'
import { 
  SubjectModal 
} from './../../web-project-canvas-frontend/components/modals/subject'


export abstract class AddItemAbstractModalComponent 
  extends SubjectModal implements OnInit
{
  protected form: FormGroup
  protected progressModal: ComponentRef<MzBaseModal>

  constructor(
    public locale: LocaleService,
    public textTranslator: TranslationService,
    protected readonly formBuilder: FormBuilder,
    protected readonly server: BackendServiceImp,
    protected readonly formErrors: FormErrorsTranslationServiceImp,
    protected readonly modalManager: MzModalService,
    protected readonly toastManager: RoundedToastService
  ) {
    super()
  }

  protected abstract get onTranslationChanged(): () => void
  protected abstract getFormGroup(): FormGroup
  protected abstract getServiceInputData(): FormData
  protected abstract get serviceName(): string
  protected abstract getObserverInputData(response: BackendResponse): any

  // override OnInit
  ngOnInit(): void {
    this.textTranslator.translationChanged()
      .subscribe(this.onTranslationChanged)
    this.form = this.getFormGroup()
  }

  protected onFormSubmit(): void {
    this.progressModal = this.modalManager.open(ProgressModalComponent)
    this.server.write(
      this.serviceName, this.getServiceInputData(), this.onServiceResponse
    )
  }

  private get onServiceResponse(): OnSuccessCallback {
    return (response: BackendResponse) => {
      this.progressModal.instance.modalComponent.close()
      this.toastManager.show(getServiceMessage(
        this.textTranslator, this.serviceName, response.returnCode
      ))

      if (response.returnCode == 0) {
        this.notifyObservers(this.getObserverInputData(response))
        this.modalComponent.close()
      }
    }
  }
}