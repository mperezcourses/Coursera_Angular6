import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { DestinoViaje } from '../models/destino-viaje.model';
import { DestinosApiClient } from '../models/destinos-api-client.model';
import { Store, ActionsSubject, select } from '@ngrx/store';
import { AppState } from '../app.module';
import { ElegidoFavoritoAction, 
         NuevoDestinoAction, 
         BorrarDestinoAction, 
         DestinosViajesActionTypes } from '../models/destinos-viajes-state.model';
import { Subscription, Subject } from 'rxjs';
import { ofType, Actions } from '@ngrx/effects';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-lista-destinos',
  templateUrl: './lista-destinos.component.html',
  styleUrls: ['./lista-destinos.component.css']
})
export class ListaDestinosComponent implements OnInit {

  /**
   * Evento que se envia cuando se anhade un destino de viaje al 
   * listado de destinos.
   */
  //@Output() onItemAdded: EventEmitter<DestinoViaje>;

  /**
   * Almacena una lista de frases con los destinos de viaje que se van 
   * marcando como favoritos o que se van borrando.
   */
  updates: string[];

  /** Lista de los destinos de viaje que gestiona la aplicacion. */
  private allDestinosViaje: DestinoViaje[];

  // Observable que permite eliminar la suscripcion a una accion
  //private suscripcionAcciones = new Subscription();

  // Observable que permite eliminar la suscripcion a una accion
  private unsubscribeActions$ = new Subject<void>();

/*
  // Se inyecta el servicio Singleton "DestinosApiClient"
  constructor(private destinosApiClient: DestinosApiClient) {
    this.onItemAdded = new EventEmitter<DestinoViaje>();
    this.updates = [];
*/    /*
     * Suscripcion a un Observable que avise cuando se marca un 
     * destino de viaje como favorito, pasando como argumento una 
     * funcion que defina la logica a realizar en ese caso.
     */
/*    this.destinosApiClient.subscribeOnChange(
      (d: DestinoViaje) => {
        // El BehaviorSubject se inicializa a "null", por lo que se comprueba
        if(d !== null) {
          this.updates.push("El elemento seleccionado ha sido " + d.nombre);
        }
      }
    );
  }
*/

