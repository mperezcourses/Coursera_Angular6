import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { DestinoViaje } from '../models/destino-viaje.model';
import { DestinosApiClient } from '../models/destinos-api-client.model';

@Component({
  selector: 'app-lista-destinos',
  templateUrl: './lista-destinos.component.html',
  styleUrls: ['./lista-destinos.component.css']
})
export class ListaDestinosComponent implements OnInit {

  /* 
   * Como se usa una clase cliente (DestinosApiClient) para manejar la 
   * persistencia de los objetos DestinoViaje, ya no es necesario almacenar 
   * el array de destinos en este componente.
   */
  //Array de elementos destino-viaje
  //destinos: DestinoViaje[];

  /**
   * Evento que se envia cuando se anhade un destino de viaje al 
   * listado de destinos.
   */
  @Output() onItemAdded: EventEmitter<DestinoViaje>;

  /**
   * Almacena una lista de frases con los destinos de viaje que se van 
   * marcando como favoritos.
   */
  updates: string[];

  /*constructor() {
    this.destinos = [];
  }*/

  // Se inyecta el servicio Singleton "DestinosApiClient"
  constructor(private destinosApiClient: DestinosApiClient) {
    this.onItemAdded = new EventEmitter<DestinoViaje>();
    this.updates = [];
    /*
     * Suscripcion a un Observable que avise cuando se marca un 
     * destino de viaje como favorito, pasando como argumento una 
     * funcion que defina la logica a realizar en ese caso.
     */
    this.destinosApiClient.subscribeOnChange(
      (d: DestinoViaje) => {
        // El BehaviorSubject se inicializa a "null", por lo que se comprueba
        if(d !== null) {
          this.updates.push("El elemento seleccionado ha sido " + d.nombre);
        }
      }
    );
  }

  ngOnInit() {
  }

  /**
   * Guarda un nuevo destino en la lista de destinos de viaje.
   * 
   * @param nombre Nombre del destino.
   * @param url URL de la foto del destino.
   * @returns False para que no se recargue la pagina.
   */
  /*
  guardar(nombre: String, url: String): boolean {
    //this.destinos.push(new DestinoViaje(nombre, url));
    
    let destino = new DestinoViaje(nombre, url);
    this.destinosApiClient.add(destino);
    this.onItemAdded.emit(destino);

    return false; //Para que no se recargue la pagina
  }
  */

  /* 
   * Ahora, al usar el formulario en el componente "FormDestinoViaje", 
   * es ese componente el que usa el metodo "guardar(nombre, url)". 
   * Aqui, ahora se usa el metodo "agregar(destinoViaje)".
   */

  /**
   * Lanza la logica para guardar un nuevo destino de viaje.
   * 
   * @param destino El destino a guardar entre los destinos que 
   *                gestiona el sistema.
   */
  agregar(destino: DestinoViaje) {
    this.destinosApiClient.add(destino);
    this.onItemAdded.emit(destino);
  }

  /**
   * Define un destino de viaje como seleccionado.
   * 
   * @param dest Destino de viaje seleccionado.
   */
  elegido(dest: DestinoViaje) {
    //Se marcan todos los destinos como no seleccionados
    /*this.destinos.forEach(
      function(d){
        d.setSelected(false);
      }
    );*/
    /*
    // Ahora DestinosApiClient se encarga de marcarlos como no seleccionados
    this.destinosApiClient.getAll().forEach(element => {
      element.setSelected(false);
    });

    //Se marca al destino elegido como seleccionado
    dest.setSelected(true);
    */

    /*
     * Al usar programacion reactiva, ahora solo es necesario que 
     * DestinosApliClient se ocupe de todo.
     */
    this.destinosApiClient.elegir(dest);
  }

}
