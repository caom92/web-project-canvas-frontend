import { throwError as observableThrowError, of, Observable } from 'rxjs'
import { OnChanges, OnInit } from '@angular/core'
import { MzModalService, MzModalComponent } from 'ngx-materialize'
import { 
  BackendService, 
  OnRequestFailCallback,
  OnRequestSuccessCallback
} from './../../services/backend'
import { LocaleService, TranslationService } from 'angular-l10n'
import { ProgressModalComponent } from './../../components/modals/please-wait'
import { 
  ActionConfirmationModalComponent 
} from './../../components/modals/action-confirmation'
import { RoundedToastService } from './../../services/toast'
import { getServiceMessage } from './../../functions/utility'
import { AddItemAbstractModalComponent } from './../modals/add-item'


export interface TableHeader {
  isAscending: boolean
  text: { 
    es: string, 
    en: string 
  }
  ascendingSort: (a: any, b: any) => number,
  descendingSort: (a: any, b: any) => number
}


export abstract class ItemsListAbstractComponent implements OnChanges, OnInit {
    
  protected elementToDeleteIdx: number
  protected progressModal: MzModalComponent
  protected list: Array<any> = []

  private sortingHeader: TableHeader = {
    isAscending: null,
    text: { es: null, en: null },
    ascendingSort: (a, b) => 0,
    descendingSort: (a, b) => 0
  }
  
  constructor(
    public locale: LocaleService,
    public textTranslator: TranslationService,
    protected readonly server: BackendService,
    protected readonly modalService: MzModalService,
    protected readonly toastService: RoundedToastService
  ) {
  }

  // override OnInit
  ngOnInit(): void {
    this.textTranslator.translationChanged()
      .subscribe(this.onTranslationChanged)
  }

  // override OnChanges
  ngOnChanges(): void {
    // no hacer nada es el funcionamiento base
  }

  protected abstract get emptyListMessage(): string
  protected abstract get addElementModalComponent(): any
  protected abstract get deleteConfirmationModalTitle(): string
  protected abstract get deleteConfirmationModalMessage(): string
  protected abstract get deleteElementServiceName(): string
  protected abstract get deleteServiceMessage(): string
  protected abstract get editElementModalComponent(): any
  protected abstract get addElementModalInput(): any
  protected abstract get onElementAddedNotificationReceived(): 
    (context: any) => void
  protected abstract getEditElementModalInput(idx: number, context: any): any
  protected abstract get onElementEditedNotificationReceived(): 
    (context: any) => void

  protected get onTranslationChanged(): () => void {
    return () => {
      // no hacer nada es el funcionamiento base
    }
  }

  protected onSuccessfulElementDeletion(): void {
    // hacer nada es el funcionamiento por defecto
  }
  
  protected onAddButtonClicked(): void {
    const modalRef = this.modalService.open(
      this.addElementModalComponent, this.addElementModalInput
    )

    const modal: AddItemAbstractModalComponent =
      <AddItemAbstractModalComponent> modalRef.instance
    modal.serviceResponse.subscribe(this.onElementAddedNotificationReceived)
  }

  protected onEditButtonClicked(idx: number, element: any): void {
    const modalRef = this.modalService.open(
      this.editElementModalComponent, 
      this.getEditElementModalInput(idx, element)
    )

    const modal: AddItemAbstractModalComponent =
      <AddItemAbstractModalComponent> modalRef.instance
    modal.serviceResponse.subscribe(this.onElementEditedNotificationReceived)
  }

  protected onDeleteButtonClicked(idx: number, element: any): void {
    const modalRef = this.modalService.open(ActionConfirmationModalComponent, {
      title: this.deleteConfirmationModalTitle,
      message: this.deleteConfirmationModalMessage,
      context: { 
        tableId: element.id,
        idx: idx
      }
    })

    const modal: ActionConfirmationModalComponent =
      <ActionConfirmationModalComponent> modalRef.instance
    modal.actionConfirmation.subscribe(
      this.onElementDeletedNotificationReceived
    )
  }

  protected get onElementDeletedNotificationReceived(): (context: { 
    idx: number, tableId: number 
  }) => void {
    return (context) => {
      this.progressModal = 
        this.modalService.open(ProgressModalComponent).instance.modalComponent
      this.elementToDeleteIdx = context.idx
      this.server.delete(
        `${ this.deleteElementServiceName }/${ context.tableId }`, 
        this.onDeleteElementResponse
      )
    }
  }

  protected onDeleteElementResponse: OnRequestSuccessCallback = 
    (response) => {
      this.progressModal.closeModal()
      this.toastService.show(getServiceMessage(
        this.textTranslator, this.deleteServiceMessage, response.returnCode
      ))

      if (response.returnCode === 0) {
        this.list.splice(this.elementToDeleteIdx, 1)
        this.onSuccessfulElementDeletion()
      }
    }

  protected onNetworkErrorCloseModal: OnRequestFailCallback =
    (error) => {
      observableThrowError(error)
      this.progressModal.closeModal()
      this.toastService.show(this.textTranslator.translate('network error'))
      return of([])
    }
  
  protected onNetworkErrorSendToast: OnRequestFailCallback =
    (error) => {
      observableThrowError(error)
      this.toastService.show(this.textTranslator.translate('network error'))
      return of([])
    }

  private sortList(header: TableHeader): void {
    this.list.sort(
      (header.isAscending) ? header.descendingSort : header.ascendingSort
    )
    header.isAscending = !header.isAscending
    this.sortingHeader = header
  }
}
