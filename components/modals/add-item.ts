import { OnInit, EventEmitter, ViewChild } from '@angular/core'
import { MzBaseModal, MzModalService, MzModalComponent } from 'ngx-materialize'
import { TranslationService } from 'angular-l10n'
import {
  BackendService, OnRequestSuccessCallback
} from './../../services/backend'
import { ProgressModalComponent } from './please-wait'
import { RoundedToastService } from './../../services/toast'
import { getServiceMessage, createRequestResponseCallback } from './../../utilities/backend-requests'
import { FormAbstractComponent } from '../app/form'




export abstract class AddItemAbstractModalComponent
  extends MzBaseModal implements OnInit {

  @ViewChild('formComponent')
  formComponent: FormAbstractComponent

  readonly serviceResponse: EventEmitter<any> = new EventEmitter()

  protected progressModal: MzModalComponent
  protected onServiceResponse: OnRequestSuccessCallback =
    createRequestResponseCallback({
      beforeEval: (response) => {
        this.progressModal.closeModal()
        this.toastService.show(getServiceMessage(
          this.textTranslator, this.getServiceMessage(), response.returnCode
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
    const form = this.formComponent.getForm()
    return (form) ? form.valid : false
  }

  onFormSubmit(serviceInput: FormData): void {
    this.progressModal =
      this.modalService.open(ProgressModalComponent).instance.modalComponent
    this.requestService(serviceInput)
  }

  protected abstract getServiceName(): string
  protected abstract getServiceMessage(): string
  protected abstract getObserverInputData(data: any): any

  protected get onTranslationChanged(): () => void {
    return () => {
      // no hacer nada es el comportamiento por defecto
    }
  }

  protected requestService(serviceInput: FormData): void {
    this.server.create(
      this.getServiceName(), serviceInput, this.onServiceResponse
    )
  }
}
