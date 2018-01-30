export abstract class FormErrorsTranslationService {
  constructor(
    private translations: any, private _translatedMessages: any
  ) {
  }

  get messages(): any {
    return this._translatedMessages
  }

  translate(lang: string): void {
    this._translatedMessages = this.translations[lang]
  }
}