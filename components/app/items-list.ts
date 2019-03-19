import { throwError as observableThrowError, of } from 'rxjs'
import { OnInit } from '@angular/core'
import { MzModalService, MzModalComponent } from 'ngx-materialize'
import {
  BackendService,
  OnRequestFailureCallback,
  OnRequestSuccessCallback
} from './../../services/backend'
import { TranslationService } from 'angular-l10n'
import { ProgressModalComponent } from './../../components/modals/please-wait'
import {
  ActionConfirmationModalComponent
} from './../../components/modals/action-confirmation'
import { RoundedToastService } from './../../services/toast'
import { getServiceMessage } from './../../utilities/backend-requests'
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



export interface ReadonlyTableHeader {
  readonly isAscending: boolean
  readonly text: {
    readonly es: string,
    readonly en: string
  }
  readonly ascendingSort: (a: any, b: any) => number,
  readonly descendingSort: (a: any, b: any) => number
}



export abstract class ItemsListAbstractComponent implements OnInit {

  protected elementToDeleteIdx: number
  protected progressModal: MzModalComponent
  protected _list: Array<any> = []

  private _sortingHeader: TableHeader = {
    isAscending: null,
    text: { es: null, en: null },
    ascendingSort: (a, b) => 0,
    descendingSort: (a, b) => 0
  }

  constructor(
    readonly textTranslator: TranslationService,
    protected readonly server: BackendService,
    protected readonly modalService: MzModalService,
    protected readonly toastService: RoundedToastService
  ) {
  }

  get sortingHeader(): ReadonlyTableHeader {
    return this._sortingHeader
  }

  // override OnInit
  ngOnInit(): void {
    this.textTranslator.translationChanged().subscribe(
      this.onTranslationChanged
    )
  }

  sortList(header: TableHeader): void {
    this._list.sort(
      (header.isAscending) ? header.descendingSort : header.ascendingSort
    )
    header.isAscending = !header.isAscending
    this._sortingHeader = header
  }

  onAddButtonClicked(): void {
    const modalRef = this.modalService.open(
      this.addElementModalComponent, this.addElementModalInput
    )
    const modal = <AddItemAbstractModalComponent> modalRef.instance
    modal.serviceResponse.subscribe(this.onElementAddedNotificationReceived)
  }

  onDeleteButtonClicked(idx: number, element: any): void {
    const modalRef = this.modalService.open(
      ActionConfirmationModalComponent,
      {
        title: this.deleteConfirmationModalTitle,
        message: this.deleteConfirmationModalMessage,
        context: {
          id: element.id,
          idx: idx
        }
      }
    )
    const modal = <ActionConfirmationModalComponent> modalRef.instance
    modal.actionConfirmation.subscribe(
      this.onElementDeletionConfirmationReceived
    )
  }

  onEditButtonClicked(idx: number, element: any): void {
    const modalRef = this.modalService.open(
      this.editElementModalComponent,
      this.getEditElementModalInput(idx, element)
    )
    const modal = <AddItemAbstractModalComponent> modalRef.instance
    modal.serviceResponse.subscribe(this.onElementEditedNotificationReceived)
  }

  abstract get list(): ReadonlyArray<any>
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
  protected abstract get onElementEditedNotificationReceived():
    (context: any) => void
  protected abstract getEditElementModalInput(idx: number, context: any): any

  protected get onTranslationChanged(): () => void {
    return () => {
      // no hacer nada es el funcionamiento base
    }
  }

  protected get onElementDeletionConfirmationReceived(): (context: {
    idx: number, id: number
  }) => void {
    return (context) => {
      this.progressModal =
        this.modalService.open(ProgressModalComponent).instance.modalComponent
      this.elementToDeleteIdx = context.idx
      this.server.delete(
        `${ this.deleteElementServiceName }/${ context.id }`,
        this.onDeleteElementResponse
      )
    }
  }

  protected onSuccessfulElementDeletion(): void {
    // no hacer nada es el funcionamiento por defecto
  }

  protected onDeleteElementResponse: OnRequestSuccessCallback =
    (response) => {
      this.progressModal.closeModal()
      this.toastService.show(getServiceMessage(
        this.textTranslator, this.deleteServiceMessage, response.returnCode
      ))
      if (response.returnCode === 0) {
        this._list.splice(this.elementToDeleteIdx, 1)
        this.onSuccessfulElementDeletion()
      }
    }

  protected onNetworkErrorCloseModal: OnRequestFailureCallback =
    (error) => {
      observableThrowError(error)
      this.progressModal.closeModal()
      this.toastService.show(this.textTranslator.translate('network error'))
      return of([])
    }

  protected onNetworkErrorShowToast: OnRequestFailureCallback =
    (error) => {
      observableThrowError(error)
      this.toastService.show(this.textTranslator.translate('network error'))
      return of([])
    }
}
