import { Component } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-wishlist';
  /*
   * Se declara la fecha como un Observable que, a cada iteracion del 
   * "setInterval", avisa al Observador (a su suscriptor) de que la fecha 
   * ha cambiado y le pasa el nuevo valor.
   */
  fecha = new Observable(observer => {
    setInterval(() => observer.next(new Date().toString()), 1000);
  });
}
