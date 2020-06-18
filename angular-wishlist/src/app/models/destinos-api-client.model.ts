import { DestinoViaje } from './destino-viaje.model';
import { Subject, BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../app.module';
import { NuevoDestinoAction, BorrarDestinoAction, ElegidoFavoritoAction } from './destinos-viajes-state.model';
import { Injectable } from '@angular/core';

/**
 * Esta clase actua como una especie de simulacion de un cliente trabajando 
 * contra un servidor.
 */
/* 
 * El decorador "@Injectable()" permite que el servicio DestinosApiClient, que 
 * se puede definir como dependencia de otra clase (por ejemplo, en el 
 * constructor de esa clase), pueda, a su vez, satisfacer sus dependencias 
 * (por ejemplo, el Store que se inyecta en el constructor).
 */
@Injectable()
export class DestinosApiClient {

  /**
   * Lista de destinos de viaje. Como "DestinosApiClient" esta declarado como 
   * un servicio inyectable en el "app.module.ts", se usa como un Singleton y, 
   * por lo tanto, permite mantener el estado de los destinos de viaje aunque 
   * el usuario se vaya moviendo entre los enlaces de las rutas establecidas. 
   * Por ejemplo, cuando la lista se guardaba en ListaDestinosComponent, al 
   * hacer click en el detalle de un destino de viaje e intentar volver otra 
   * vez a la pagina donde se renderizaba el listado, este listado desaparecia 
   * porque se reiniciaba. En cambio, si la lista se guarda en esta clase, al 
   * ser un Singleton que se comparte a traves de la aplicacion, el objeto 
   * mantiene su estado y se puede volver a recorrer.
   */
  // Ahora los estados se gestionan en el AppState
  //destinos: DestinoViaje[];// = [];

  /**
   * Objeto Observable capaz de emitir eventos. Se establece por defecto como 
   * un objeto BehaviorSubject, que es una implementacion de Subject que tiene 
   * nocion de estado y en el que se puede consultar el valor actual en 
   * cualquier momento usando el metodo "getValue()", y se inicializa con el 
   * valor por defecto "null".
   * En "current" se establece el destino que esta siendo elegido como 
   * favorito (seleccionado) y, al ser Observable, otros componentes van a 
   * poder suscribirse para ser avisados de cuando un destino sea el nuevo 
   * destino favorito. Este comportamiento lo define BehaviorSubject, que 
   * detecta cuando un nuevo elemento se "setea" en "current" y va a "avisar" 
   * al resto de la aplicacion sobre esto (programacion reactiva).
   */
  // Ahora los estados se gestionan en el AppState
  //current: Subject<DestinoViaje> = new BehaviorSubject<DestinoViaje>(null);

  // Ahora los estados se gestionan en el AppState
  /*
  constructor() {
    this.destinos = [];
  }
  */

  constructor(private store: Store<AppState>) {}

  // Ahora los estados se gestionan en el AppState
  /*
  add(d: DestinoViaje) {
    this.destinos.push(d);
  }

  remove(d: DestinoViaje) {
    this.destinos = this.destinos.filter(item => 
      item.getId() !== d.getId());
  }
  
  getById(id: String): DestinoViaje {
    return this.destinos.filter(
      function(d) { 
        return d.getId() === id;
      }
    )[0];
  }

  getAll(): DestinoViaje[] {
    return this.destinos;
  }
  */

  /**
   * Permite establecer el destino favorito.
   * 
   * @param d Destino de viaje a marcar como favorito.
   */
  // Ahora los estados se gestionan en el AppState
  /*
  elegir(d: DestinoViaje) {
    //Se marcan todos los destinos como no seleccionados
    this.destinos.forEach(destinoViaje => destinoViaje.setSelected(false));
    //Se marca al destino elegido como seleccionado
    d.setSelected(true);
  */
    /*
     * Se establece el nuevo destino favorito en el Observable.
     * Esto va a provocar que se informe a todos los suscritos de esta 
     * modificacion.
     */
  /*
    this.current.next(d);
  }
  */

  /**
   * Permite suscribirse para ser avisado del establecimiento de un 
   * nuevo destino de viaje favorito.
   * Como "current" se establece como un "Subject" de "DestinoViaje", 
   * el argumento de la funcion debe ser un "DestinoViaje".
   * 
   * @param fn Funcion de suscripcion.
   */
  // Ahora los estados se gestionan en el AppState. Como la gestion del 
  // estado se realiza a traves de Redux, este metodo ya no hace falta.
  /*
  subscribeOnChange(fn) {
    this.current.subscribe(fn);
  }
  */

  // Al usar el Store, se usan estos metodos:
  /**
   * Permite generar un nuevo destino de viaje.
   * 
   * @param d Destino de viaje a generar.
   */
  add(d: DestinoViaje) {
    this.store.dispatch(new NuevoDestinoAction(d));
  }

  /**
   * Permite borrar un destino de viaje.
   * 
   * @param d Destino de viaje a borrar.
   */
  remove(d: DestinoViaje) {
    this.store.dispatch(new BorrarDestinoAction(d));
  }

  /**
   * Permite establecer el destino favorito.
   * 
   * @param d Destino de viaje a marcar como favorito.
   */
  elegir(d: DestinoViaje) {
    this.store.dispatch(new ElegidoFavoritoAction(d));
  }
}
