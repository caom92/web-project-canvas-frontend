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
type OnRequestSuccessCallback = (response: BackendResponse) => void
export type OnResponseSuccessCallback = (data: any) => void
export type OnResponseErrorCallback = (code: number, message: string) => void
type OnResponseCallback = OnRequestSuccessCallback


class CallbacksContainer {
  private _response: OnRequestSuccessCallback

  constructor(
    onResponseSuccess: OnResponseSuccessCallback,
    onResponseError: OnResponseErrorCallback,
    afterResponseEval: OnResponseCallback,
    readonly fail: OnRequestFailCallback
  ) {
    this._response = (response) => {
      if (response.returnCode === 0) {
        onResponseSuccess(response.data)
      } else {
        onResponseError(response.returnCode, response.message)
      }
      afterResponseEval(response)
    }
  }

  get response(): OnResponseSuccessCallback {
    return this._response
  }
}

export class BackendRequest {
  private _on: CallbacksContainer

  constructor(
    readonly service: string,
    onResponseSuccess: OnResponseSuccessCallback,
    onResponseError: OnResponseErrorCallback,
    afterResponseEval: OnResponseCallback = 
      BackendRequest.defaultAfterEvalCallback,
    onRequestFail: OnRequestFailCallback = 
      BackendRequest.defaultOnFailCallback
  ) {
    this._on = new CallbacksContainer(
      onResponseSuccess,
      onResponseError,
      afterResponseEval,
      onRequestFail
    )
  }

  get on(): CallbacksContainer {
    return this._on
  }

  private static readonly defaultAfterEvalCallback: OnResponseCallback =
    (response) => {
      // No hacer nada es la acción que se realiza por defecto
    }

  private static readonly defaultOnFailCallback: OnRequestFailCallback = 
    (error) => {
      observableThrowError(error)
      return of([])
    }
}


export abstract class BackendService {

  private static readonly requestOptions: RequestOptions = 
    new RequestOptions({
      headers: new Headers({ 'Accept': 'application/json' }),
      withCredentials: true
    })

  constructor(
    private readonly servicesBaseUrl: any, 
    private readonly http: Http
  ) {
  }

  read(request: BackendRequest): void {
    // debido a que el metodo GET debe ser enviado con un cuerpo vacio, habra 
    // que pasar los parametros del servicio en el URL, sin embargo, debido a 
    // que el backend esta implementado utilizando Slim PHP, este solo puede 
    // configurar rutas con parametros, es decir, no puede enrutar peticiones 
    // que contengan query strings en su URL, debido a esto, hay que desglozar 
    // los parametros ingresados y adjuntarlos a la URL del servicio 
    // dividiendolos con diagonales
    // this.http
    //   .get(this.servicesBaseUrl + service, BackendService.requestOptions)
    //   .map((response: Response) => {
    //     return this.parseHttpResponseToJson(response)
    //   })
    //   .catch(onErrorCallback)
    //   .subscribe(onSuccessCallback)
    this.http
      .get(
        this.servicesBaseUrl + request.service, 
        BackendService.requestOptions
      )
      .pipe(
        map((response: Response) => {
          return this.parseHttpResponseToJson(response)
        }),
        observableCatchError(request.on.fail)
      )
      .subscribe(request.on.response)
  }

  create(request: BackendRequest, body: FormData): void {
    this.http
      .post(
        this.servicesBaseUrl + request.service, 
        body, 
        BackendService.requestOptions
      )
      .pipe(
        map((response: Response) => {
          return this.parseHttpResponseToJson(response)
        }),
        observableCatchError(request.on.fail)
      )
      .subscribe(request.on.response)
  }

  update(request: BackendRequest, body: FormData): void {
    this.http
      .patch(
        this.servicesBaseUrl + request.service, 
        body, 
        BackendService.requestOptions
      )
      .pipe(
        map((response: Response) => {
          return this.parseHttpResponseToJson(response)
        }),
        observableCatchError(request.on.fail)
      )
      .subscribe(request.on.response)
  }

  delete(request: BackendRequest): void {
    this.http
      .delete(
        this.servicesBaseUrl + request.service, 
        BackendService.requestOptions
      )
      .pipe(
        map((response: Response) => {
          return this.parseHttpResponseToJson(response)
        }),
        observableCatchError(request.on.fail)
      )
      .subscribe(request.on.response)
  }

  private parseHttpResponseToJson(response: Response): any {
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
