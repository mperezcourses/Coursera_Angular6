import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { DestinoViaje } from './destino-viaje.model';

/*
 * Archivo de estado para Redux. Este tipo de archivos permiten gestionar 
 * un estado unico global para toda la aplicacion, formado por subarboles 
 * que definen los estados de los diferentes objetos que la forman, de 
 * manera que los diferentes componentes se monten sobre los subarboles 
 * que necesiten segun los objetos que involucran.
 * Normalmente, en una aplicacion se realizan varios de estos archivos y 
 * se organizan en una carpeta de nombre, por ejemplo, Redux.
 * En este caso, se define el manejo del estado de los destinos de viaje.
 */

// ESTADO
// Elementos globales de los que la aplicacion mantiene estado
// En este caso, define el estado a mantener para los destinos de viaje
export interface DestinosViajesState {
    // Destinos de viaje que se almacenan en la aplicacion
    items: DestinoViaje[];
    /*
     * Permite informar al usuario (por ejemplo, con un spinner) sobre 
     * que la aplicacion esta cargando datos o esperando una respuesta del 
     * servidor tras una accion.
     */
    loading: boolean;
    // Destino de viaje favorito que se selecciona en la aplicacion
    favorito: DestinoViaje;
}

// Inicializacion del estado de los elementos anteriores
export function initializeDestinosViajesState() {
  return {
    items: [],
    loading: false,
    favorito: null
  };
}

// ACCIONES
/*
 * Acciones en la aplicacion que van a disparar un cambio del estado de los 
 * elementos anteriores.
 * Implementan la interfaz "Action" y deben dar valor a una variable "type", 
 * que es un String definido en la interfaz "Action" y que, como buena 
 * practica, debe provenir de una enumeracion.
 */
export enum DestinosViajesActionTypes {
  NUEVO_DESTINO = '[Destinos Viajes] Nuevo',
  ELEGIDO_FAVORITO = '[Destinos Viajes] Favorito',
  BORRAR_DESTINO = '[Destinos Viajes] Borrar'
}

/**
 * Enumeracion de eleccion de destino de viaje favorito. Se usa, en la 
 * implementacion actual, para decidir que destino de viaje se marca como 
 * favorito despues del borrado de un destino de viaje que puede estar 
 * marcado, o no, como favorito.
 * Valores:
 *   FIRST: Se marca como favorito al primer elemento de la lista
 *   LAST: Se marca como favorito al primer elemento de la lista
 *   NONE: No se marca a ningun elemento como nuevo favorito. Se usa en el 
 *         caso del borrado de un destino de viaje que no esta marcado como 
 *         favorito, por lo que se mantiene el favorito que ya esta marcado.
 */
export enum FavoritePosition {
  FIRST = 'Primer elemento',
  LAST = 'Ultimo elemento',
  NONE = 'Mantener favorito actual'
}

/** Accion para generar un nuevo destino de viaje */
export class NuevoDestinoAction implements Action {
  type = DestinosViajesActionTypes.NUEVO_DESTINO;
  // Permite construir un objecto NuevoDestinoAction
  // "destino" es el destino de viaje a generar
  constructor(public destino: DestinoViaje) {}
}

/** Accion para el marcado de un destino de viaje como favorito. */
export class ElegidoFavoritoAction implements Action {
  type = DestinosViajesActionTypes.ELEGIDO_FAVORITO;
  // "destino" es el destino de viaje a marcar como favorito
  // La notacion "?" indica que puede ser nulo
  constructor(public destino: DestinoViaje, public position?: string) {}
}

/** Accion para el borrado de un destino de viaje. */
export class BorrarDestinoAction implements Action {
  type = DestinosViajesActionTypes.BORRAR_DESTINO;
  // "destino" es el destino de viaje a borrar
  constructor(public destino: DestinoViaje) {}
}

/* 
 * Buena practica. Agrega en un "pipe" todas las acciones necesarias.
 * En este caso, la variable "DestinosViajesActions" es el conjunto de todos 
 * los tipos de datos que son acciones sobre destinos de viaje.
 */
export type DestinosViajesActions = NuevoDestinoAction | ElegidoFavoritoAction 
        | BorrarDestinoAction;

// REDUCERS
/*
 * Cada vez que se dispara (dispatch) una accion, Redux llama a los "reducers" 
 * en el orden en el que fueron definidos. A medida que son llamados, cada 
 * reducer recibe el estado anterior y la accion disparada. Finalmente, a 
 * traves de un switch, segun la eleccion de accion a realizar que se 
 * satisfaga, modifica y devuelve el estado y, en caso de que no se satisfaga 
 * ninguna de las opciones del switch, devuelve el estado sin modificar. La 
 * notacion "...variable" significa que se trata de un clon. Por lo tanto, 
 * "...state" es un clon de la variable "state". Se usa porque los reducers no 
 * deben devolver el estado original modificado, sino un estado clon que 
 * incluya las modificaciones que se necesiten.
 * En este caso, solo se define un "reducer", "reducerDestinosViajes".
 */
