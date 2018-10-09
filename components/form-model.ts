import { FormBuilder, FormGroup } from '@angular/forms'
import { TranslationService } from 'angular-l10n'
import {
  FormErrorsTranslationService
} from '../services/form-error-translation'


export abstract class FormModel {

  protected _labels: any
  private formGroup: FormGroup

  constructor(
    formBuilder: FormBuilder,
    protected readonly textTranslator: TranslationService,
    private readonly formErrors: FormErrorsTranslationService,
    private readonly errorsKey: string
  ) {
    this.formGroup =
      formBuilder.group(this.getControlsConfig(), this.extraConfig)
    this.textTranslator.translationChanged().subscribe(
      this.getOnTranslationChangedCallback
    )
  }

  get form(): FormGroup {
    return this.formGroup
  }

  get errors(): any {
    return this.formErrors.messages[this.errorsKey]
  }

  abstract get labels(): any
  abstract onSubmit(): void

  protected abstract getControlsConfig(): any
  protected abstract getOnTranslationChangedCallback(): () => void
  protected abstract getServiceInputFromForm(): FormData

  protected get extraConfig(): any {
    return {}
  }
}
