import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// Para usar rutas
import { RouterModule, Routes} from '@angular/router';
// Para formularios interactivos
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
// Para Redux ('@ngrx/store' & '@ngrx/effects')
// En la documentacion se recomienda usar un alias ("X as Y") para StoreModule
import { StoreModule as NgRxStoreModule, ActionReducerMap } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AppComponent } from './app.component';
import { DestinoViajeComponent } from './destino-viaje/destino-viaje.component';
import { ListaDestinosComponent } from './lista-destinos/lista-destinos.component';
import { DestinoDetalleComponent } from './destino-detalle/destino-detalle.component';
import { FormDestinoViajeComponent } from './form-destino-viaje/form-destino-viaje.component';
import { DestinosApiClient } from './models/destinos-api-client.model';
import { DestinosViajesState, 
         reducerDestinosViajes, 
         initializeDestinosViajesState, 
         DestinosViajesEffects} from './models/destinos-viajes-state.model';

/*
 * Array de rutas. Atributos:
 *   path: Direccion a "capturar". Ejemplo: 
 *         path: '' --> Direccion vacia (index)
 *         path: 'destino/:id' --> Direccion "destino" seguida de un String 
 *                                 que se identifica como el parametro "id".
 *   redirectTo: Direccion a la que se redirige cuando la direccion actual es 
 *               igual a la definida en "path".
 *   pathMatch: Indica que la direccion "path" tiene que concordar totalmente.
 *   component: Indica el componente a cargar segun el path.
 */
const rutas: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'}, 
  {path: 'home', component: ListaDestinosComponent},
  /* Para que permita ir a http://.../destino 
     Si no se incluye y se accede a /destino sin un "id", daria error */
  {path: 'destino', component: DestinoDetalleComponent},
  /* Para que permita ir, siendo "uuid" un identificador, 
     a http://.../destino/uuid */
  {path: 'destino/:id', component: DestinoDetalleComponent}
];

//*** Inicializacion de Redux ***
/*
 * Se define el estado global de la aplicacion, que esta compuesto por el 
 * estado de cada uno de los "features" que hay en la aplicacion (en este caso 
 * solo hay sobre un "feature", sobre el estado de los destinos de viaje).
 */
export interface AppState {
  destinos: DestinosViajesState;
  //otherFeature: otherFeatureState;
  //[...]
}

/*
 * Definicion de los reducers globales de la aplicacion. Se usan los 
 * "features" definidos en el "AppState".
 */
const reducers: ActionReducerMap<AppState> = {
  /* 
   * Se aplica el "reducer" "reducerDestinosViajes" (definido en 
   * "destinos-viajes-state.model.ts") al "feature" "destinos" (definido en 
   * el "AppState").
   */
  destinos: reducerDestinosViajes
};

/*
 * Inicializacion del estado de la aplicacion. Se usan, tambien, los 
 * "features" definidos en el "AppState".
 */
let reducersInitialState = {
  /* 
   * Se aplica la funcion "initializeDestinosViajesState" (definida en 
   * "destinos-viajes-state.model.ts") al "feature" "destinos" (definido en 
   * el "AppState").
   */
  destinos: initializeDestinosViajesState()
};
//*** Fin Inicializacion de Redux ***

/*
 * "RouterModule.forRoot(rutas)" registra el array de rutas en el modulo de 
 * la aplicacion.
 * "FormsModule" y "ReactiveFormsModule" permiten situar formularios 
 * interactivos en componentes hijo y usarlos desde componentes padre.
 * DestinosApiClient es un cliente que implementa una serie de metodos 
 * que permiten manipular objetos de tipo DestinoViaje. Se declara como un 
 * servicio inyectable (seccion "providers").
 * Para utilizar Redux, se registran los modulos "NgRxStoreModule" (un alias 
 * de "StoreModule") y "EffectsModule". A "NgRxStoreModule" se le pasan los 
 * "reducers" definidos anteriormente y el estado inicial de la aplicacion. 
 * A "EffectsModule" se le pasan los "effects" definidos en 
 * "destinos-viajes-state.model.ts" o (al ser un array) se podrian anhadir, 
 * tambien, los "effects" de los otros (en caso de haberlos) "features".
 */
@NgModule({
  declarations: [
    AppComponent,
    DestinoViajeComponent,
    ListaDestinosComponent,
    DestinoDetalleComponent,
    FormDestinoViajeComponent
  ],
  imports: [
    BrowserModule, 
    FormsModule, 
    ReactiveFormsModule, 
    RouterModule.forRoot(rutas),
    NgRxStoreModule.forRoot(reducers, { initialState: reducersInitialState }),
    EffectsModule.forRoot([DestinosViajesEffects])
  ],
  providers: [
    DestinosApiClient
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
