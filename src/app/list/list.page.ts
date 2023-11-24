import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Task } from '../interfaces/task';
import { AlertController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DatabaseService } from '../services/database.service';
import { TaskDaoService } from '../services/task-dao.service';
import { v4 as uuidv4 } from 'uuid';
import { ModalTaskComponent } from '../components/modal-task/modal-task.component';
import { Category } from '../interfaces/category';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage {
  cat: Category = {};
  catJSON: any = {};
  tarefa: string = '';
  // lista: Lists[] = []
  alertButtons = ['OK'];
  deleteMode = false;
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
  }

  async ionViewWillEnter() {
    this.cat = await this.storage.get('cat');

    console.log(this.cat);
    this.database.getDatabaseState().subscribe((ready) => {
      if (ready) {
        this.loadTasks();
      }
    });
  }

  async loadTasks() {
    console.log('loadTasks');
    this.tasks$ = await this.taskDao.getObservable(this.cat.id!);
    console.log('tasks carregadas', this.tasks$);
  }

  onClickDelete(task: any) {
    console.log(task);
    const del = task.get('id');
    console.log(del);
    this.taskDao.removeById(del);
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

  async onClickEdit(task:any) {
    console.log('click edit')
    const editCat: Category = await task.toJSON()
    console.log(editCat)
    this.openModal(editCat, 'edit')

  }

  onClickVoltar() {
    this.router.navigate(['/home']);
  }

  toggleChange() {
    this.deleteMode = !this.deleteMode;
  }

  onClickAdd() {
    console.log('click Add');
    const task: Task = {
      id: uuidv4(),
      name: '',
      category: this.cat.id,
      done: false,
    };
    this.openModal(task, 'create');
  }

  async openModal(task: Task, type: string) {
    // let cat: Category = {}

    const modal = await this.modalCtrl.create({
      component: ModalTaskComponent,
      cssClass: 'modal-category',
      componentProps: { task, type },
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      console.log(data);
      await this.upsertTask(data);
    }
  }

  async upsertTask(task: Task) {
    this.taskDao.upsert(task);
  }

  async taskChange(task: any) {
    await task.patch({ done: !task.done })
    console.log(task)
    // this.task
  }

}
