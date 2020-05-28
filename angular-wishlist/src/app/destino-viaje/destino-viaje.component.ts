import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { DestinoViaje } from '../models/destino-viaje.model';

@Component({
  selector: 'app-destino-viaje',
  templateUrl: './destino-viaje.component.html',
  styleUrls: ['./destino-viaje.component.css']
})
export class DestinoViajeComponent implements OnInit {

  /*
   * Variable del componente. Se emplea en "destino-viaje.component.html".
   * La anotación "@Input()" define que el valor de la variable "nombre" se 
   * puede establecer desde la plantilla (no se necesita, por ejemplo, hacer 
   * un "this.nombre = 'NombreEjemplo'" desde el constructor o desde un 
   * método "set('NombreEjemplo')").
   */
  //@Input() nombre: String;
  @Input() destino: DestinoViaje;

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

  constructor() { }

  ngOnInit() {
  }

}
