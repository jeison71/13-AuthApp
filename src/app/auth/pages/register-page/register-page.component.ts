import { AppComponent } from './../../../app.component';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { AuthServiceService } from '../../services/auth-service.service';
import { UserRegister } from '../../interfaces/user-register.interface';

@Component({
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css'],
  host: {'register-host': 'register'},
})
export class RegisterPageComponent {

  private fb = inject( FormBuilder );
  private authService = inject( AuthServiceService );
  private router = inject( Router );

  public myForm: FormGroup = this.fb.group({
    email: ['',[ Validators.required, Validators.email ] ],
    name: ['',[ Validators.required, Validators.minLength(6) ] ],
    password: ['', [ Validators.required]],
  })

  register(){

    const userRegister: UserRegister = this.myForm.value
    //const {email, name, password } = this.myForm.value;
    console.log(userRegister);

    this.authService.register(userRegister)
    .subscribe( {
      next: (success) => {
        if(success) {
          Swal.fire('Exito', 'Usuario Registrado', 'success');
          this.myForm.reset();
        }
        else Swal.fire('Error', 'Usuario no se puedo Registrar', 'error');

      },
      error: (errorMessage) => {
        Swal.fire('Error', errorMessage, 'error');
      }

    })

  }
}
