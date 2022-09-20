import { Component } from '@angular/core';
import { ActionSheetController, AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  tarefas: any[]=[]; //iniciando matriz de tarefas com 0 itens, matriz = [tarefa, feito]

  constructor(
    private alertCtrl : AlertController,
    private toastCtrl : ToastController,
    private actionSheetCtrl : ActionSheetController
  ) {
    let tarefaDb = localStorage.getItem('tarefaDb');
    if(tarefaDb){
      this.tarefas = JSON.parse(tarefaDb);
    }

  }

  async addTarefa(){
    const alert = await this.alertCtrl.create({
      header: 'O que você precisa fazer?',
      inputs: [
        {
          name: 'txtnome',
          type: 'text',
          placeholder: 'Digite sua tarefa'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'light',
          handler: () => {
            console.log('Botão cancelado apertado!');
          }
        }, {
          text: 'Adicionar',
          handler: (form) => {
            console.log(form);
            this.add(form.txtnome);
          }
        }
      ]
    });

    await alert.present();
  }

  async abrirOpcoes(tarefa: any){
    const actsheet =  await this.actionSheetCtrl.create({
      header: 'O que você deseja fazer?',
      buttons: [{
        text: tarefa.feito ? 'Desmarcar' : 'Marcar',
        icon: tarefa.feito ? 'radio-button-off' : 'checkmark-circle',
        handler: () => {
          tarefa.feito = !tarefa.feito;
          this.atualizaLocalStorage();
        }
      },{

      }]
    });
    actsheet.present();



  }

  async add(nova: string){
    if(nova.trim().length < 1){
      const toast = await this.toastCtrl.create({
        message: 'Informe o que precisa fazer',
        duration: 2000,
        color: 'danger',
        position: 'bottom'
      });
      toast.present();
      return;
    }else{
      
    let tarefa = {
      nome: nova,
      feito: false
    }
    this.tarefas.push(tarefa);
    // Guarda a tarefa no loca storage do dispositivo
    this.atualizaLocalStorage();


    const toast = await this.toastCtrl.create({
      message: 'Tarefa adicionada com sucesso!',
      duration: 2000,
      color: 'success',
      position: 'middle'
    });
    toast.present();
    }
  }
  excluirTarefa(tarefa: any){
    this.tarefas = this.tarefas.filter(t => t != tarefa);
    this.atualizaLocalStorage();
    
  }

atualizaLocalStorage(){
  localStorage.setItem('tarefaDb', JSON.stringify(this.tarefas));
}


}
