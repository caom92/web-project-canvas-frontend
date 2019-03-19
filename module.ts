import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { OnClickStopPropagationDirective } from './directives/stop-propagation'
import {
  DynamicComponentContainerDirective
} from './directives/dynamic-container'
import { AuthenticationGuard } from './services/authentication-guard'
import { RoundedToastService } from './services/toast'
import { ProgressModalComponent } from './components/modals/please-wait'
import {
  ActionConfirmationModalComponent
} from './components/modals/action-confirmation'
import { MaterializeModule } from 'ngx-materialize'
import { TranslationModule, L10nLoader } from 'angular-l10n'
import { languageConfig } from './utilities/l10n-config'


@NgModule({
  imports: [
    CommonModule,
    MaterializeModule,
    TranslationModule.forChild(languageConfig)
  ],
  providers: [
    RoundedToastService,
    AuthenticationGuard
  ],
  declarations: [
    OnClickStopPropagationDirective,
    DynamicComponentContainerDirective,
    ProgressModalComponent,
    ActionConfirmationModalComponent
  ],
  exports: [
    OnClickStopPropagationDirective,
    DynamicComponentContainerDirective,
    ProgressModalComponent,
    ActionConfirmationModalComponent
  ],
  entryComponents: [
    ProgressModalComponent,
    ActionConfirmationModalComponent
  ]
})
export class CanvasModule {

  constructor(private readonly translationLoader: L10nLoader) {
    this.translationLoader.load()
  }
}
