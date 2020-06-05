import {v4 as uuid} from 'uuid'; //Para usar UUID

/**
 * Objeto del modelo que define un destino de viaje.
 */
export class DestinoViaje {

  private id: String = uuid();

  //Variable privada que define si un destino de viaje esta seleccionado
  private selected: boolean;

  //Lista de servicios/comodidades que ofrece el destino de viaje
  public servicios: String[];

/*
  nombre: String;
  imagenUrl: String;

  constructor(nombre, url) {
    this.nombre = nombre;
    this.imagenUrl = url;
  }
*/

  /*
   * Definir los parametros del constructor como publicos es un atajo de 
   * TypeScript que permite obviar el "seteo" explicito de las variables de 
   * la clase relativas a esos parametros. De esta forma, este constructor 
   * es equivalente al codigo del constructor anterior comentado. 
   */
/*constructor(public nombre: String, public imagenUrl: String) {
  }
*/
  constructor(public nombre: String, public imagenUrl: String) {
    this.servicios = ["Desayuno", "Comida"];
  }

  public getId(): String {
    return this.id;
  }

  public isSelected(): boolean {
    return this.selected;
  }

  public setSelected(sel: boolean) {
    this.selected = sel;
  }
}
