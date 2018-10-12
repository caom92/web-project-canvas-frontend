import { FormBuilder, FormGroup } from '@angular/forms'
import { TranslationService } from 'angular-l10n'
import { FormTextsService } from '../../services/form-texts'
import { EventEmitter, OnInit } from '@angular/core'


export abstract class FormAbstractComponent implements OnInit {

  readonly formSubmission: EventEmitter<any> = new EventEmitter()

  protected $labels: any

  private formGroup: FormGroup

  constructor(
    protected readonly formBuilder: FormBuilder,
    protected readonly textTranslator: TranslationService,
    private readonly formTexts: FormTextsService,
    private readonly errorsKey: string
  ) {
  }

  get form(): FormGroup {
    return this.formGroup
  }

  get errors(): any {
    return this.formTexts.texts[this.errorsKey]
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group(
      this.controlsConfig(), this.groupConfig
    )
    this.textTranslator.translationChanged().subscribe(
      this.onTranslationChanged
    )
  }

  abstract get labels(): any
  abstract onSubmit(): void
  protected abstract get onTranslationChanged(): () => void
  protected abstract get controlsConfig(): any
  protected abstract getServiceInputFromForm(): FormData

  protected get groupConfig(): any {
    return {}
  }
}
