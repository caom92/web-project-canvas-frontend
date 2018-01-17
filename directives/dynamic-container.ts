import { Directive, ViewContainerRef } from '@angular/core';


@Directive({
  selector: '[dynamic-component-container]',
})
export class DynamicComponentContainerDirective {
  constructor(private view: ViewContainerRef) {
  }

  getView(): ViewContainerRef {
    return this.view
  }
}