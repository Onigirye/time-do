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

  isModalOpen: boolean = false;


  constructor(
    private router: Router,
    private storage: Storage,
    private alertController: AlertController,
    private categoryDao: CategoryDaoService,
    private database: DatabaseService,
    private modalCtrl: ModalController
  ) {
    this.colors = ['success', 'warning', 'danger', 'medium', 'light', 'purple', 'blue', 'coffee', 'aqua']
  }

  async onClickItem(cat: any) {
    // const nav = cat.id;
    console.log(cat);
    //await this.storage.set("categoria", this.lista[id]);
    console.log('Itsumi Mario')
    await this.storage.set("catId", cat.get('id'))
    console.log("setei")

    await this.router.navigate(["/list"]);
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

    this.categoryDao.upsert(cat)
  }
  


  

  ionViewWillEnter() {
    this.database.getDatabaseState().subscribe((ready) => {
      if (ready) {
        this.loadCategories()
      }
    })
  }

  async loadCategories() {
    this.categories$ = await this.categoryDao.getObservable()
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
}
