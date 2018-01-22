import { TranslationService } from 'angular-l10n'

// Retorna la fecha de hoy en una cadena con formato AAAA-MM-DD
function getTodayFormattedDate(): string {
  let today = new Date()
  let year = today.getUTCFullYear().toString()
  let month = (today.getMonth() + 1).toString()
  let day = today.getUTCDate().toString()

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

function getServiceMessage(
  textTranslator: TranslationService, service: string, code: number
): string {
  let message = textTranslator.translate(`${ service } response ${ code }`)
  if (message === 'Translation Error') {
    message = textTranslator.translate(`server response ${ code }`)
  }
  return message
}

function getDatePickerConfig(lang: string): any {
  return (lang === 'es') ? 
    {
      "closeOnSelect": true,
      "closeOnClear": false,
      "monthsFull": [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio",
        "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
      ],
      "monthsShort": [
        "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep",
        "Oct", "Nov", "Dec"
      ],
      "weekdaysFull": [
        "Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes",
        "Sábado"
      ],
      "weekdaysShort": [
        "Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"
      ],
      "weekdaysLetter": [
        "D", "L", "M", "R", "J", "V", "S"
      ],
      today: "Hoy",
      clear: "Borrar",
      close: "Cerrar",
      format: "dddd, dd mmmm, yyyy",
      formatSubmit: "yyyy-mm-dd"
    }
    : {
      "closeOnSelect": true,
      "closeOnClear": false,
      "format": "dddd, dd mmmm, yyyy",
      "formatSubmit": "yyyy-mm-dd"
    }
}