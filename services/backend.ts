import { Observable } from 'rxjs/Rx'
import { 
  Http, 
  Response, 
  Headers, 
  RequestOptions, 
  URLSearchParams 
} from '@angular/http'


export interface BackendResponse {
  returnCode: number,
  message: string,
  data: any
}

export type OnSuccessCallback = (response: BackendResponse) => void
export type OnErrorCallback = 
  (error: any, caught: Observable<void>) => Array<any>

export abstract class BackendService {

  private static readonly requestOptions: RequestOptions = 
    new RequestOptions({
      headers: new Headers({ 
        'Accept': 'application/json'
      }),
      withCredentials: true
    })

  constructor(
    private readonly servicesBaseUrl: any, 
    private readonly http: Http
  ) {
  }

  private static readonly defaultOnErrorCallback: OnErrorCallback = 
    (error: any, caught: Observable<void>) => {
      Observable.throw(error)
      return []
    }

  read(
    service: string, 
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
        this.servicesBaseUrl + service + this.parseJsonToUrlParams(data),
        BackendService.requestOptions
      )
      .map((response: Response) => {
        const result = this.parseHttpResponseToJson(response)
        onSuccessCallback(result)
      })
      .catch(onErrorCallback)
      .subscribe()
  }

  write(
    service: string, 
    data: FormData, 
    onSuccessCallback: OnSuccessCallback,
    onErrorCallback: OnErrorCallback = BackendService.defaultOnErrorCallback
  ): void {
    this.http
      .post(this.servicesBaseUrl + service, data, BackendService.requestOptions)
      .map((response: Response) => {
        const result = this.parseHttpResponseToJson(response)
        onSuccessCallback(result)
      })
      .catch(onErrorCallback)
      .subscribe()
  }

  delete(
    service: string, 
    data: any, 
    onSuccessCallback: OnSuccessCallback,
    onErrorCallback: OnErrorCallback = BackendService.defaultOnErrorCallback
  ): void {
    this.http
      .delete(
        this.servicesBaseUrl + service + this.parseJsonToUrlParams(data),
        BackendService.requestOptions
      )
      .map((response: Response) => {
        const result = this.parseHttpResponseToJson(response)
        onSuccessCallback(result)
      })
      .catch(onErrorCallback)
      .subscribe()
  }

  private parseHttpResponseToJson(response: Response): any {
    const responseBody = response['_body'].toString()
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

  private parseJsonToUrlParams(json: any): string {
    let params = ''
    for (const i in json) {
      if (json.hasOwnProperty(i)) {
        params += '/' + json[i]
      } else {
        throw new Error(`${ i.toString() } is not a member of json`)
      }
    }
    return params
  }
}