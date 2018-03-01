import { Injector } from '@angular/core'
import { UIRouter, Transition } from "@uirouter/angular"


export function checkAuthenticationOnNav(router: UIRouter, injector: Injector) 
{
  // ui-router tiene un mecanismo que nos permite ejecutar codigo cuando 
  // se cambia de un estado a otro, en este caso, onStart se ejecuta 
  // despues de salir del estado anterior y antes de entrar al estado 
  // siguiente, el detalle con esta funcion es que siempre debe retornar 
  // ya sea un booleano que indique si la navegacion al sig. se debe 
  // llevar a cabo o se debe detener, o una instancia del estado al cual 
  // se va a redireccionar el usuario; debido a esto, la funcion debe 
  // ejecutarse de forma sincrona, lo que es incompatible con la interfaz 
  // HTTP que podemos utilizar para revisar el cookie de sesion en el 
  // servidor. Debido a esto y al hecho de que, de hacerlo asi, se 
  // revisaria el cookie de sesion cada que se navega a una nueva pagina, 
  // no revisamos el cookie de sesion en esta funcion y en cambio 
  // revisamos una variable local
  router.transitionService.onStart(
    // activamos el callback de transferencia cuando se navega a 
    // cualquier estado
    { to: '*' },
    function(transition: Transition) {
      const stateService = transition.router.stateService
      const sourceState = transition.$from()
      const destinationState = transition.$to()
      const isComingFromOutside = sourceState.name.length == 0
      const isGoingToLogIn = destinationState.name == 'login'
      const isUserLoggedIn = () =>
        localStorage.is_logged_in !== undefined
        && localStorage.is_logged_in !== 'false'

      if (!isComingFromOutside && !isGoingToLogIn) {
        return (isUserLoggedIn()) ? true : stateService.target('login')
      }

      return true
    }  
  )
}