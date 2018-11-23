import { FormBuilder, FormGroup } from '@angular/forms'
import { TranslationService } from 'angular-l10n'
import { FormTextsService } from '../../services/form-texts'
import { EventEmitter, OnInit, Output } from '@angular/core'


export abstract class FormAbstractComponent implements OnInit {

  @Output()
  readonly submission: EventEmitter<any> = new EventEmitter

  protected _labels: any

  private formGroup: FormGroup = null

  constructor(
    protected readonly formBuilder: FormBuilder,
    protected readonly textTranslator: TranslationService,
    protected readonly formTexts: FormTextsService,
    protected readonly errorsKey: string
  ) {
  }

  get form(): FormGroup {
    return this.formGroup
  }

  ngOnInit(): void {
    this.textTranslator.translationChanged().subscribe(
      this.onTranslationChanged
    )
    this.formGroup = this.formBuilder.group(
      this.getControlsConfig(), this.groupConfig
    )
  }

  onSubmit(): void {
    this.submission.emit(this.getServiceInputFromForm())
  }

  abstract get labels(): any
  abstract get errors(): any
  protected abstract get onTranslationChanged(): () => void
  protected abstract getControlsConfig(): any
  protected abstract getServiceInputFromForm(): any

  protected get groupConfig(): any {
    return {}
  }
}
