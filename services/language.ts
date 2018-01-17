import { Injectable } from '@angular/core'

/* TODO: Encontrar una manera de extraer las traducciones simples de texto a lang10 (o como se llame) y dejar esta clase para que se utilice unicamente para extraer todo lo demas que sea dependiente del idioma, pero que no sea texto simple */

@Injectable()
export class LanguageService {
  protected translations = {
    es: {
      global: {
        datePickerConfig: {
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
        },
        username: "Nombre de Usuario",
        password: "Contraseña",
        wait: "Por favor espere...",
        erase: "Borrar",
        selectPlaceholder: "Elija una opción",
        submit: "Enviar",
        close: "Cerrar",
        accept: "Aceptar",
        cancel: "Cancelar",
        search: "Buscar",
        yes: "Sí",
        no: "No"
      },
      100: 'No se pudo reconocer el servicio solicitado',
      101: 'Faltó enviar una entrada al servidor',
      102: 'Una entrada enviada al servidor no es un valor numérico',
      103: 'Una entrada enviada al servidor esta fuera del intervalo correcto',
      104: 'Una entrada enviada al servidor no es un número entero',
      105: 'Una entrada enviada al servidor no es un número real',
      106: 'Una entrada enviada al servidor no tiene la longitud de caracteres correcta',
      107: 'La longitud de caracteres de una entrada enviada al servidor no esta dentro del intervalo apropiado',
      108: 'Una entrada enviada al servidor no es una cadena',
      109: 'Una entrada enviada al servidor no es una cadena de correo electrónico',
      110: 'Una entrada enviada al servidor no es un valor lógico',
      111: 'Una entrada enviada al servidor no es una fecha o el formato es incorrecto',
      112: 'Una entrada enviada al servidor es un arreglo vacío',
      113: 'Un archivo enviado al servidor no es un documento',
      114: 'Un archivo enviado al servidor no es una imagen',
      115: 'No se pudo enviar un archivo al servidor',
      116: 'Una entrada enviada al servidor no es un número telefónico',
      200: 'Fallo al instanciar un DAO'
    },
    en: {
      global: {
        datePickerConfig: {
          "closeOnSelect": true,
          "closeOnClear": false,
          "format": "dddd, dd mmmm, yyyy",
          "formatSubmit": "yyyy-mm-dd"
        },
        username: "Username",
        password: "Password",
        wait: "Please wait...",
        erase: "Delete",
        selectPlaceholder: "Choose an option",
        submit: "Send",
        close: "Close",
        accept: "Accept",
        cancel: "Cancel",
        search: "Search",
        yes: "Yes",
        no: "No"
      },
      100: 'Unable to recognize the requested service',
      101: 'A server input argument was not send',
      102: 'A server input argument is not a numeric value',
      103: 'A server input argument is outside the correct interval',
      104: 'A server input argument is not an integer',
      105: 'A server input argument is not a real number',
      106: "A server input argument doesn't have the proper character length",
      107: 'The character length of a server input argument is not within the proper interval',
      108: 'A server input argument is not a string',
      109: 'A server input argument is not an email string',
      110: 'A server input argument is not a boolean value',
      111: 'A server input argument is not a date or the format is incorrect',
      112: 'A server input argument is an empty array',
      113: 'A file sent to the server is not a document',
      114: 'A file sent to the server is not an image',
      115: 'A file could not be sent to the server',
      116: 'A server input argument is not a phone number',
      200: 'Failed to create an instance of a DAO'
    }
  }

  messages = {
    global: {
      datePickerConfig: null,
      username: null,
      password: null,
      wait: null,
      erase: null,
      selectPlaceholder: null,
      submit: null,
      close: null,
      accept: null,
      cancel: null,
      search: null,
      yes: null,
      no: null
    },
  }

  initMessages(): void {
    for (let msg in this.messages) {
      this.messages[msg] = this.translations[localStorage.lang][msg]
    }
  }

  changeLanguage(lang: string): void {
    localStorage.lang = lang
    for (let msg in this.messages) {
      this.messages[msg] = this.translations[lang][msg]
    }
  }

  getServiceMessage(service: string, code: number): string {
    let message = (localStorage.lang == 'en') ?
      'An unknown error occurred' : 'Ocurrió un error desconocido'
    
    let serviceMessages = this.translations[localStorage.lang][service]
    let returnCodeMessage = this.translations[localStorage.lang][code]
    if (serviceMessages !== undefined) {
      let serviceReturnCodeMessage = serviceMessages[code]
      if (serviceReturnCodeMessage !== undefined) {
        message = serviceReturnCodeMessage
      }
    } else if (returnCodeMessage !== undefined) {
      message = returnCodeMessage
    }

    return message
  }
}