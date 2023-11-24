import { Component, OnInit } from '@angular/core';
import { User } from '../interfaces/user';
import { UserDaoService } from '../services/user-dao.service';
import { DatabaseService } from '../services/database.service';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  user: User = {
    login: '',
    password: '',
    name: ''
  }
  passRepeated = ''
  constructor(
    private userDao: UserDaoService,
    private database: DatabaseService,
    private alertController: AlertController,
    private toastController: ToastController,
    private router: Router,
  ) { 

  }

  ngOnInit() {
    
  }

  async presentAlert(message:  string) {
    const alert = await this.alertController.create({
      header: 'Atenção',
      message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  async onClickRegister(){
    console.log(this.user)
    if(this.user.password !=this.passRepeated){
      this.presentAlert("As senhas não estão iguais")
    }else if(this.user.login=='' || this.user.password=='' || this.user.name==''){
      this.presentAlert("Todos os campos devem ser preenchidos")
      
    }
    else{
      
      const result = await this.userDao.register(this.user)
      console.log(result)
      if(result.success==true){
        await this.presentToast("Usuáario cadastrado com sucesso")
        this.router.navigate(["/login"]);
      }

      
    }
    
  }

  onClickCancelar(){
    this.router.navigate(["/login"]);
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1500,
      position: 'bottom',
    });

    await toast.present();
  }


  ionViewWillEnter() {
    this.database.getDatabaseState().subscribe((ready) => {
      // if (ready) {
      //   this.loadCategories()
      // }
    })
  }

}
