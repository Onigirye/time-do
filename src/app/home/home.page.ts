import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { Category } from '../interfaces/category';
import { AlertController, ModalController } from '@ionic/angular';
import { ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { v4 as uuidv4 } from 'uuid';
import { CategoryDaoService } from '../services/category-dao.service';
import { DatabaseService } from '../services/database.service';
import { ModalCategoryComponent } from '../components/modal-category/modal-category.component';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../interfaces/user';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})


export class HomePage {
  nome: string = '';
  categories$: any;
  selectedColor: string = '';
  categoria: string = ''
  lista: Category[] = []
  colors: string[] = []

  user: User = {
  }

  isModalOpen: boolean = false;


  constructor(
    private router: Router,
    private storage: Storage,
    private alertController: AlertController,
    private categoryDao: CategoryDaoService,
    private database: DatabaseService,
    private modalCtrl: ModalController,
    private authService: AuthenticationService
  ) {
    this.colors = ['success', 'warning', 'danger', 'medium', 'light', 'purple', 'blue', 'coffee', 'aqua']
  }

  async onClickItem(cat: any) {
    // const nav = cat.id;
    console.log(cat);
    //await this.storage.set("categoria", this.lista[id]);
    console.log('Itsumi Mario')


    await this.storage.set("cat", cat.toJSON())
    console.log("setei")

    this.router.navigate(["/list"]);
  }

  onClickAdd() {
    console.log("click Add")
    const cat: Category = {
      id: uuidv4(),
      name: '',
      color: ''
    }
    this.openModal(cat, 'create')
  }

  onClickEdit(cat: any) {
    console.log('click edit')
    const editCat: Category = cat.toJSON()
    this.openModal(editCat, 'edit')
  }

  onClickDelete(cat: any) {
    console.log(cat)
    const del = cat.get('id');
    console.log(del)
    this.categoryDao.removeById(del)
  }

  async presentAlert() {
    // const alert = await this.alertController.create({
    //   header: "Nova categoria",
    //   message: "Qual o nome da nova categoria",
    //   inputs: [
    //     {
    //       name: "category",
    //       type: 'text',
    //       placeholder: "Categoria"
    //     }],
    //   buttons: [{
    //     text: "Salvar",
    //     role: "save",
    //     handler: (res) => { console.log('nada') }
    //   }, 'Cancel']
    // });


    // await alert.present();
    // const result = await alert.onDidDismiss()
    // return result

  }

  async addNewCategory(cat: Category) {
    
    this.categoryDao.insert(cat)
  }

  async editCategory(cat: Category) {

    this.categoryDao.updateById(cat)
  }

  async upsertCategory(cat: Category) {
    cat.user = this.user.login
    this.categoryDao.upsert(cat)
  }
  


  

  async ionViewWillEnter() {
    this.database.getDatabaseState().subscribe(async (ready) => {
      if (ready) {
        this.user = await this.storage.get('user')
        await  this.loadCategories()
      }
    })

    
    console.log(this.user)
  }

  async loadCategories() {
    console.log(this.user.login)
    this.categories$ = await this.categoryDao.getObservable(this.user.login)
    console.log(this.categories$)

  }

  async openModal(cat: Category, type: string) {
    // let cat: Category = {}
   
    const modal = await this.modalCtrl.create({
      component: ModalCategoryComponent,
      cssClass: "modal-category",
      componentProps: {...cat, type}
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      console.log(data)
      await this.upsertCategory(data)

    }
  }

  async logout(){
    this.storage.remove('user')
    this.storage.remove('token')
    this.authService.setAuthState(false)

  }
}
