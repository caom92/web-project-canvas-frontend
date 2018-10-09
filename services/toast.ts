import { Injectable } from '@angular/core'
import { MzToastService } from 'ngx-materialize'


@Injectable()
export class RoundedToastService {
  
  constructor(private readonly toastService: MzToastService) {
  }

  show(message: string, onDismissCallback: () => void = () => {}): void {
    this.toastService.show(message, 3500, 'rounded', onDismissCallback)
  }
}
