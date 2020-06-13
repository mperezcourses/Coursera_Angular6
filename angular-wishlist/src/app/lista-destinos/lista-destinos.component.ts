import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { DestinoViaje } from '../models/destino-viaje.model';
import { DestinosApiClient } from '../models/destinos-api-client.model';
import { Store } from '@ngrx/store';
import { AppState } from '../app.module';
import { ElegidoFavoritoAction, NuevoDestinoAction, BorrarDestinoAction } from '../models/destinos-viajes-state.model';

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
   * marcando como favoritos.
   */
  updates: string[];

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
          private store: Store<AppState>) {
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
    this.store.select(store => store.destinos.favorito)
      .subscribe(data => {
        // El paramero "data" es el DestinoViaje elegido como favorito
        const fav = data;
        if(data !== null) {
          this.updates.push("El elemento seleccionado ha sido " + data.nombre);
        }
      });
  }

  ngOnInit() {
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
    this.destinosApiClient.add(destino);
    //this.onItemAdded.emit(destino);

    /*
     * La accion "NuevoDestinoAction" lanza, a traves de un "effect", 
     * una accion "ElegidoFavoritoAction", de manera que el nuevo 
     * destino de viaje se marca como favorito.
     */
    this.store.dispatch(new NuevoDestinoAction(destino));
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
    this.store.dispatch(new ElegidoFavoritoAction(dest));
  }

  /**
   * Lanza la logica para borrar un destino de viaje.
   * La implementacion actual indica que si el destino de viaje a 
   * borrar tiene marca de favorito, una vez borrado se marca como 
   * favorito al ultimo destino de viaje anhadido a la lista de 
   * destinos de viaje. En caso de que no tenga marca de favorito, 
   * se mantiene el elemento favorito actual.
   * 
   * @param dest Destino de viaje a borrar.
   */
  borrarDestino(dest: DestinoViaje) {
    this.destinosApiClient.remove(dest);
    /*
     * La accion "BorrarDestinoAction" lanza, a traves de un "effect", 
     * una accion "ElegidoFavoritoAction" con el destino correcto que 
     * se debe marcar como favorito en caso de que el destino a borrar 
     * tenga marca de favorito.
     */
    this.store.dispatch(new BorrarDestinoAction(dest));
  }

}
