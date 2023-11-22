import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Lists } from '../interfaces/lists';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

  cat: any={};
  tarefa: string = ''
  lista: Lists[] = []
  alertButtons = ['OK'];
  deleteMode = false
  alertInputs = [
    {
      placeholder: 'Descricao',
    },
  ];


  constructor(private storage: Storage, private alertController: AlertController, private router: Router) { 
    this.lista= [{
      id: 0,
      description: 'Conta de água - R$ 100,00'
    },{
      id: 1,
      description: 'Vacina atual do Happy - R$ 160,00'
    },{
      id: 2,
      description: 'Sorvete banana com chocolate - R$ 24,00'
    },{
      id: 3,
      description: 'Botijão de gás + Fogão - 450,00'
    }
  ]
  }

  async ngOnInit() {
    this.cat = await this.storage.get('categoria');
    console.log(this.cat);
  }
  
  onClickDelete(ident:number) {
    console.log(this.lista)
    const deletar = this.lista.filter(item => item.id !== ident)
    this.lista = deletar
    console.log(this.lista)

  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: "Nova Tarefa",
      message: "Qual a nova tarefa a ser realizada",
      inputs: [
        {
          name: "lists",
          type: 'text',
          placeholder: "Tarefa"
        }],
      buttons: [{
        text: "Salvar",
        role: "save",
        handler: (res) => { console.log('tarefa 2') }
      }, 'Cancel']
    });

    await alert.present();
    const result = await alert.onDidDismiss()
    return result

  }

  async addNewItem(){
    const {data, role} = await this.presentAlert()
    console.log(role)
    if( role== "save") {
      console.log(data.values)
      const { lists } = data.values
      const id = this.lista[this.lista.length -1].id + 1
      this.lista.push({
        id, description: lists
      })
    }
    console.log(this.lista)
  }

  onClickVoltar(){
    this.router.navigate(["/home"],);
  }

  toggleChange(){
    this.deleteMode= !this.deleteMode

  }

}
