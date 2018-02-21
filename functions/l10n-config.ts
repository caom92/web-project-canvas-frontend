import { L10nConfig, StorageStrategy, ProviderType, Language } from 'angular-l10n'

export const languageConfig: L10nConfig = {
  locale: {
    languages: [
      { code: 'es', dir: 'ltr' },
      { code: 'en', dir: 'ltr' }
    ],
    language: 'es',
    storage: StorageStrategy.Cookie
  },
  translation: {
    providers: [
      { type: ProviderType.Static, prefix: './assets/locale-' }
    ],
    caching: true,
    missingValue: 'Missing translation error'
  }
}