export function reducerDestinosViajes(
  state: DestinosViajesState,
  action: DestinosViajesActions
): DestinosViajesState {
  switch (action.type) {
    case DestinosViajesActionTypes.NUEVO_DESTINO: {
      // Se devuelve el estado clon con los items modificados (item anhadido)
      return {
          ...state,
          items: [...state.items, (action as NuevoDestinoAction).destino ]
        };
    }
    case DestinosViajesActionTypes.ELEGIDO_FAVORITO: {
        /*
         * Si al borrar un elemento queda la lista de destinos de viaje 
         * vacia, no se puede marcar como favorito a ningun otro destino 
         * de viaje, por lo que se finaliza el flujo devolviendo el estado 
         * sin modificar.
         */
        if(state.items.length === 0) {
          return state;
        }

        // Aqui se modifica el estado original pero el que se devuelva va a 
        // ser un clon.
        state.items.forEach(x => x.setSelected(false));
        let fav: DestinoViaje;
        const position = (action as ElegidoFavoritoAction).position;

        if(position === FavoritePosition.FIRST) {
          fav = state.items[0];
        }
        else if(position === FavoritePosition.LAST) {
          fav = state.items[state.items.length - 1];
        }
        else if(position === FavoritePosition.NONE) {
          fav = state.favorito;
        }
        else if(!isNaN(+position)) { // Si es un numero, procede
          // parseInt devuelve enteros. Se usa la base 10.
          const numberPosition = parseInt(position, 10);
          // Se comprueba que sea una posicion valida
          if(numberPosition >= 0 && numberPosition <= state.items.length - 1) {
            fav = state.items[numberPosition];
          }
          else {
            // Si no es una posicion valida, se mantiene el favorito actual
            fav = state.favorito;
            // O se cierra el flujo devolviendo el estado actual sin modificar
            //return state;
          }
        }
        else {
          // Si no se especfica una posicion, se elige al destino 
          // que se pasa a la accion
          fav = (action as ElegidoFavoritoAction).destino;
        }
        //const fav: DestinoViaje = (action as ElegidoFavoritoAction).destino;
        fav.setSelected(true);
        // Se devuelve un estado clon con el item favorito modificado
        return {
          ...state,
          favorito: fav
        };
    }
    case DestinosViajesActionTypes.BORRAR_DESTINO: {
      const destinoABorrar: DestinoViaje = 
        (action as BorrarDestinoAction).destino;
      // Se recupera la posicion en la lista del destino de viaje a borrar
      const posicion = state.items.findIndex(
        (dest) => {
          // Se compara por el identificador del destino
          if(dest.getId() === destinoABorrar.getId()) {
            return true; // Devuelve la posicion
          }

          return false; // Devuelve -1
        }
      );

      // Si el destino de viaje no se encuentra, se devuelve el 
      // estado sin modificar
      if(!(posicion >= 0 && posicion <= state.items.length - 1)){
        return state;
      }

      // Se devuelve el estado clon con los items modificados (item borrado)
      return {
          ...state,
          items: [...state.items.slice(0, posicion), ...state.items.slice(posicion + 1)]
      };

      // O, como la funcion "filter" devuelve un array nuevo, 
      // no hace falta la variable posicion:
      /*return {
        ...state, 
        items: state.items.filter(item => 
            item.getId() !== destinoABorrar.getId())
      };*/
      
    }
  }
  return state;
}

// EFFECTS
/*
 * Los "effects" se pueden emplear al instalar el modulo "effects" 
 * (@ngrx/effects). Una vez las acciones pasan por los "reducers", 
 * Redux las pasa a los "effects" en el orden en el que esten definidos. 
 * El objetivo de los "effects" es registrar una nueva accion o logica como 
 * consecuencia de una accion. Los "reducers" generan un nuevo estado 
 * (mutado o no) a partir del estado y de la accion, mientras que los 
 * "effects" generan una nueva accion, una redireccion cara alguna 
 * ruta (this.router.navigate(['path'])), etc., a partir de una accion. 
 * Los "effects" no mutan el estado.
 * Estos "effects" se anhaden al modulo "EffectsModule" en los "imports" del 
 * "app.module.ts".
 * El simbolo "$" se usa para denotar que la variable es un Observable.
 */
@Injectable()
export class DestinosViajesEffects {
  @Effect()
  nuevoAgregado$: Observable<Action> = this.actions$.pipe(
    // Accion de tipo NUEVO_DESTINO
    ofType(DestinosViajesActionTypes.NUEVO_DESTINO),
    // Si el tipo es el correcto, se lanza una nueva accion.
    // De "NuevoDestinoAction" se lanza "ElegidoFavoritoAction" (caso de 
    // uso "Un nuevo destino implica que se marque como favorito").
    map((action: NuevoDestinoAction) => new ElegidoFavoritoAction(action.destino))
  );

  @Effect()
  destinoBorrado$: Observable<Action> = this.actions$.pipe(
    // Accion de tipo BORRAR_DESTINO
    ofType(DestinosViajesActionTypes.BORRAR_DESTINO),
    // De "BorrarDestinoAction" se lanza "ElegidoFavoritoAction". Si un 
    // destino favorito se borra, se marca como favorito el ultimo anhadido.
    map((action: BorrarDestinoAction) => {
      //console.log("Lanzando effect de borrado");
      if(action.destino.isSelected()) {
        //console.log("FavoritePosition.LAST");
        return new ElegidoFavoritoAction(action.destino, FavoritePosition.LAST);
      }

      //console.log("FavoritePosition.NONE");
      return new ElegidoFavoritoAction(action.destino, FavoritePosition.NONE);
    })
  );

  constructor(private actions$: Actions) {}
}
