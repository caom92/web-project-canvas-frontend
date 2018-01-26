import { 
  ViewChild, 
  ComponentFactoryResolver, 
  Type, 
  ComponentRef 
} from '@angular/core'
import { 
  DynamicComponentContainerDirective 
} from '../directives/dynamic-container'


export class DynamicComponentInjector {
  @ViewChild(DynamicComponentContainerDirective) 
  private targetContainer: DynamicComponentContainerDirective

  constructor(private factoryResolver: ComponentFactoryResolver) {
  }

  injectComponent(componentClass: Type<any>, instanceData: any = {}): any {
    let componentFactory = 
      this.factoryResolver.resolveComponentFactory(componentClass)
    let targetView = this.targetContainer.getView()
    targetView.clear()
    let componentInstanceRef = targetView.createComponent(componentFactory)
    
    for (let i in instanceData) {
      componentInstanceRef.instance[i] = instanceData[i]
    }

    return componentInstanceRef.instance
  }
}