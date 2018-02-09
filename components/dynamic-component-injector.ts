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
  private readonly targetContainer: DynamicComponentContainerDirective

  constructor(private readonly factoryResolver: ComponentFactoryResolver) {
  }

  injectComponent(componentClass: Type<any>, instanceData: any = {}): any {
    const componentFactory = 
      this.factoryResolver.resolveComponentFactory(componentClass)
    const targetView = this.targetContainer.getView()
    targetView.clear()
    const componentInstanceRef = targetView.createComponent(componentFactory)
    
    for (let i in instanceData) {
      componentInstanceRef.instance[i] = instanceData[i]
    }

    return componentInstanceRef.instance
  }
}