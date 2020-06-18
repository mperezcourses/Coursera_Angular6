import { Injectable } from '@angular/core';
import { Action, Store, select } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { map, withLatestFrom, concatMap } from 'rxjs/operators';
import { DestinoViaje } from './destino-viaje.model';
import { AppState } from '../app.module';

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

/**
 * Enumeracion que define los tipos de acciones sobre los destinos de viaje.
 */
export enum DestinosViajesActionTypes {
  NUEVO_DESTINO = '[Destinos Viajes] Nuevo',
  ELEGIDO_FAVORITO = '[Destinos Viajes] Favorito',
  BORRAR_DESTINO = '[Destinos Viajes] Borrar',
  VOTE_UP = '[Destinos Viajes] Vote Up',
  VOTE_DOWN = '[Destinos Viajes] Vote Down',
  VOTES_RESET = '[Destinos Viajes] Votes Reset'
}

/**
 * Enumeracion de eleccion de destino de viaje favorito. Se usa, en la 
 * implementacion actual, para decidir que destino de viaje se marca como 
 * favorito despues del borrado de un destino de viaje que puede estar 
 * marcado, o no, como favorito.
 * Valores:
 *   FIRST: Se marca como favorito al primer elemento de la lista
 *   LAST: Se marca como favorito al ultimo elemento de la lista
 *   SAME: No se marca a ningun elemento como NUEVO favorito. Se mantiene 
 *         el favorito que ya esta marcado.
 *   NONE: No debe haber ningun favorito. En caso de haberlo, se desmarca. 
 */
export enum FavoritePosition {
  FIRST = 'Primer elemento',
  LAST = 'Ultimo elemento',
  SAME = 'Mantener favorito actual',
  NONE = 'Sin favorito'
}

/** Accion para generar un nuevo destino de viaje */
export class NuevoDestinoAction implements Action {
  type = DestinosViajesActionTypes.NUEVO_DESTINO;
  // Permite construir un objecto NuevoDestinoAction.
  // "destino" es el destino de viaje a generar.
  constructor(public destino: DestinoViaje) {}
}

/**
 * Accion para el marcado de un destino de viaje como favorito. Puede 
 * recibir 2 parametros, el destino de viaje a marcar como favorito y, 
 * como parametro opcional, la posicion del destino de viaje que queremos 
 * marcar como favorito dentro de la lista de destinos de viaje. Esta 
 * posicion tiene prevalencia sobre el destino que se especifique, en caso de 
 * que se usen los dos argumentos y es un String que, aunque normalmente 
 * recibe un valor de la enumeracion FavoritePosition, puede ser una posicion 
 * especifica de la lista de destinos de viaje (por ejemplo, la posicion 
 * "1" o la "5" o ...).
 */
export class ElegidoFavoritoAction implements Action {
  type = DestinosViajesActionTypes.ELEGIDO_FAVORITO;
  // "destino" es el destino de viaje a marcar como favorito
  // La notacion "?" indica que puede ser nulo
  constructor(public destino?: DestinoViaje, public position?: string) {}
}

/** Accion para el borrado de un destino de viaje. */
export class BorrarDestinoAction implements Action {
  type = DestinosViajesActionTypes.BORRAR_DESTINO;
  // "destino" es el destino de viaje a borrar
  constructor(public destino: DestinoViaje) {}
}

/** Accion para el voto positivo hacia un destino de viaje. */
export class VoteUpDestinoAction implements Action {
  type = DestinosViajesActionTypes.VOTE_UP;
  // "destino" es el destino de viaje a votar positivamente
  constructor(public destino: DestinoViaje) {}
}

/** Accion para el voto negativo hacia un destino de viaje. */
export class VoteDownDestinoAction implements Action {
  type = DestinosViajesActionTypes.VOTE_DOWN;
  // "destino" es el destino de viaje a votar negativamente
  constructor(public destino: DestinoViaje) {}
}

/** Reinicia los contadores de votos hacia un destino de viaje. */
export class VotesResetDestinoAction implements Action {
  type = DestinosViajesActionTypes.VOTES_RESET;
  // "destino" es el destino de viaje a reiniciar sus contadores de votos
  constructor(public destino: DestinoViaje) {}
}

/* 
 * Buena practica. Agrega en un "pipe" todas las acciones necesarias.
 * En este caso, la variable "DestinosViajesActions" es el conjunto de todos 
 * los tipos de datos que son acciones sobre destinos de viaje.
 */
