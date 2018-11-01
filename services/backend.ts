import { throwError as observableThrowError, Observable, of } from 'rxjs'
import { catchError as observableCatchError, map } from 'rxjs/operators'
import {
  Http, Response, Headers, RequestOptions
} from '@angular/http'


export interface BackendResponse {
  returnCode: number,
  message: string,
  data: any
}

export type OnRequestFailCallback = (error: any) => Observable<Array<any>>

export type OnRequestSuccessCallback = (response: BackendResponse) => void

interface ResponseCallbackSchema {
  beforeEval?: OnRequestSuccessCallback,
  onSuccess: OnRequestSuccessCallback,
  onError?: OnRequestSuccessCallback,
  afterEval?: OnRequestSuccessCallback
}


export function createResponseCallback(
  options: OnRequestSuccessCallback | ResponseCallbackSchema
): OnRequestSuccessCallback {
  if (options === undefined || options === null) {
    return null
  }

  const noop: OnRequestSuccessCallback = (response) => {}
  const schema = <ResponseCallbackSchema> options

  if (schema.onSuccess) {
    if (schema.beforeEval === undefined || schema.beforeEval === null) {
      schema.beforeEval = noop
    }

    if (schema.afterEval === undefined || schema.afterEval === null) {
      schema.afterEval = noop
    }

    if (schema.onError === undefined || schema.onError === null) {
      schema.onError = noop
    }

    return (response) => {
      schema.beforeEval(response)
      if (response.returnCode === 0) {
        schema.onSuccess(response)
      } else {
        schema.onError(response)
      }
      schema.afterEval(response)
    }
  } else {
    const action = <OnRequestSuccessCallback> options
    return (response) => {
      if (response.returnCode === 0) {
        action(response)
      }
    }
  }
}


export abstract class BackendService {

  private static readonly requestOptions: RequestOptions =
    new RequestOptions({
      headers: new Headers({ 'Accept': 'application/json' }),
      withCredentials: true
    })

  constructor(
    private readonly servicesBaseUrl: string,
    private readonly http: Http
  ) {
  }

  private static readonly defaultOnFailCallback: OnRequestFailCallback =
    (error) => {
      observableThrowError(error)
      return of([])
    }

  read(
    service: string,
    onRequestSuccess: OnRequestSuccessCallback,
    onRequestFail = BackendService.defaultOnFailCallback
  ): void {
    // debido a que el metodo GET debe ser enviado con un cuerpo vacio, habra
    // que pasar los parametros del servicio en el URL, sin embargo, debido a
    // que el backend esta implementado utilizando Slim PHP, este solo puede
    // configurar rutas con parametros, es decir, no puede enrutar peticiones
    // que contengan query strings en su URL, debido a esto, hay que desglozar
    // los parametros ingresados y adjuntarlos a la URL del servicio
    // dividiendolos con diagonales
    this.http
      .get(
        this.servicesBaseUrl + service,
        BackendService.requestOptions
      )
      .pipe(
        map((response: Response) => {
          return this.parseHttpResponseToJson(response)
        }),
        observableCatchError(onRequestFail)
      )
      .subscribe(onRequestSuccess)
  }

  create(
    service: string,
    input: FormData,
    onRequestSuccess: OnRequestSuccessCallback,
    onRequestFail = BackendService.defaultOnFailCallback
  ): void {
    this.http
      .post(
        this.servicesBaseUrl + service,
        input,
        BackendService.requestOptions
      )
      .pipe(
        map((response: Response) => {
          return this.parseHttpResponseToJson(response)
        }),
        observableCatchError(onRequestFail)
      )
      .subscribe(onRequestSuccess)
  }

  update(
    service: string,
    input: FormData,
    onRequestSuccess: OnRequestSuccessCallback,
    onRequestFail = BackendService.defaultOnFailCallback
  ): void {
    this.http
      .patch(
        this.servicesBaseUrl + service,
        input,
        BackendService.requestOptions
      )
      .pipe(
        map((response: Response) => {
          return this.parseHttpResponseToJson(response)
        }),
        observableCatchError(onRequestFail)
      )
      .subscribe(onRequestSuccess)
  }

  delete(
    service: string,
    onRequestSuccess: OnRequestSuccessCallback,
    onRequestFail = BackendService.defaultOnFailCallback
  ): void {
    this.http
      .delete(
        this.servicesBaseUrl + service,
        BackendService.requestOptions
      )
      .pipe(
        map((response: Response) => {
          return this.parseHttpResponseToJson(response)
        }),
        observableCatchError(onRequestFail)
      )
      .subscribe(onRequestSuccess)
  }

  private parseHttpResponseToJson(response: Response): BackendResponse {
    const body = '_body'
    const responseBody = response[body].toString()
    let responseJson = JSON.parse(responseBody)

    // revisamos si el backend esta respondiendo con una versión vieja del
    // JSON de respuesta y si es así, lo convertimos a la versión nueva
    if (responseJson.meta !== undefined) {
      responseJson = {
        returnCode: responseJson.meta.return_code,
        message: responseJson.meta.message,
        data: responseJson.data
      }
    }

    return responseJson
  }
}
