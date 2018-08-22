import { TranslationService } from 'angular-l10n'
import { FormGroup } from '@angular/forms'
import { languageConfig } from './l10n-config'


// Retorna la fecha de hoy en una cadena con formato AAAA-MM-DD
export function getFormattedDate(date: Date = new Date()): string {
  const year = date.getUTCFullYear().toString()
  let month = (date.getMonth() + 1).toString()
  let day = date.getUTCDate().toString()

  // El mes y el dia no estan precedidos por un 0 cuando son valores menores 
  // a 10. Para corregir esto, le agregamos el 0 al principio y luego 
  // recuperamos los ultimos 2 caracteres; si el valor es menor a 10, 
  // agregarle el 0 hara que la cadena tenga solo 2 caracteres, por lo que la 
  // funcion slice() retornara la cadena completa, en cambio si el valor es 
  // mayor a 10, agregarle el 0 hara que la cadena tenga 3 caracteres y la 
  // funcion slice retornara los ultimos 2 caracteres, borrando el cero que 
  // le habiamos agregado
  month = ('0' + month).slice(-2)
  day = ('0' + day).slice(-2)

  return `${ year }-${ month }-${ day }`
}

export function getServiceMessage(
  textTranslator: TranslationService, service: string, code: number
): string {
  let message = textTranslator.translate(`${ service } response ${ code }`)
  if (message === languageConfig.translation.missingValue) {
    message = textTranslator.translate(`server response ${ code }`)
    if (message === languageConfig.translation.missingValue) {
      message = textTranslator.translate(`unknown server error`)
    }
  }
  return message
}

export function getDatePickerConfig(lang: string): any {
  return (lang === 'es') ? 
    {
      'closeOnSelect': true,
      'closeOnClear': false,
      'monthsFull': [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
        'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ],
      'monthsShort': [
        'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep',
        'Oct', 'Nov', 'Dec'
      ],
      'weekdaysFull': [
        'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes',
        'Sábado'
      ],
      'weekdaysShort': [
        'Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'
      ],
      'weekdaysLetter': [
        'D', 'L', 'M', 'R', 'J', 'V', 'S'
      ],
      'today': 'Hoy',
      'clear': 'Borrar',
      'close': 'Cerrar',
      'format': 'dddd, dd mmmm, yyyy',
      'formatSubmit': 'yyyy-mm-dd',
      'selectYears': true,
      'selectMonths': true
    }
    : {
      'closeOnSelect': true,
      'closeOnClear': false,
      'format': 'dddd, dd mmmm, yyyy',
      'formatSubmit': 'yyyy-mm-dd',
      'selectYears': true,
      'selectMonths': true
    }
}

export function comparePasswordInputs(
  group: FormGroup, entryField: string, confirmationField: string
): any {
  const password = group.controls[entryField].value 
  const passwordConfirmation = group.controls[confirmationField].value
  
  // hay que retornar una bandera de error que activara el 
  // mensaje de error a desplegar
  return (password === passwordConfirmation) ? 
    null : { arePasswordsDifferent: true }
}

export function parseListElementsType<CurrentType, FinalType>(
  list: Array<CurrentType>, map: (element: CurrentType) => FinalType
): Array<FinalType> {
  const parsedData: Array<FinalType> = []
  for (const element of list) {
    parsedData.push(map(element))
  }
  return parsedData
}

export function searchArrayElement<ElementType>(
  list: Array<ElementType>, filter: (element: ElementType) => boolean
): ElementType {
  for (const element of list) {
    if (filter(element)) {
      return element
    }
  }
  return null
}

export function parseJsonToFormData(json: any): FormData {
  const data = new FormData()
  for (const key in json) {
    if (json.hasOwnProperty(key)) {
      if (json[key] !== null && json[key] !== undefined) {
        data.append(key.toString(), json[key].toString())
      }
    } else {
      throw new Error(`${ key } is not a member of json`)
    }
  }
  return data
}
