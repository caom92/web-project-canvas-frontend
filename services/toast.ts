import { Injectable } from '@angular/core'
import { MzToastService } from 'ng2-materialize'


@Injectable()
export class RoundedToastService {
  constructor(private toastService: MzToastService) {
  }

  show(message: string, onDismissCallback: () => void = () => {}): void {
    this.toastService.show(message, 3500, 'rounded', onDismissCallback)
  }
}