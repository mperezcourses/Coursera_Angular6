import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DestinoViaje } from '../models/destino-viaje.model';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { map, filter, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

@Component({
  selector: 'app-form-destino-viaje',
  templateUrl: './form-destino-viaje.component.html',
  styleUrls: ['./form-destino-viaje.component.css']
})
export class FormDestinoViajeComponent implements OnInit {

  /**
   * Evento que se envia cuando se anhade un destino de viaje al 
   * listado de destinos.
   */
  @Output() onItemAdded: EventEmitter<DestinoViaje>;
  /**
   * Objeto FormGroup que representa el conjunto de elementos del 
   * formulario de destinos de viaje.
   */
  fg: FormGroup;
  /**
   * Longitud minima de caracteres para el validador del control "nombre". 
   * Por defecto: 3.
   */
  minLongitud = 3;
  /**
   * Resultados de autocompletado para el campo "nombre".
   */
  searchResults: string[];

  /*
   * FormBuilder permite construir una instancia de FromGroup 
   * llamando a "group()". Se le pasa como argumento un objeto 
   * que define los controles que se podran vincular al FormGroup.
   * Se usa un valdador de Angular que indica que el elemento 
   * controlado por el control "nombre" debe tener un valor 
   * obligatoriamente.
   */
  constructor(fb: FormBuilder) {
    this.onItemAdded = new EventEmitter<DestinoViaje>();
    this.fg = fb.group({
      //Para un validador particular
      /*nombre: ['', Validators.required],*/
      //Para una serie de validadores sobre un mismo control
      nombre: ['', Validators.compose([
        Validators.required,
        this.nombreNoValidoValidator,
        this.nombreCortoValidatorParametrizable(this.minLongitud)
      ])],
      url: ['']
    });

    /*
     * Para probar que funciona. Se inscribe a un observable que avisa de 
     * cuando ocurre un cambio en el formulario y se imprime por consola.
     */
    this.fg.valueChanges.subscribe(
      (formulario: any) => {
        console.log('Cambio en el formulario: ', formulario);
      }
    );
  }

  ngOnInit() {
    //Gestion del autocompletado con programacion reactiva.
    //Se selecciona el elemento <input> del DOM.
    let elemNombre = <HTMLInputElement>document.getElementById("nombre");
    /*
     * Se procede cada vez que se captura el evento "input" (el usuario ha 
     * tocado una tecla en el input). Se realizan una serie de operaciones 
     * secuencialmente (pipe):
     *   "map": Cada vez que se captura un evento "input" de teclado, se 
     *          recupera el elemento <input> del DOM en el que se lanzo el 
     *          evento (el campo del nombre, en este caso) y se extrae el 
     *          valor que contiene.
     *   "filter": Solo pasan el filtro los casos en los que hay mas de 2 
     *             caracteres en el <input>. Si algun caso no pasa el filtro, 
     *             se cierra la tuberia y no se sigue con el resto de las 
     *             operaciones.
     *   "debounceTime": Define el tiempo, en milisegundos, durante el que se 
     *                   va a seguir esperando por nuevos eventos (en este 
     *                   caso, nuevos "inputs" en el campo "nombre"). Si 
     *                   llegan mas eventos, se descartan los antiguos y solo 
     *                   sigue por la secuencia de operaciones el mas 
     *                   reciente. Por ejemplo, si el usuario escribe "B" y, 
     *                   luego, escribe muy rapido "arcel", solo seguira por 
     *                   la tuberia la entrada "Barcel" y el resto ("B", "Ba", 
     *                   "Bar", etc.) se descartan.
     *   "distinctUntilChanged": Descarta todos los casos repetidos. Por 
     *                           ejemplo, el usuario escribe "Barce" y, 
     *                           rapidamente, escribe una "l" y la borra. 
     *                           En ese caso, llega otra vez "Barce" porque 
     *                           "debounceTime" descarta "Barcel". Si ese 
     *                           comportamiento se repite varias veces, se 
     *                           tendria "Barce"-"Barce"-"Barce"-... N veces. 
     *                           Por lo tanto, "distinctUntilChanged" descarta 
     *                           todos los repetidos hasta que haya un cambio.
     *   "switchMap": Si el resto de operaciones son exitosas, hace una 
     *                peticion Ajax a un archivo JSON llamado "datos.json" 
     *                (podria haber hecho una peticion a un servicio que 
     *                devolviera los datos que se necesitan).
     *                Ojo! Usar comillas simples porque con comillas dobles 
     *                daba error 404.
     * 
     * Cuando se completan todas las operaciones, se hace una suscripcion al 
     * cambio en ese campo (una cada vez que hay un cambio) y se usa la 
     * respuesta Ajax para definir los elementos que aparecen en el 
     * autocompletado.
     */
    fromEvent(elemNombre, "input").pipe(
      map((e: KeyboardEvent) => (e.target as HTMLInputElement).value), 
      filter(text => text.length > 2),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(() => ajax('/assets/datos.json'))
    ).subscribe(ajaxResponse => {
      //console.log("Suscrito");
      this.searchResults = ajaxResponse.response
    });
  }

  /**
   * Genera un nuevo destino de viaje y emite el evento de que se ha generado 
   * para que sea capturado por el componente padre que use a este componente.
   * 
   * @param nombre Nombre del destino.
   * @param url URL de la foto del destino.
   * @returns False para que no se recargue la pagina.
   */
  guardar(nombre: string, url: string): boolean {
    
    let destino = new DestinoViaje(nombre, url);
    this.onItemAdded.emit(destino);

    return false; //Para que no se recargue la pagina
  }

  /**
   * Define una validacion personalizada para el nombre de un destino de viaje. 
   * En este caso, activa el error si el campo tiene entre 1 y 4 caracteres.
   * 
   * @param control Objeto FormControl para gestionar la validacion.
   * @returns Un mapa de errores (Objeto del tipo 
   *          "{[nombreClave]: boolean}"). Por ejemplo: 
   *          {required: true, email: true}.
   */
  nombreNoValidoValidator(control: FormControl): {[clave: string]: boolean} {
    /*
     * Longitud del campo nombre. Como "control.value" es una propiedad de 
     * tipo "any", hay que hacer un "toString()" para asegurar que se puede 
     * hacer el "trim()" y el "length".
     */
    let longitud = control.value.toString().trim().length;

    // Si hay entre 1 y 4 caracteres, el nombre no es valido.
    // "invalidNombre" coincide con el error esperado en la plantilla.
    if(longitud > 0 && longitud < 5) {
      /*
       * No es necesario pasar una clave String porque, si no hay espacios, se 
       * evalua como si fuera un String. En caso de que el valor fuera 
       * "invalid Nombre", si que habria que anhadir las comillas.
       * Como caso especial, si "invalidNombre" fuera una variable que 
       * contiene el nombre del error a usar, se podria emplear de la 
       * siguiente forma, usando una variable temporal:
       *   const propertyName = "name";
       *   let returnValueTemp = {};
       *   returnValueTemp[propertyName] = true;
       *   return returnValueTemp;
       */
      return {invalidNombre: true};
    }

    return null;

  }

  /**
   * Define una validacion personalizada para el nombre de un destino de viaje. 
   * En este caso, activa el error si el campo es de menos de 
   * "this.minLongitud" caracteres.
   * Es parametrizable porque se le pueden pasar parametros de validacion. En 
   * este caso, una longitud minima.
   * 
   * @param control Longitud minima que debe tener el campo.
   * @returns Una funcion que retorna un mapa de errores 
   *          (Objeto "{[clave]: boolean}") sobre la propiedad 
   *          `minLongitud` si la comprobacion de validacion falla. 
   *          En otro caso, devuelve `null`.
   */
  nombreCortoValidatorParametrizable(minLong: number): ValidatorFn {

    /*
     * Se retorna una funcion que implementa una interfaz ValidatorFn, la cual 
     * tiene la forma "(control: AbstractControl): ValidationErrors | null;". 
     * Se le pasa como argumento un FormControl (que implementa 
     * AbstractControl) y devuelve un mapa de errores 
     * ( type ValidationErrors = {[key: string]: any;}; ) o null si no hay 
     * errores. Ese mapa de errores se puede entender como:
     * 
     * let mapa : { [clave: string]: boolean} = {};
     * mapa["abc"] = true; // Clave "abc" recibe true
     * mapa["abcd"] = false; // Clave "abcd" recibe false
     * mapa.abc = false; // Clave "abc" cambia de true a false
     * mapa["abcde"] = "string"; // Lanza una excepcion por no ser boolean
     * mapa[1] = true; // 1 se traduce a String --> Clave "1" recibe true
     */
    return (control: FormControl): { [clave: string]: boolean } | null => {

      /*
       * Longitud del campo nombre. Como "control.value" es una propiedad de 
       * tipo "any", hay que hacer un "toString()" para asegurar que se 
       * puede hacer el "trim()" y el "length".
       */
      let longitud = control.value.toString().trim().length;

      // Si hay entre 1 y minLong caracteres, el nombre no es valido.
      // "minLongNombre" coincide con el error esperado en la plantilla.
      if(longitud > 0 && longitud < minLong) {
        return {minLongNombre: true};
      }

      return null;
    }
  }

}