export type DestinosViajesActions = NuevoDestinoAction | ElegidoFavoritoAction 
        | BorrarDestinoAction | VoteUpDestinoAction | VoteDownDestinoAction 
        | VotesResetDestinoAction;

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
      //console.log("FAVORITO-Items = " + state.items.length);
      const destinoFav = (action as ElegidoFavoritoAction).destino;
      const position = (action as ElegidoFavoritoAction).position;
      
      if(state.items.length === 0) {
        /*
         * Si al borrar un elemento queda la lista de destinos de viaje 
         * vacia, no se puede marcar como favorito a ningun otro destino 
         * de viaje, por lo que se finaliza el flujo devolviendo el estado 
         * sin favorito.
         */
        return {
          ...state,
          favorito: null
        };
      }
      else if(!destinoFav && !position && position !== '0') {
        /*
         * Si todavia hay elementos en la lista de destinos de viaje y no se 
         * ofrece ningun parametro (null, undefined o un valor no valido) a la 
         * accion, no se hace nada. Por ejemplo, cuando se borra un destino de 
         * viaje que no estaba seleccionado como favorito, se podria llamar a 
         * ElegidoFavoritoAction sin parametros para que no modifique el 
         * favorito actual si todavia quedan elementos en la lista de destinos 
         * de viaje o para que elimine el elemento favorito si la lista queda 
         * vacia.
         * 
         * El String '0', aun siendo una posicion valida, evalua a true en 
         * "!position" (!variable --> TRUE para: null, undefined, 0, NaN, 
         * false o una cadena vacia).
         */
        return state;
      }
      else if(position === FavoritePosition.NONE) {
        // Se desea no mantener un favorito
        return {
          ...state,
          favorito: null
        };
      }
      else if(position === FavoritePosition.SAME) {
        // Si se quiere mantener el favorito, no se hace nada
        return state;
      }
      else if(destinoFav && state.favorito && 
              destinoFav.getId() === state.favorito.getId()) {
        // Si el destino de viaje a marcar como favorito es el mismo que 
        // el que ya es favorito, no se hace nada
        return state;
      }
      else {
        // Aqui se modifica el estado original pero el que se devuelva va a 
        // ser un clon.
        //state.items.forEach(x => x.setSelected(false));
        let fav: DestinoViaje;
        //const position = (action as ElegidoFavoritoAction).position;

        if(position === FavoritePosition.FIRST) {
          fav = state.items[0];
        }
        else if(position === FavoritePosition.LAST) {
          fav = state.items[state.items.length - 1];
        }
        /*else if(position === FavoritePosition.SAME) {
          fav = state.favorito;
        }*/
        else if(!isNaN(+position)) { // Si es un numero, procede.

          /*
           * Esta rama del if representa los casos en los que, explicitamente, 
           * se define la posicion, dentro de la lista de destinos de viaje, 
           * en la que se encuentra el destino de viaje que se desea marcar 
           * como favorito.
           */

          // parseInt devuelve enteros. Se usa la base 10.
          const numberPosition = parseInt(position, 10);
          // Se comprueba que sea una posicion valida
          if(numberPosition >= 0 && numberPosition <= state.items.length - 1) {
            const tempFav: DestinoViaje = state.items[numberPosition];
            // Si el elemento de la posicion elegida es el mismo que ya es 
            // favorito, se mantiene el estado actual.
            if(tempFav && state.favorito && 
               tempFav.getId() === state.favorito.getId()) {
              return state;
            }

            fav = tempFav;

            //fav = state.items[numberPosition];
          }
          else {
            // Si no es una posicion valida, se mantiene el favorito actual
            //fav = state.favorito;
            // O se cierra el flujo devolviendo el estado actual sin modificar
            return state;
          }
        }
        else {
          // Si no se especfica una posicion, se elige el destino 
          // que se pasa a la accion
          fav = destinoFav;
        }

        /*
         * Se marcan todos los destinos de viaje como no favorito para, luego, 
         * marcar como favorito al escogido.
         * Aqui se modifica el estado original pero el que se devuelva va a 
         * ser un clon.
         */
        state.items.forEach(x => x.setSelected(false));

        //const fav: DestinoViaje = (action as ElegidoFavoritoAction).destino;
        fav.setSelected(true);
        // Se devuelve un estado clon con el item favorito modificado
        return {
          ...state,
          favorito: fav
        };
      }
    }
    case DestinosViajesActionTypes.BORRAR_DESTINO: {
      //console.log("REDUCER-Items = " + state.items.length);
      const destinoABorrar: DestinoViaje = 
        (action as BorrarDestinoAction).destino;
      // Se recupera la posicion en la lista del destino de viaje a borrar
      const posicion = state.items.findIndex(
        (dest) => {
          // Se compara por el identificador del destino
          if(dest.getId() === destinoABorrar.getId()) {
            return true; // findIndex devuelve la posicion
          }

          return false; // findIndex devuelve -1
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
    case DestinosViajesActionTypes.VOTE_UP: {
      const destino: DestinoViaje = (action as VoteUpDestinoAction).destino;
      /*
       * Al modificar el objeto de tipo DestinoViaje, como ese objeto esta 
       * dentro del estado de la aplicacion, se modifica el estado y, por lo 
       * tanto, se debe retornar un clon del propio estado.
       */
      destino.votarPositivo();
      return { ...state };
    }
    case DestinosViajesActionTypes.VOTE_DOWN: {
      const destino: DestinoViaje = (action as VoteDownDestinoAction).destino;
      destino.votarNegativo();
      return { ...state };
    }
    case DestinosViajesActionTypes.VOTES_RESET: {
      const destino: DestinoViaje = 
        (action as VotesResetDestinoAction).destino;
      destino.reiniciarVotos();
      return { ...state };
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
    /* 
     * NOTA: Se usan comprobaciones del estado que ya estan incluidas en el 
     * reducer de ElegidoFavoritoAction pero, en este caso, el hacerlas aqui 
     * hace mas comprensible la logica que se emplea. Es mas, este tipo de 
     * comprobaciones, si no son comunes, es preferible hacerlas fuera de los 
     * reducers o estos contendran tantas opciones que dificultaran demasiado 
     * su codigo. Por ejemplo, en el caso del reducer de 
     * ElegidoFavoritoAction, se realizan comprobaciones que deben ir en este 
     * effect y que, como se puede comprobar, provocan que el codigo del 
     * reducer sea demasiado "engorroso".
     */

    ofType(DestinosViajesActionTypes.BORRAR_DESTINO),
    /*
     * "withLatestFrom" permite hacer comprobaciones sobre el estado desde los 
     * effects. Ojo! Tambien se podrian hacer modificaciones sobre el estado 
     * pero, como los effects no deben hacerlas, serian "invisibles" para la 
     * aplicacion y llevarian a estados no validos.
     * Solo se necesita acceder a la lista de destinos de viaje, por lo que 
     * se selecciona.
     * Desde la documentacion oficial se recomienda usar un 
     * "flattening operator" ("concatMap" en este caso) en conjunto con 
     * "withLatestFrom" para prevenir que el selector ("select(...)") se lance 
     * hasta que se dispare la accion correcta 
     * (https://ngrx.io/guide/effects#incorporating-state).
     * "of(x, y, z, ...)" genera una instancia de Observable que emite 
     * sincronicamente los valores proporcionados como argumento. Por ejemplo, 
     * "of(action)" genera un Observable que emite "action".
     */
    concatMap((action: BorrarDestinoAction) => of(action).pipe(
      withLatestFrom(this.state.pipe(select(estado => estado.destinos.items)))
    )),
    // Pero sin el "concatMap" tambien funcionaria
    //withLatestFrom(this.state.pipe(select(estado => estado.destinos.items))),
    /* 
     * De "BorrarDestinoAction" se lanza "ElegidoFavoritoAction". Si un 
     * destino favorito se borra, se marca como favorito el ultimo anhadido.
     */
    map(([action, items]: [BorrarDestinoAction, DestinoViaje[]]) => {
      //console.log("EFFECT-Items = " + items.length);
      //console.log("Lanzando effect de borrado");
      if(items.length === 0) {
        /*
         * Si ya no quedan elementos en la lista de destinos de viaje, no 
         * tiene sentido que haya un favorito, por lo que se elimina.
         */
        //console.log("FavoritePosition.NONE");
        return new ElegidoFavoritoAction(null, FavoritePosition.NONE);
      }
      else if(action.destino.isSelected()) {
        /* 
         * Si el destino de viaje borrado era el favorito, se elige al ultimo 
         * de la lista (el ultimo en anhadirse) como el nuevo favorito.
         */
        //console.log("FavoritePosition.LAST");
        return new ElegidoFavoritoAction(
          /*action.destino, */null, FavoritePosition.LAST);
      }

      /*
       * El destino de viaje borrado no estaba marcado como favorito y 
       * todavia quedan elementos en la lista de destinos de viaje, por 
       * lo que no se modifica el favorito.
       * No se puede cerrar el flujo directamente ("return;") porque si 
       * no se devuelve una accion da un error.
       */
      //console.log("FavoritePosition.SAME");
      //return; // No se puede cerrar el flujo directamente.
      //o
      //return new ElegidoFavoritoAction();
      //o
      return new ElegidoFavoritoAction(null, FavoritePosition.SAME);
    })
  );

  constructor(private actions$: Actions, private state: Store<AppState>) {}
}
