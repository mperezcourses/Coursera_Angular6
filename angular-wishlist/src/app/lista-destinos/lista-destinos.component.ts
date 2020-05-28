import { Component, OnInit } from '@angular/core';
import { DestinoViaje } from '../models/destino-viaje.model';

@Component({
  selector: 'app-lista-destinos',
  templateUrl: './lista-destinos.component.html',
  styleUrls: ['./lista-destinos.component.css']
})
export class ListaDestinosComponent implements OnInit {

  //Array de elementos destino-viaje
  //destinos: String[];
  destinos: DestinoViaje[];

  constructor() {
    //this.destinos = ["Barranquilla", "Lima", "Buenos Aires", "Barcelona"];
    this.destinos = [];
  }

  ngOnInit() {
  }

  guardar(nombre: String, url: String): boolean {
    this.destinos.push(new DestinoViaje(nombre, url));

    return false; //Para que no se recargue la pagina
  }

}
