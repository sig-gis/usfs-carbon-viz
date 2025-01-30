import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../service/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {

  private subscriptions: Subscription[] = [];

    // form login data
    authentificationForm = this.formBuilder.group({
      email: ['', [Validators.email,Validators.required]],
      password: ['', [Validators.required]],
      remember: [false],
    });

    submitted : boolean = false;
    error_message : string = '';


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
  }

  onSubmitloginform(): void {

    //console.log(this.authentificationForm.get('username')!.value);

    this.authService.postAuthLogin({
      email: this.authentificationForm.get('email')!.value,
      password: this.authentificationForm.get('password')!.value,
      // remember: this.authentificationForm.get('remember').value,
    }).subscribe({
      next: responseData => {
        console.log(responseData);
        if (responseData.token !== undefined) {
 
            this.authService.setToken(responseData.token);
            this.authService.setIdUser(responseData.user_uuid);
            localStorage.setItem('user_uuid', responseData.user_uuid);
            localStorage.setItem('username', responseData.username);
            localStorage.setItem('first_name', responseData.first_name);
            localStorage.setItem('last_name', responseData.last_name);
            localStorage.setItem('role', responseData.role_name);
            
            this.router.navigate(['/home']);    

            if(responseData.role_name == 'admin'){
              this.router.navigate(['/admin']);
            }          

        }else{
          this.submitted = true;
          this.error_message = responseData.message;
        }
      },
      error: responseError => {
        console.log('Error SERVER response.');
        console.warn(responseError);
        // this.globaltoastService.sendMessage('Error SERVER response.', 'danger');
      }

    })
     
  }

  
  get getAuthForm(){
    return this.authentificationForm.controls;
  }

}
