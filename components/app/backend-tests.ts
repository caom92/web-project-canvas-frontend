import { OnInit, ComponentRef, EventEmitter } from '@angular/core'
import { BackendService, OnSuccessCallback } from './../../services/backend'
import { MzModalService, MzBaseModal } from 'ng2-materialize'
import { 
  ProgressModalComponent 
} from '../../../web-project-canvas-frontend/components/modals/please-wait'
import { 
  BackendResponse 
} from '../../../web-project-canvas-frontend/services/backend'
import { parseJsonToFormData } from '../../functions/utility'


export abstract class UnitTest {

  static server: BackendService
  static testFinished: EventEmitter<void> = new EventEmitter()

  passed: boolean = null

  constructor(
    readonly serviceName: string,
    readonly description: string,
    protected readonly serviceInput: any,
    protected readonly callback: (response: BackendResponse) => boolean
  ) {
  }

  abstract execute(): void

  protected get onServiceResponse(): OnSuccessCallback {
    return (response: BackendResponse) => {
      this.passed = this.callback(response)

      if (!this.passed) {
        console.error({
          testDescription: this.description,
          service: {
            name: this.serviceName,
            input: this.serviceInput
          },
          response: response
        })
      }

      UnitTest.testFinished.emit()
    }
  }
}


export class HttpGetUnitTest extends UnitTest {

  constructor(
    serviceName: string,
    description: string,
    serviceInput: any,
    callback: (response: BackendResponse) => boolean
  ) {
    super(serviceName, description, serviceInput, callback)
  }

  // override UnitTest
  execute(): void {
    UnitTest.server.read(
      this.serviceName, this.serviceInput, this.onServiceResponse
    )
  }
}


export class HttpPostUnitTest extends UnitTest {

  constructor(
    serviceName: string,
    description: string,
    serviceInput: any,
    callback: (response: BackendResponse) => boolean
  ) {
    super(serviceName, description, serviceInput, callback)
  }

  // override UnitTest
  execute(): void {
    UnitTest.server.write(
      this.serviceName, parseJsonToFormData(this.serviceInput), 
      this.onServiceResponse
    )
  }
}


export class HttpDeleteUnitTest extends UnitTest {
  
  constructor(
    serviceName: string,
    description: string,
    serviceInput: any,
    callback: (response: BackendResponse) => boolean
  ) {
    super(serviceName, description, serviceInput, callback)
  }

  // override UnitTest
  execute(): void {
    UnitTest.server.delete(
      this.serviceName, this.serviceInput, this.onServiceResponse
    )
  }
}


interface TestSuite {
  name: string
  credentials: FormData
  unitTests: Array<UnitTest>
}

export abstract class BackendUnitTestsComponent implements OnInit {

  protected selectPlaceholder = 'Elija una opción'
  protected readonly tableHeaders: Array<string> = [
    'Descripción de la prueba',
    '¿Pasó?'
  ]
  protected selectedSuite: TestSuite = {
    name: null,
    credentials: null,
    unitTests: []
  }

  private numPendingTests = 0
  private progressModal: ComponentRef<MzBaseModal>

  constructor(
    protected readonly server: BackendService,
    protected readonly modalManager: MzModalService,
    private readonly logInServiceName: string,
    private readonly logOutServiceName: string,
    protected readonly testSuites: Array<TestSuite>
  ) {
  }

  // override OnInit
  ngOnInit(): void {
    UnitTest.server = this.server
    UnitTest.testFinished.subscribe(this.onTestFinished)
  }

  private onLaunchButtonClicked(): void {
    this.numPendingTests = this.selectedSuite.unitTests.length

    if (this.selectedSuite.unitTests.length > 0) {
      this.progressModal = this.modalManager.open(ProgressModalComponent)
      if (
        this.selectedSuite.credentials !== undefined 
        && this.selectedSuite.credentials !== null
      ) {
        this.server.write(
          this.logInServiceName, this.selectedSuite.credentials,
          this.onLogInResponse
        )
      } else {
        this.executeTestsOfSelectedSuite()
      }
    }
  }

  private onLogOutButtonClicked(): void {
    this.server.read('logout', {}, this.onLogOutResponse)
  }

  private get onTestFinished(): () => void {
    return () => {
      this.numPendingTests--
      if (this.numPendingTests === 0) {
        this.progressModal.instance.modalComponent.close()

        if (
          this.selectedSuite.credentials !== undefined 
          && this.selectedSuite.credentials !== null
        ) {
          this.server.read(this.logOutServiceName, {}, this.onLogOutResponse)
        }
      }
    }
  }

  private readonly onLogInResponse: OnSuccessCallback =
    (response: BackendResponse) => {
      if (response.returnCode === 0) {
        this.executeTestsOfSelectedSuite()
      } else {
        this.progressModal.instance.modalComponent.close()
        console.error(response.message)
      }
    }

  private readonly onLogOutResponse: OnSuccessCallback =
    (response: BackendResponse) => {
      if (response.returnCode !== 0) {
        console.error(response.message)
      }
    }

  private executeTestsOfSelectedSuite(): void {
    for (const test of this.selectedSuite.unitTests) {
      test.execute()
    }
  }
}