  /* 
   * Se inyecta el servicio Singleton "DestinosApiClient".
   * Ahora la actualizacion del favorito se hace con Redux. 
   * Modificamos el constructor para que incluya un servicio 
   * de Store con el que acceder al estado y se actualiza la 
   * lista de eleccion de favoritos mediante la suscripcion a 
   * observables de Redux.
   */
  constructor(private destinosApiClient: DestinosApiClient, 
          private store: Store<AppState>, 
          /*private actionsSubject: ActionsSubject*/
          private actions$: Actions) {
    //this.onItemAdded = new EventEmitter<DestinoViaje>();
    this.updates = [];
    
    /*
     * Se realiza la seleccion de los datos de los que interesan 
     * las actualizaciones de su estado. Como en este caso solo se 
     * usan los datos de favorito, se selecciona la propiedad 
     * favorito de la "feature" "destinos" (DestinosViajesState) 
     * del "AppState".
     * "this.store.select()" devuelve un Observable y se realiza 
     * la suscripcion a este Observable para actualizar, de manera 
     * reactiva, la lista de eleccion de favorito cuando el Observable 
     * nos avisa (ya que, al suscribirnos, pasamos a ser Observadores 
     * del elemento favorito) de que ha cambiado el destino de viaje 
     * favorito. Ademas, como a lo que se reacciona es a cambios de 
     * estado, si se vuelve a seleccionar el mismo destino como favorito 
     * no se acualiza la lista de favoritos, al contrario de lo que sucedia
     * cuando se empleaba la funcion "subscribeOnChange" de DestinosApiClient.
     */
    //this.store.select(store => store.destinos.favorito) // DEPRECATED
    this.store.pipe(select(store => store.destinos.favorito))
      .subscribe(data => {
        // El paramero "data" es el DestinoViaje elegido como favorito
        const fav = data;
        if(data !== null) {
          this.updates.push("El elemento seleccionado ha sido " + data.nombre);
        }
      });

    /*
     * La funcion "pipe()" permite ejecutar los operadores que se le pasen 
     * como argumento de manera que se ejecuten de forma secuencial, como si 
     * se tratara de una unica funcion. El operador "select()" devuelve un 
     * Observable, en este caso sobre los destinos de viaje que gestiona la 
     * aplicacion (se seleccionan solo estos de entre todos los objetos que 
     * hay en el Store) y se procede a la suscripcion a sus cambios. Por lo 
     * tanto, cuando se modifica esta lista, se llamara a 
     * "setAllDestinosViaje" pasandole como argumento la nueva lista de 
     * destinos de viaje para que se pueda actualizar por pantalla. Esto 
     * permite, por ejemplo, que la DevTools de Redux 
     * ("@ngrx/store-devtools") sea capaz de mostrar, de manera visual en el 
     * navegador, una linea temporal donde se van sucediendo los cambios en 
     * la lista.
     */
    this.store.pipe(select(store => store.destinos.items))
      .subscribe(destinos => this.setAllDestinosViaje(destinos));
    
    /*
     * Ejemplo de suscripcion a una accion desde un componente.
     * Este ejemplo permite que un bloque de codigo se ejecute una 
     * vez se ha completado la accion.
     * Ojo! Esto se ejecuta despues de los reducers, de los effects 
     * y de las acciones/reducers/effects que se llamen desde los 
     * effects de la accion. Por lo tanto, se podria considerar como 
     * una especie de bloque que se ejecuta despues de finalizar todo 
     * el proceso directo e indirecto de la accion. Por ejemplo, si 
     * se incluye este codigo:
     *
     *   this.updates.push("El elemento borrado ha sido " + 
     *     (action as BorrarDestinoAction).destino.nombre);
     * 
     * El resultado sera que se incluira el mensaje incluso despues de 
     * que el effect llame a la accion de seleccionar un favorito (lo 
     * cual, en este caso, no es el resultado deseado):
     * 
     *   El elemento seleccionado ha sido A (se crea A --> Favorito = A)
     *   El elemento seleccionado ha sido B (se crea B --> Favorito = B)
     *   El elemento seleccionado ha sido C (se crea C --> Favorito = C)
     *   El elemento seleccionado ha sido B (se borra C --> Favorito = B)
     *   El elemento borrado ha sido C (se anota al final del proceso)
     */
    /*
    this.suscripcionAcciones = actionsSubject.pipe(
      ofType(DestinosViajesActionTypes.BORRAR_DESTINO)
    ).subscribe((action) => {
      // Codigo a ejecutar despues de completarse la accion y sus 
      // acciones derivadas.
      this.updates.push("El elemento borrado ha sido " + 
        (action as BorrarDestinoAction).destino.nombre);
    });
    */

    /*
     * Ejemplo de suscripcion a una accion desde un componente.
     * Este ejemplo permite que un bloque de codigo se ejecute una 
     * vez se ha completado la accion.
     * Se ejecuta despues de los reducers de la accion y antes de las nuevas 
     * acciones lanzadas por los reducers. Por lo tanto, el mensaje de 
     * borrado de un destino de viaje se imprimira antes que el del nuevo 
     * destino de viaje favorito (en caso de haberlo). Por ejemplo, si 
     * se incluye este codigo:
     *
     *   this.updates.push("El elemento borrado ha sido " + 
     *     (action as BorrarDestinoAction).destino.nombre);
     * 
     * Los mensajes mostrados seran: 
     * 
     *   El elemento seleccionado ha sido A (se crea A --> Favorito = A)
     *   El elemento seleccionado ha sido B (se crea B --> Favorito = B)
     *   El elemento seleccionado ha sido C (se crea C --> Favorito = C)
     *   El elemento borrado ha sido C (se anota antes del nuevo favorito)
     *   El elemento seleccionado ha sido B (se borra C --> Favorito = B)
     */
    this.actions$.pipe(
      ofType(DestinosViajesActionTypes.BORRAR_DESTINO),
      // Se pueden anhadir mas operadores al Observable si es necesario
      /*
       * "takeUntil" emite los valores emitidos por el Observable fuente 
       * (this.actions$) hasta que el Observable argumento 
       * (this.unsubscribeActions$) emite un valor 
       * (https://rxjs-dev.firebaseapp.com/api/operators/takeUntil).
       */
      takeUntil(this.unsubscribeActions$)
    )
    .subscribe((action) => {
      // Codigo a ejecutar despues de los effects de la accion pero antes de 
      // otras acciones derivadas.
      /*this.store.select(store => store.destinos.items).subscribe(items => {
          console.log("COMPONENT-Items = " + items.length)});*/
      this.updates.push("El elemento borrado ha sido " + 
        (action as BorrarDestinoAction).destino.nombre);
    });

    /*
     * TODO: Al igual que se registra una frase para los borrados de destinos 
     * de viaje, registrarla tambien al generar un nuevo destino de viaje.
     */
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    /*
     * Se desinscribe de la suscripcion a las acciones cuando la instancia 
     * del componente es destruida ("ngOnDestroy()") para que no haya 
     * fugas de memoria.
     * Se emite un valor y se completa. De esta manera, el 
     * "takeUntil(this.unsubscribeActions$)" dejara de emitir eventos y el 
     * Observable "actions$" no permanecera "abierto".
     */
    this.unsubscribeActions$.next();
    this.unsubscribeActions$.complete();
    //this.suscripcionAcciones.unsubscribe();
  }

