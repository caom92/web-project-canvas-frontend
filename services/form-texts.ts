export interface RequiredOnly {
  readonly required: string
}

export interface RequiredWithMinLength extends RequiredOnly {
  readonly minlength: string
}

export interface RequiredWithMaxLength extends RequiredOnly {
  readonly maxlength: string
}


export abstract class FormTextsService {

  protected _translatedTexts: any

  constructor(
    private readonly translations: {
      readonly es: any,
      readonly en: any
    },
    translatedTexts: any
  ) {
    this._translatedTexts = translatedTexts
  }

  abstract getTexts(): any

  translate(lang: string): void {
    this._translatedTexts = this.translations[lang]
  }
}
