import { L10nConfig, StorageStrategy, ProviderType } from 'angular-l10n'

export const languageConfig: L10nConfig = {
  locale: {
    languages: [
      { code: 'es', dir: 'ltr' },
      { code: 'en', dir: 'ltr' }
    ],
    language: 'en',
    storage: StorageStrategy.Cookie
  },
  translation: {
    providers: [
      { type: ProviderType.Static, prefix: './assets/locale-' }
    ],
    caching: true,
    missingValue: 'Translation Error'
  }
}