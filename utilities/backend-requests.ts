import { RoundedToastService } from '../services/toast'
import { TranslationService } from 'angular-l10n'
import {
  OnRequestSuccessCallback, OnRequestFailureCallback
} from '../services/backend'
import { languageConfig } from './l10n-config'
import { throwError, of } from 'rxjs'
import { MzModalComponent } from 'ngx-materialize'




export function getServiceMessage(
  textTranslator: TranslationService, translationKey: string, code: number
): string {
  let message =
    textTranslator.translate(`${ translationKey } response ${ code }`)
  if (message === languageConfig.translation.missingValue) {
    message = textTranslator.translate(`server response ${ code }`)
    if (message === languageConfig.translation.missingValue) {
      message = textTranslator.translate(`unknown server error`)
    }
  }
  return message
}


export function getOnResponseShowToast(
  translationKey: string,
  toastService: RoundedToastService,
  textTranslator: TranslationService
): OnRequestSuccessCallback {
  return (response) => {
    toastService.show(getServiceMessage(
      textTranslator, translationKey, response.returnCode
    ))
  }
}



export function getOnRequestFailureCloseModal(
  modal: MzModalComponent,
  toastService: RoundedToastService,
  textTranslator: TranslationService
): OnRequestFailureCallback {
  return (error) => {
    throwError(error)
    modal.closeModal()
    toastService.show(textTranslator.translate('network error'))
    return of([])
  }
}



export function getOnRequestFailureShowToast(
  toastService: RoundedToastService,
  textTranslator: TranslationService
): OnRequestFailureCallback {
  return (error) => {
    throwError(error)
    toastService.show(textTranslator.translate('network error'))
    return of([])
  }
}



export interface RequestResponseCallbackDescriptor {
  beforeEval?: OnRequestSuccessCallback,
  onSuccess: OnRequestSuccessCallback,
  onError?: OnRequestSuccessCallback,
  afterEval?: OnRequestSuccessCallback
}


export function createRequestResponseCallback(
  descriptor: OnRequestSuccessCallback | RequestResponseCallbackDescriptor
): OnRequestSuccessCallback {
  if (descriptor === undefined || descriptor === null) {
    return null
  }

  const noop: OnRequestSuccessCallback = (_) => {}
  const options = <RequestResponseCallbackDescriptor> descriptor

  if (options.onSuccess) {
    if (options.beforeEval === undefined || options.beforeEval === null) {
      options.beforeEval = noop
    }

    if (options.afterEval === undefined || options.afterEval === null) {
      options.afterEval = noop
    }

    if (options.onError === undefined || options.onError === null) {
      options.onError = noop
    }

    return (response) => {
      options.beforeEval(response)
      if (response.returnCode === 0) {
        options.onSuccess(response)
      } else {
        options.onError(response)
      }
      options.afterEval(response)
    }
  } else {
    const action = <OnRequestSuccessCallback> descriptor
    return (response) => {
      if (response.returnCode === 0) {
        action(response)
      }
    }
  }
}
