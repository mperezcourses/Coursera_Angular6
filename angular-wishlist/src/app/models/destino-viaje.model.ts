import {v4 as uuid} from 'uuid'; //Para usar UUID

/**
 * Objeto del modelo que define un destino de viaje.
 */
export class DestinoViaje {

  /** Identificador del destino de viaje. */
  private id: String = uuid();

  /** Variable privada que define si un destino de viaje esta seleccionado. */
  private selected: boolean;

  /** Lista de servicios/comodidades que ofrece el destino de viaje. */
  public servicios: String[];

  /** Votos positivos emitidos hacia el destino de viaje. */
  private votosPositivos: number;

  /** Votos negativos emitidos hacia el destino de viaje. */
  private votosNegativos: number;

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
    this.votosPositivos = 0;
    this.votosNegativos = 0;
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

  /**
   * Anota un voto positivo cara el destino de viaje.
   */
  votarPositivo() {
    this.votosPositivos++;
  }

  /**
   * Anota un voto negativo cara el destino de viaje.
   */
  votarNegativo() {
    this.votosNegativos--;
  }

  /**
   * Pone a 0 los contadores de votos cara el destino de viaje.
   */
  reiniciarVotos() {
    this.votosPositivos = 0;
    this.votosNegativos = 0;
  }

  getVotosPositivos(): number {
    return this.votosPositivos;
  }

  getVotosNegativos(): number {
    return this.votosNegativos;
  }
}
