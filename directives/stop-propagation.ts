import { Directive, HostListener } from '@angular/core'


@Directive({
  selector: '[clickStopPropagation]'
})
export class OnClickStopPropagationDirective {
  
  @HostListener('click', ['$event'])
  onClick(event: any): void {
    event.stopPropagation()
  }
}
