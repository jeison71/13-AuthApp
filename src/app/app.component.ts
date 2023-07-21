import { Component, computed, effect, inject } from '@angular/core';
import { AuthServiceService } from './auth/services/auth-service.service';
import { Router } from '@angular/router';
import { AuthStatus } from './auth/interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  private authService = inject( AuthServiceService );
  private router = inject( Router );

  public finishedAuthCheck = computed<boolean>( () => {
    if( this.authService.authstatus() == AuthStatus.checking ) {
      return false;
    }
    return true;
  });

  public authStatusChangedEffect = effect( () => {
    console.log('authStatus:', this.authService.authstatus());

    switch( this.authService.authstatus() ){
      case AuthStatus.checking:
        return;

      case AuthStatus.authenticated:
        this.router.navigateByUrl('/dashboard');
        return;

      case AuthStatus.notAuthenticated:
        this.router.navigateByUrl('/auth/login');
        return;

    }
  })
}
