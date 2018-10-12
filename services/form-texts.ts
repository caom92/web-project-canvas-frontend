export abstract class FormTextsService {

  protected $translatedTexts: any

  constructor(
    private readonly translations: {
      readonly es: any,
      readonly en: any
    },
    translatedTexts: any
  ) {
    this.$translatedTexts = translatedTexts
  }

  abstract get texts(): any

  translate(lang: string): void {
    this.$translatedTexts = this.translations[lang]
  }
}
