import { Component, OnInit, Input, HostBinding, EventEmitter, Output } from '@angular/core';
import { DestinoViaje } from '../models/destino-viaje.model';

@Component({
  selector: 'app-destino-viaje',
  templateUrl: './destino-viaje.component.html',
  styleUrls: ['./destino-viaje.component.css']
})
export class DestinoViajeComponent implements OnInit {

  /*
   * Variable del componente. Se emplea en "destino-viaje.component.html".
   * El decorador "@Input()" define que se trata de una comunicacion desde 
   * un componente padre cara este componente, que actua como hijo. El valor 
   * de la variable "destino" se puede establecer desde la plantilla (no se 
   * necesita, por ejemplo, hacer un "this.destino = new DestinoViaje(...)" 
   * desde el constructor o desde un metodo "set(new DestinoViaje(...))").
   */
  @Input() destino: DestinoViaje;

  /*
   * Posicion que ocupa el destino de viaje en la lista de destinos de viaje.
   * Se renombra como "indice" para ser usado con ese nombre al establecer 
   * su valor en las plantillas ([indice]="valor").
   */
  @Input("indice") posicion: number;

  /*
   * "@HostBinding()" vincula una definicion de atributo al tag HTML que 
   * engloba al componente en una plantilla. Por ejemplo, en este caso, 
   * permite anhadir una clase CSS al elemento "<app-destino-viaje>" de 
   * una plantilla que use este componente (como 
   * "lista-destinos.component.html"), modificando el atributo "class" del 
   * tag HTML. Pero hay que tener en cuenta que esta regla se aplica para 
   * todas las plantillas que hagan uso de este componente (esta clase CSS 
   * se usaria en el tag HTML del componente para todas las plantillas).
   */
  @HostBinding('attr.class') cssClass = "col-md-4"; //class="col-md-4"

  /*
   * La propiedad "clicked" es de tipo EventEmitter, por lo que puede emitir 
   * eventos. En este caso, se define que al lanzarse el evento se envia un 
   * elemento de tipo DestinoViaje.
   * El decorador "@Output()" define que se trata de una comunicacion, a 
   * traves de la emision y captura de eventos, desde este componente, que 
   * actua como hijo y que genera y lanza un evento con la informacion que 
   * quiere compartir, cara un componente padre, que captura el evento y 
   * extrae de el la informacion que le envia este componente. Permite 
   * que se use el evento "clicked" en las plantillas de un componente padre 
   * en el proyecto. Por ejemplo, para llamar a una funcion del componente 
   * padre "miFuncion(destino: DestinoViaje)" cuando se captura el evento, 
   * se haria: 
   *   <app-destino-viaje ... (clicked)="miFuncion($event)">
   *     ...
   *   </app-destino-viaje>
   */
  @Output() clicked: EventEmitter<DestinoViaje>;

  @Output() borrarDestinoEvent: EventEmitter<DestinoViaje>;

  constructor() {
    this.clicked = new EventEmitter<DestinoViaje>();
    this.borrarDestinoEvent = new EventEmitter<DestinoViaje>();
  }

  ngOnInit() {
  }

  /**
   * Lanza un evento "clicked" con el destino que actualmente maneja el 
   * componente y que se desea que se marque como favorito.
   */
  ir() {
    this.clicked.emit(this.destino);

    return false; //Para que no recargue la pagina
  }

  /**
   * Lanza un evento "borrarDestinoEvent" con el destino que actualmente 
   * maneja el componente y que se desea borrar.
   */
  procesarBorradoDestino() {
    this.borrarDestinoEvent.emit(this.destino);

    return false; //Para que no recargue la pagina
  }

}
