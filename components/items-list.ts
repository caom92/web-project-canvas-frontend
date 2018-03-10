import { Component, ComponentRef, OnChanges, OnInit } from '@angular/core'
import { MzModalService, MzBaseModal } from 'ng2-materialize'
import { BackendService } from './../services/backend'
import { LocaleService, TranslationService } from 'angular-l10n'
import { ProgressModalComponent } from './../components/modals/please-wait'
import { ObserverComponent } from './../components/observer'
import { 
  ActionConfirmationModalComponent 
} from './../components/modals/action-confirmation'
import { OnSuccessCallback, BackendResponse } from './../services/backend'
import { RoundedToastService } from './../services/toast'
import { getServiceMessage } from './../functions/utility'


export abstract class ItemsListAbstractComponent
  implements OnChanges, OnInit, ObserverComponent
{
  protected elementToDeleteIdx: number
  protected progressModal: ComponentRef<MzBaseModal>
  protected list: Array<any> = []
  
  constructor(
    public locale: LocaleService,
    public textTranslator: TranslationService,
    protected readonly server: BackendService,
    protected readonly modalManager: MzModalService,
    protected readonly toastManager: RoundedToastService
  ) {
  }

  protected abstract get emptyListMessage(): string
  protected abstract get addElementModalComponent(): any
  protected abstract get deleteConfirmationModalTitle(): string
  protected abstract get deleteConfirmationModalMessage(): string
  protected abstract get deleteElementServiceName(): string
  protected abstract get editElementModalComponent(): any
  protected abstract getAddElementModalInput(): any
  protected abstract onElementAddedNotificationReceived(context: any): void
  protected abstract getEditElementModalInput(idx: number, context: any): any
  protected abstract onElementEditedNotificationReceived(context: any): void

  // override OnInit
  ngOnInit(): void {
    this.textTranslator.translationChanged()
      .subscribe(this.onTranslationChanged)
  }

  // override OnChanges
  ngOnChanges(): void {
    // no hacer nada es el funcionamiento base
  }
  
  // override ObserverComponent
  onNotificationReceived(context: {
    addElementContext: any, deleteElementContext: any, editElementContext: any
  }): void {
    if (context.addElementContext !== undefined)
      this.onElementAddedNotificationReceived(context.addElementContext)

    if (context.deleteElementContext !== undefined)
      this.onElementDeletedNotificationReceived(context.deleteElementContext)

    if (context.editElementContext !== undefined) 
      this.onElementEditedNotificationReceived(context.editElementContext)
  }
  
  protected onAddButtonClicked(): void {
    this.modalManager.open(
      this.addElementModalComponent, this.getAddElementModalInput()
    )
  }

  protected onEditButtonClicked(idx: number, element: any): void {
    this.modalManager.open(
      this.editElementModalComponent, 
      this.getEditElementModalInput(idx, element)
    )
  }

  protected onDeleteButtonClicked(idx: number, element: any): void {
    this.modalManager.open(ActionConfirmationModalComponent, {
      observers: [ this ],
      title: this.deleteConfirmationModalTitle,
      message: this.deleteConfirmationModalMessage,
      context: { deleteElementContext: {
        tableId: element.id,
        idx: idx
      }}
    })
  }

  protected get onTranslationChanged(): () => void {
    return () => {}
  }

  private onElementDeletedNotificationReceived(context: { 
    idx: number, tableId: number 
  }): void {
    this.progressModal = this.modalManager.open(ProgressModalComponent)
    this.elementToDeleteIdx = context.idx
    this.server.delete(
      this.deleteElementServiceName, { id: context.tableId }, 
      this.onDeleteCategoryResponse
    )
  }

  private get onDeleteCategoryResponse(): OnSuccessCallback {
    return (response: BackendResponse) => {
      this.progressModal.instance.modalComponent.close()
      this.toastManager.show(getServiceMessage(
        this.textTranslator, this.deleteElementServiceName, response.returnCode
      ))

      if (response.returnCode == 0) {
        this.list.splice(this.elementToDeleteIdx, 1)
      }
    }
  }
}