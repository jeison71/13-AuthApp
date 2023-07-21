import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServiceService } from '../services/auth-service.service';
import { AuthStatus } from '../interfaces';

export const isNotAuthenticatedGuard: CanActivateFn = (route, state) => {

  const  authService = inject( AuthServiceService );
  const  router = inject( Router );

  //console.log({status: authService.authstatus() });

  if( authService.authstatus() === AuthStatus.authenticated ) {
    router.navigateByUrl('/dashboard');
    return false;
  }

  return true;
};



