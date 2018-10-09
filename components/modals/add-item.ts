import { OnInit, EventEmitter } from '@angular/core'
import { MzBaseModal, MzModalService, MzModalComponent } from 'ngx-materialize'
import { TranslationService } from 'angular-l10n'
import { FormBuilder, FormGroup } from '@angular/forms'
import {
  BackendService, OnRequestSuccessCallback
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

  protected progressModal: MzModalComponent

  private _form: FormGroup

  constructor(
    readonly textTranslator: TranslationService,
    protected readonly formBuilder: FormBuilder,
    protected readonly server: BackendService,
    protected readonly formErrors: FormErrorsTranslationService,
    protected readonly modalService: MzModalService,
    protected readonly toastService: RoundedToastService
  ) {
    super()
  }

  get form(): FormGroup {
    return this._form
  }

  // override OnInit
  ngOnInit(): void {
    this.textTranslator.translationChanged().subscribe(
      this.onTranslationChanged
    )
    this._form = this.getFormGroup()
  }

  protected abstract get onTranslationChanged(): () => void
  protected abstract getFormGroup(): FormGroup
  protected abstract getServiceInputData(): FormData
  protected abstract get serviceName(): string
  protected abstract get serviceMessage(): string
  protected abstract getObserverInputData(data: any): any

  protected onFormSubmit(): void {
    this.progressModal =
      this.modalService.open(ProgressModalComponent).instance.modalComponent
    this.requestService()
  }

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
