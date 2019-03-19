import { throwError, Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import {
  Http, Response, Headers, RequestOptions
} from '@angular/http'




export interface BackendResponse {
  returnCode: number,
  message: string,
  data: any
}
export type OnRequestFailureCallback = (error: any) => Observable<Array<any>>
export type OnRequestSuccessCallback = (response: BackendResponse) => void



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


  private static readonly defaultOnFailureCallback: OnRequestFailureCallback =
    (error) => {
      throwError(error)
      return of([])
    }


  read(
    service: string,
    onRequestSuccess: OnRequestSuccessCallback,
    onRequestFailure = BackendService.defaultOnFailureCallback
  ): Observable<Array<any> | BackendResponse> {
    const request = this.http
      .get(
        this.servicesBaseUrl + service,
        BackendService.requestOptions
      )
      .pipe(
        map((response: Response) => {
          return this.parseHttpResponseToJson(response)
        }),
        catchError(onRequestFailure)
      )

    request.subscribe(onRequestSuccess)
    return request
  }


  create(
    service: string,
    input: FormData,
    onRequestSuccess: OnRequestSuccessCallback,
    onRequestFailure = BackendService.defaultOnFailureCallback
  ): Observable<Array<any> | BackendResponse> {
    const request = this.http
      .post(
        this.servicesBaseUrl + service,
        input,
        BackendService.requestOptions
      )
      .pipe(
        map((response: Response) => {
          return this.parseHttpResponseToJson(response)
        }),
        catchError(onRequestFailure)
      )

    request.subscribe(onRequestSuccess)
    return request
  }


  update(
    service: string,
    input: FormData,
    onRequestSuccess: OnRequestSuccessCallback,
    onRequestFailure = BackendService.defaultOnFailureCallback
  ): Observable<Array<any> | BackendResponse> {
    const request = this.http
      .patch(
        this.servicesBaseUrl + service,
        input,
        BackendService.requestOptions
      )
      .pipe(
        map((response: Response) => {
          return this.parseHttpResponseToJson(response)
        }),
        catchError(onRequestFailure)
      )

    request.subscribe(onRequestSuccess)
    return request
  }


  delete(
    service: string,
    onRequestSuccess: OnRequestSuccessCallback,
    onRequestFailure = BackendService.defaultOnFailureCallback
  ): Observable<Array<any> | BackendResponse> {
    const request = this.http
      .delete(
        this.servicesBaseUrl + service,
        BackendService.requestOptions
      )
      .pipe(
        map((response: Response) => {
          return this.parseHttpResponseToJson(response)
        }),
        catchError(onRequestFailure)
      )

    request.subscribe(onRequestSuccess)
    return request
  }


  private parseHttpResponseToJson(response: Response): BackendResponse {
    const body = '_body'
    const responseBody = response[body].toString()
    return JSON.parse(responseBody)
  }
}
