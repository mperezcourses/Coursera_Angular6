import {v4 as uuid} from 'uuid'; //Para usar UUID

/**
 * Objeto del modelo que define un destino de viaje.
 */
export class DestinoViaje {

  /** Identificador del destino de viaje. */
  private id: String = uuid();

  /** Variable que define si un destino de viaje esta seleccionado. */
  private selected: boolean;

  /** Lista de servicios/comodidades que ofrece el destino de viaje. */
  public servicios: String[];

  /** Votos positivos emitidos hacia el destino de viaje. */
  private votosPositivos: number;

  /** Votos negativos emitidos hacia el destino de viaje. */
  private votosNegativos: number;

/*
  nombre: string;
  imagenUrl: string;

  constructor(nombre, url) {
    this.nombre = nombre;
    this.imagenUrl = url;
  }
*/

  /*
   * Definir los parametros del constructor con una visibilidad y un tipo 
   * determinados es un atajo de TypeScript que permite generar variables en 
   * la clase con el tipo y la visibilidad definidas. De esta forma, este 
   * constructor es equivalente al codigo del constructor anterior comentado. 
   */
/*
  constructor(public nombre: string, public imagenUrl: string) {
  }
*/

  constructor(public nombre: string, public imagenUrl: string) {
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
