import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { User } from '../interfaces/user';
import { DatabaseService } from '../services/database.service';
import { UserDaoService } from '../services/user-dao.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user: User = {
    login: '',
    password: '',
  }

  constructor(
    private router: Router,
    private alertController: AlertController,
    private database: DatabaseService,
    private userDao: UserDaoService,
    private toastController: ToastController,
    private storage: Storage
  ){ 
  }

  ngOnInit() {}

  async onClickEnter(){
   const {success, user} = await this.userDao.auth(this.user)
   console.log(success, user)
   if(success){
    await this.storage.set("user", user);
    await this.storage.set("token", user.login);
    this.router.navigate(["/home"]);
   }else{
    this.presentAlert("Senha e/ou Login incorretos")
   }
   
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1500,
      position: 'bottom',
    });

    await toast.present();
  }

  async presentAlert(message:  string) {
    const alert = await this.alertController.create({
      header: 'Atenção',
      message,
      buttons: ['OK'],
    });

    await alert.present();
  }


  ionViewWillEnter() {
    this.database.getDatabaseState().subscribe((ready) => {
      if (ready) {
      }
    })
  }

  onClickCadastrar(){
    this.router.navigate(["/register"]);
  }

}