import { MzBaseModal } from 'ng2-materialize'
import { ObserverComponent } from './../observer'


export abstract class SubjectModal extends MzBaseModal {
  
  observers: Array<ObserverComponent> = []

  constructor() {
    super()
  }

  protected notifyObservers(context: any): void {
    for (const observer of this.observers) {
      observer.onNotificationReceived(context)
    }
  }
}