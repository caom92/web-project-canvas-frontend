import { OnInit, EventEmitter } from '@angular/core'
import { MzBaseModal, MzModalService, MzModalComponent } from 'ngx-materialize'
import { TranslationService } from 'angular-l10n'
import { FormBuilder, FormGroup } from '@angular/forms'
import {
  BackendService, OnRequestSuccessCallback
} from './../../services/backend'
import {
  FormTextsService
} from '../../services/form-texts'
import { ProgressModalComponent } from './please-wait'
import { RoundedToastService } from './../../services/toast'
import { getServiceMessage } from './../../functions/utility'


export abstract class AddItemAbstractModalComponent
  extends MzBaseModal implements OnInit {

  readonly serviceResponse: EventEmitter<any> = new EventEmitter()

  protected progressModal: MzModalComponent
  protected $form: FormGroup

  constructor(
    readonly textTranslator: TranslationService,
    protected readonly formBuilder: FormBuilder,
    protected readonly server: BackendService,
    protected readonly formErrors: FormTextsService,
    protected readonly modalService: MzModalService,
    protected readonly toastService: RoundedToastService
  ) {
    super()
  }

  get form(): Readonly<FormGroup> {
    return this.$form
  }

  // override OnInit
  ngOnInit(): void {
    this.textTranslator.translationChanged().subscribe(
      this.onTranslationChanged
    )
    this.$form = this.getFormGroup()
  }

  onFormSubmit(): void {
    this.progressModal =
      this.modalService.open(ProgressModalComponent).instance.modalComponent
    this.requestService()
  }

  protected abstract get onTranslationChanged(): () => void
  protected abstract getFormGroup(): FormGroup
  protected abstract getServiceInputData(): FormData
  protected abstract get serviceName(): string
  protected abstract get serviceMessage(): string
  protected abstract getObserverInputData(data: any): any

  protected get requestService(): () => void {
    return () => {
      this.server.create(
        this.serviceName, this.getServiceInputData(), this.onServiceResponse
      )
    }
  }

  protected onServiceResponse: OnRequestSuccessCallback =
    (response) => {
      this.progressModal.closeModal()
      this.toastService.show(getServiceMessage(
        this.textTranslator, this.serviceMessage, response.returnCode
      ))

      if (response.returnCode === 0) {
        this.serviceResponse.emit(this.getObserverInputData(response))
        this.modalComponent.closeModal()
      }
    }
}
