import { OnInit, EventEmitter, ViewChild } from '@angular/core'
import { MzBaseModal, MzModalService, MzModalComponent } from 'ngx-materialize'
import { TranslationService } from 'angular-l10n'
import {
  BackendService, OnRequestSuccessCallback, createResponseCallback
} from './../../services/backend'
import { ProgressModalComponent } from './please-wait'
import { RoundedToastService } from './../../services/toast'
import { getServiceMessage } from './../../functions/utility'
import { FormAbstractComponent } from '../app/form'


export abstract class AddItemAbstractModalComponent
  extends MzBaseModal implements OnInit {

  @ViewChild('formComponent')
  formComponent: FormAbstractComponent

  readonly serviceResponse: EventEmitter<any> = new EventEmitter()

  protected progressModal: MzModalComponent
  protected onServiceResponse: OnRequestSuccessCallback =
    createResponseCallback({
      beforeEval: (response) => {
        this.progressModal.closeModal()
        this.toastService.show(getServiceMessage(
          this.textTranslator, this.serviceMessage, response.returnCode
        ))
      },
      onSuccess: (response) => {
        this.serviceResponse.emit(this.getObserverInputData(response))
        this.modalComponent.closeModal()
      }
    })

  constructor(
    readonly textTranslator: TranslationService,
    protected readonly server: BackendService,
    protected readonly modalService: MzModalService,
    protected readonly toastService: RoundedToastService
  ) {
    super()
  }

  // override OnInit
  ngOnInit(): void {
    this.textTranslator.translationChanged().subscribe(
      this.onTranslationChanged
    )
  }

  isFormValid(): boolean {
    return (this.formComponent.form) ? this.formComponent.form.valid : false
  }

  onFormSubmit(serviceInput: FormData): void {
    this.progressModal =
      this.modalService.open(ProgressModalComponent).instance.modalComponent
    this.requestService(serviceInput)
  }

  protected abstract get serviceName(): string
  protected abstract get serviceMessage(): string
  protected abstract getObserverInputData(data: any): any

  protected get onTranslationChanged(): () => void {
    return () => {
      // no hacer nada es el comportamiento por defecto
    }
  }

  protected requestService(serviceInput: FormData): void {
    this.server.create(this.serviceName, serviceInput, this.onServiceResponse)
  }
}
