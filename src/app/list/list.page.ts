import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Task } from '../interfaces/task';
import { AlertController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DatabaseService } from '../services/database.service';
import { TaskDaoService } from '../services/task-dao.service';
import { v4 as uuidv4 } from 'uuid';
import { ModalTaskComponent } from '../components/modal-task/modal-task.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage{

  catId: string;
  catJSON: any ={}
  tarefa: string = ''
  // lista: Lists[] = []
  alertButtons = ['OK'];
  deleteMode = false
  alertInputs = [
    {
      placeholder: 'Descricao',
    },
  ];
  
  tasks$: any;

  constructor(
    private storage: Storage, 
    private alertController: AlertController, 
    private router: Router,
    private database: DatabaseService,
    private taskDao: TaskDaoService,
    private modalCtrl: ModalController
    ) { 
      
  //   this.lista= [{
  //     id: 0,
  //     description: 'Conta de água - R$ 100,00'
  //   },{
  //     id: 1,
  //     description: 'Vacina atual do Happy - R$ 160,00'
  //   },{
  //     id: 2,
  //     description: 'Sorvete banana com chocolate - R$ 24,00'
  //   },{
  //     id: 3,
  //     description: 'Botijão de gás + Fogão - 450,00'
  //   }
  // ]
  }

  async ionViewWillEnter() {
    this.catId = await this.storage.get('catId')
    
    console.log(this.catId);
    this.database.getDatabaseState().subscribe((ready) => {
      if (ready) {
        this.loadTasks()
      }
    })
  }

  async loadTasks() {
    console.log("loadTasks")
    this.tasks$ = await this.taskDao.getObservable(this.catId)
    console.log(this.tasks$)

  }


  
  onClickDelete(ident:any) {
    // console.log(this.lista)
    // const deletar = this.lista.filter(item => item.id !== ident)
    // this.lista = deletar
    // console.log(this.lista)

  }

  // async presentAlert() {
  //   const alert = await this.alertController.create({
  //     header: "Nova Tarefa",
  //     message: "Qual a nova tarefa a ser realizada",
  //     inputs: [
  //       {
  //         name: "lists",
  //         type: 'text',
  //         placeholder: "Tarefa"
  //       }],
  //     buttons: [{
  //       text: "Salvar",
  //       role: "save",
  //       handler: (res) => { console.log('tarefa 2') }
  //     }, 'Cancel']
  //   });

  //   await alert.present();
  //   const result = await alert.onDidDismiss()
  //   return result

  // }

  async addNewItem(){
    // const {data, role} = await this.presentAlert()
    // console.log(role)
    // if( role== "save") {
    //   console.log(data.values)
    //   const { lists } = data.values
    //   const id = this.lista[this.lista.length -1].id + 1
    //   this.lista.push({
    //     id, description: lists
    //   })
    // }
    // console.log(this.lista)
  }

  onClickVoltar(){
    this.router.navigate(["/home"],);
  }

  toggleChange(){
    this.deleteMode= !this.deleteMode

  }
  onClickAdd(){
    console.log("click Add")
    const task: Task = {
      id: uuidv4(),
      name: '',
    }
    this.openModal(task, 'create')
  }

  async openModal(task: Task, type: string) {
    // let cat: Category = {}
   
    const modal = await this.modalCtrl.create({
      component: ModalTaskComponent,
      cssClass: "modal-category",
      componentProps: {...task, type}
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      console.log(data)
      await this.upsertTask(data)

    }
  }

  async upsertTask(task: Task) {

    this.taskDao.upsert(task)
  }
  


}