  /**
   * Lanza la logica para guardar un nuevo destino de viaje. El nuevo 
   * destino de viaje se marca como favorito.
   * 
   * @param destino El destino a guardar entre los destinos que 
   *                gestiona el sistema.
   */
  agregar(destino: DestinoViaje) {
    /* 
     * Aunque ahora se estan utilizando acciones de Redux que deberian 
     * realizar toda esta logica, por ahora sigue siendo preciso anhadir 
     * manualmente el destino al singleton DestinosApiClient porque en la 
     * plantilla se esta usando el metodo "getAll()" de DestinosApiClient 
     * para mostrar por pantalla los destinos de viaje generados. Una mejora 
     * en el codigo seria encapsular las llamadas a las acciones desde 
     * DestinosApiClient y que se encargue de todo.
     */
    // Al realizar la mejora mencionada, ahora la logica de lanzamiento de 
    // acciones se lleva a cabo en DestinosApiClient. Aunque se va a realizar 
    // esta llamada, se comenta aqui porque se va a documentar.
    /*
    this.destinosApiClient.add(destino);
    //this.onItemAdded.emit(destino);
    */

    /*
     * La accion "NuevoDestinoAction" lanza, a traves de un "effect", 
     * una accion "ElegidoFavoritoAction", de manera que el nuevo 
     * destino de viaje se marca como favorito.
     */
    // Ahora la logica de lanzamiento de acciones se lleva a cabo en 
    // DestinosApiClient, por lo que ya no es necesaria aqui.
    //this.store.dispatch(new NuevoDestinoAction(destino));

    /*
     * Al encapsular las llamadas para disparar las acciones necesarias 
     * en DestinosApiClient, ya no es necesario hacerlas aqui, sino que 
     * es suficiente con llamar al metodo especifico de DestinosApiClient. 
     * Las acciones llamadas desde esos metodos se encargan de realizar 
     * toda la logica necesaria.
     */
    this.destinosApiClient.add(destino);
  }

  /**
   * Define un destino de viaje como seleccionado.
   * 
   * @param dest Destino de viaje seleccionado.
   */
  elegido(dest: DestinoViaje) {
    /*
     * Al usar programacion reactiva, solo es necesario que 
     * DestinosApliClient se ocupe de todo.
     */
    //this.destinosApiClient.elegir(dest);

    /*
     * Se lanza una accion de Redux que almacena al elemento 
     * en el estado como favorito.
     */
    // Ahora la logica de lanzamiento de acciones se lleva a cabo en 
    // DestinosApiClient, por lo que ya no es necesaria aqui.
    //this.store.dispatch(new ElegidoFavoritoAction(dest));

    /* 
     * La accion de eleccion de un nuevo destino de viaje favorito 
     * llamada desde DestinosApiClient realiza todo el proceso.
     */
    this.destinosApiClient.elegir(dest);
  }

  /**
   * Lanza la logica para borrar un destino de viaje.
   * La implementacion actual indica que si el destino de viaje a 
   * borrar tiene marca de favorito, una vez borrado se marca como 
   * favorito al ultimo destino de viaje anhadido a la lista de 
   * destinos de viaje. En caso de que no tenga marca de favorito, 
   * se mantiene el elemento favorito actual. Si al borrar el 
   * elemento, ya no quedan destinos de viaje en la lista, se establece 
   * que no hay favorito.
   * 
   * @param dest Destino de viaje a borrar.
   */
  borrarDestino(dest: DestinoViaje) {
    /* 
     * La accion de borrado llamada desde DestinosApiClient realiza 
     * todo el proceso de borrado de un destino de viaje.
     */
    this.destinosApiClient.remove(dest);
    /*
     * La accion "BorrarDestinoAction" lanza, a traves de un "effect", 
     * una accion "ElegidoFavoritoAction" con el destino correcto que 
     * se debe marcar como favorito en caso de que el destino a borrar 
     * tenga marca de favorito.
     */
    // Ahora la logica de lanzamiento de acciones se lleva a cabo en 
    // DestinosApiClient, por lo que ya no es necesaria aqui.
    //this.store.dispatch(new BorrarDestinoAction(dest));
  }

  getAllDestinosViaje(): DestinoViaje[] {
    return this.allDestinosViaje;
  }

  setAllDestinosViaje(destinos: DestinoViaje[]) {
    this.allDestinosViaje = destinos;
  }

}
