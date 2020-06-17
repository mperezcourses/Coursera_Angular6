import { Component, OnInit } from '@angular/core';
import { DestinoViaje } from '../models/destino-viaje.model';
import { ActivatedRoute } from '@angular/router';
import { DestinosApiClient } from '../models/destinos-api-client.model';
import { Store, select } from '@ngrx/store';
import { AppState } from '../app.module';

@Component({
  selector: 'app-destino-detalle',
  templateUrl: './destino-detalle.component.html',
  styleUrls: ['./destino-detalle.component.css']
})
export class DestinoDetalleComponent implements OnInit {

  destinoDetalle: DestinoViaje;

  constructor(private route: ActivatedRoute, 
              private destinosApiClient: DestinosApiClient, 
              private store: Store<AppState>) { }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    // Si id existe, recupera el objeto. Al ser un UUID, su valor no va a ser 
    // 0, false, undefined, etc. Por lo tanto, cumplira la condicion.
    if(id) {
      // Ahora los estados se gestionan con Redux en el AppState, por lo que 
      // DestinosApiClient ya no tiene un metodo "getById(id)".
      //this.destinoDetalle = this.destinosApiClient.getById(id);
      this.store.pipe(select(store => store.destinos.items))
        .subscribe(destinos => {
          this.destinoDetalle = destinos.filter(
            function(d) { 
              return d.getId() === id;
            }
          )[0];
        });
      // Id incorrecto --> destinoDetalle undefined --> destinoDetalle = null
      if(!this.destinoDetalle) {
        this.destinoDetalle = null;
      }
    }
    else {
      this.destinoDetalle = null;
    }
  }

}
