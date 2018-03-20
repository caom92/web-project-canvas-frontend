import { OnInit, ComponentRef } from '@angular/core'
import { BackendService } from './../services/backend'
import { MzModalService, MzBaseModal } from 'ng2-materialize'
import { 
  ProgressModalComponent 
} from '../../web-project-canvas-frontend/components/modals/please-wait'
import { 
  BackendResponse 
} from '../../web-project-canvas-frontend/services/backend'


export abstract class UnitTest {

  static numPendingTests: number
  static server: BackendService
  static progressModal: ComponentRef<MzBaseModal>

  protected _passed: boolean = null

  constructor(
    readonly description: string,
    protected readonly serviceName: string,
    protected readonly serviceInput: any,
    protected readonly callback: (response: BackendResponse) => boolean
  ) {
  }

  abstract execute(): void

  get passed(): boolean {
    return this._passed
  }

  protected finish(): void {
    UnitTest.numPendingTests--
    if (UnitTest.numPendingTests === 0) {
      UnitTest.progressModal.instance.modalComponent.close()
    }
  }
}


export class HttpGetUnitTest extends UnitTest {

  constructor(
    description: string,
    serviceName: string,
    serviceInput: any,
    callback: (response: BackendResponse) => boolean
  ) {
    super(description, serviceName, serviceInput, callback)
  }

  execute(): void {
    UnitTest.server.read(
      this.serviceName, this.serviceInput, 
      (response: BackendResponse) => {
        this._passed = this.callback(response)
        this.finish()
      }
    )
  }
}


export class HttpPostUnitTest extends UnitTest {

  constructor(
    description: string,
    serviceName: string,
    serviceInput: FormData,
    callback: (response: BackendResponse) => boolean
  ) {
    super(description, serviceName, serviceInput, callback)
  }

  execute(): void {
    UnitTest.server.write(
      this.serviceName, this.serviceInput, 
      (response: BackendResponse) => {
        this._passed = this.callback(response)
        this.finish()
      }
    )
  }
}


export class HttpDeleteUnitTest extends UnitTest {
  
  constructor(
    description: string,
    serviceName: string,
    serviceInput: any,
    callback: (response: BackendResponse) => boolean
  ) {
    super(description, serviceName, serviceInput, callback)
  }

  execute(): void {
    UnitTest.server.delete(
      this.serviceName, this.serviceInput, 
      (response: BackendResponse) => {
        this._passed = this.callback(response)
        this.finish()
      }
    )
  }
}


export abstract class BackendUnitTestsComponent implements OnInit {
   
  protected abstract get unitTests(): Array<UnitTest>

  protected readonly tableHeaders: Array<string> = [
    'Descripción de la prueba',
    '¿Pasó?'
  ]

  constructor(
    protected readonly server: BackendService,
    protected readonly modalManager: MzModalService
  ) {
  }

  // override OnInit
  ngOnInit(): void {
    UnitTest.server = this.server
    UnitTest.numPendingTests = this.unitTests.length

    if (this.unitTests.length > 0) {
      UnitTest.progressModal = this.modalManager.open(ProgressModalComponent)
      for (const test of this.unitTests) {
        test.execute()
      }
    }
  }
}