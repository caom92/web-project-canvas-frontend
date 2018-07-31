import { OnInit, ComponentRef, EventEmitter } from '@angular/core'
import { MzBaseModal, MzModalService } from 'ngx-materialize'
import { LocaleService, TranslationService } from 'angular-l10n'
import { FormBuilder, FormGroup } from '@angular/forms'
import { 
  BackendResponse, 
  BackendService, 
  OnSuccessCallback 
} from './../../services/backend'
import { 
  FormErrorsTranslationService 
} from './../../services/form-error-translation'
import { ProgressModalComponent } from './please-wait'
import { RoundedToastService } from './../../services/toast'
import { getServiceMessage } from './../../functions/utility'


export abstract class AddItemAbstractModalComponent 
  extends MzBaseModal implements OnInit {
  
  readonly serviceResponse: EventEmitter<any> = new EventEmitter()

  protected form: FormGroup
  protected progressModal: ComponentRef<MzBaseModal>

  constructor(
    public locale: LocaleService,
    public textTranslator: TranslationService,
    protected readonly formBuilder: FormBuilder,
    protected readonly server: BackendService,
    protected readonly formErrors: FormErrorsTranslationService,
    protected readonly modalManager: MzModalService,
    protected readonly toastManager: RoundedToastService
  ) {
    super()
  }

  // override OnInit
  ngOnInit(): void {
    this.textTranslator.translationChanged()
      .subscribe(this.onTranslationChanged)
    this.form = this.getFormGroup()
  }

  protected abstract get onTranslationChanged(): () => void
  protected abstract getFormGroup(): FormGroup
  protected abstract getServiceInputData(): FormData
  protected abstract get serviceName(): string
  protected abstract get serviceMessage(): string
  protected abstract getObserverInputData(response: BackendResponse): any

  protected onFormSubmit(): void {
    this.progressModal = this.modalManager.open(ProgressModalComponent)
    this.requestService()
  }

  protected get requestService(): () => void {
    return () => {
      this.server.create(
        this.serviceName, this.getServiceInputData(), this.onServiceResponse
      )
    }
  }

  protected get onServiceResponse(): OnSuccessCallback {
    return (response: BackendResponse) => {
      this.progressModal.instance.modalComponent.closeModal()
      this.toastManager.show(getServiceMessage(
        this.textTranslator, this.serviceMessage, response.returnCode
      ))

      if (response.returnCode === 0) {
        this.serviceResponse.emit(this.getObserverInputData(response))
        this.modalComponent.closeModal()
      }
    }
  }
}
