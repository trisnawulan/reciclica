import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterPageForm } from './form/register.page.form';
import { FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from 'src/store/AppState';
import { UserRegister } from 'src/app/model/user/UserRegister';
import { register } from 'src/store/register/register.actions';
import { RegisterState } from 'src/store/register/RegisterState';
import { hide, show } from 'src/store/loading/loading.actions';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm!: RegisterPageForm;

  constructor(private router: Router, private formBuilder: FormBuilder, private store: Store<AppState>,
    private toastController: ToastController) { }

  ngOnInit() {
    this.createForm();

    this.watchRegisterState();
  }

  register() {
    this.registerForm.getForm().markAllAsTouched();

    if (this.registerForm.getForm().valid){
      this.store.dispatch(register({userRegister: this.registerForm.getForm().value}))
    }
  }

  private createForm() {
    this.registerForm = new RegisterPageForm(this.formBuilder);
  }

  private watchRegisterState() {
    this.store.select("register").subscribe(state => {
      this.toggleLoading(state);

      if (state.isRegistered) {
        this.router.navigate(["home"]);
      }

      if (state.error) {
        this.toastController.create({
          message: state.error,
          duration: 5000,
          header:'registration not done'
        }).then(toast => toast.present());
      }
    })
  }

  private toggleLoading(state: RegisterState) {
      if (state.isRegistering) {
        this.store.dispatch(show());
      } else{
        this.store.dispatch(hide());
      }
  }
}
