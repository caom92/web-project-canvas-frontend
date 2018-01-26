import { Observable } from 'rxjs/Rx'
import { Injectable } from '@angular/core'
import { 
  Http, 
  Response, 
  Headers, 
  RequestOptions, 
  URLSearchParams 
} from '@angular/http'


export type BackendResponse = {
  returnCode: number,
  message: string,
  data: any
}

export type OnSuccessCallback = (response: BackendResponse) => void
export type OnErrorCallback = 
  (error: any, caught: Observable<void>) => Array<any>

@Injectable()
export class BackendService {
  private static requestOptions: RequestOptions = new RequestOptions({
    headers: new Headers({ 
      'Accept': 'application/json'
    }),
    withCredentials: true
  })

  private static defaultOnErrorCallback: OnErrorCallback = 
    (error: any, caught: Observable<void>) => {
      Observable.throw(error)
      return []
    }

  constructor(private http: Http) {
  }

  read(
    serviceUrl: string, 
    data: any, 
    onSuccessCallback: OnSuccessCallback,
    onErrorCallback: OnErrorCallback = BackendService.defaultOnErrorCallback
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
        serviceUrl + this.parseJsonToUrlParams(data),
        BackendService.requestOptions
      )
      .map((response: Response) => {
        let result = this.parseHttpResponseToJson(response)
        onSuccessCallback(result)
      })
      .catch(onErrorCallback)
      .subscribe()
  }

  write(
    serviceUrl: string, 
    data: FormData, 
    onSuccessCallback: OnSuccessCallback,
    onErrorCallback: OnErrorCallback = BackendService.defaultOnErrorCallback
  ): void {
    this.http
      .post(serviceUrl, data, BackendService.requestOptions)
      .map((response: Response) => {
        let result = this.parseHttpResponseToJson(response)
        onSuccessCallback(result)
      })
      .catch(onErrorCallback)
      .subscribe()
  }

  delete(
    serviceUrl: string, 
    data: any, 
    onSuccessCallback: OnSuccessCallback,
    onErrorCallback: OnErrorCallback = BackendService.defaultOnErrorCallback
  ): void {
    this.http
      .delete(
        serviceUrl + this.parseJsonToUrlParams(data),
        BackendService.requestOptions
      )
      .map((response: Response) => {
        let result = this.parseHttpResponseToJson(response)
        onSuccessCallback(result)
      })
      .catch(onErrorCallback)
      .subscribe()
  }

  private parseHttpResponseToJson(response: Response): any {
    let responseBody = response['_body'].toString()
    let responseJson = JSON.parse(responseBody)
    if (responseJson.meta !== undefined) {
      responseJson = {
        returnCode: responseJson.meta.return_code,
        message: responseJson.meta.message,
        data: responseJson.data
      }
    }
    return responseJson
  }

  private parseJsonToUrlParams(json: any): string {
    let params = ''
    for (let i in json) {
      params += '/' + json[i]
    }
    return params
  }
}