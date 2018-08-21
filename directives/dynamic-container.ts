import { Directive, ViewContainerRef } from '@angular/core'


@Directive({
  selector: '[dynamicComponentContainer]',
})
export class DynamicComponentContainerDirective {
  
  constructor(private readonly view: ViewContainerRef) {
  }

  getView(): ViewContainerRef {
    return this.view
  }
}
