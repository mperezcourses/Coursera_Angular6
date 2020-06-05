import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// Para usar rutas
import { RouterModule, Routes} from '@angular/router';
// Para formularios interactivos
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AppComponent } from './app.component';
import { DestinoViajeComponent } from './destino-viaje/destino-viaje.component';
import { ListaDestinosComponent } from './lista-destinos/lista-destinos.component';
import { DestinoDetalleComponent } from './destino-detalle/destino-detalle.component';
import { FormDestinoViajeComponent } from './form-destino-viaje/form-destino-viaje.component';
import { DestinosApiClient } from './models/destinos-api-client.model';

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

/*
 * "RouterModule.forRoot(rutas)" registra el array de rutas en el modulo de 
 * la aplicacion.
 * "FormsModule" y "ReactiveFormsModule" permiten situar formularios 
 * interactivos en componentes hijo y usarlos desde componentes padre.
 * DestinosApiClient es un cliente que implementa una serie de metodos 
 * que permiten manipular objetos de tipo DestinoViaje. Se declara como un 
 * servicio inyectable (seccion "providers").
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
    RouterModule.forRoot(rutas)
  ],
  providers: [
    DestinosApiClient
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
