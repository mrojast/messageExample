import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { BackgroundMode } from '@ionic-native/background-mode';

import * as mqtt from "mqtt";
var client  = mqtt.connect('mqtt://test.mosquitto.org:8080')

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, private alertCtrl: AlertController, private localNotifications: LocalNotifications, private backgroundMode: BackgroundMode) {
  
  }
 
  mostrarNotificacion(){
    this.localNotifications.requestPermission();
    console.warn("DENTRO A NOTIFICACION");
    this.localNotifications.hasPermission().then(resp => {
      console.info("SI HAY PERMISO", resp);
      this.localNotifications.schedule({
        id: 1,
        text: 'Single ILocalNotification',
        data: { secret: "HOLA" }
      });
    }, err => {
      console.error("NO HAY PERMISO");
    })
    
  }

  ionViewDidLoad(){
    this.backgroundMode.overrideBackButton();
    client.on('connect', ()=>{
      client.subscribe('presence');
    })
    client.on('message', (topic, message)=> {
      let mess = message.toString();
      this.mostrarNotificacion();
      console.log("mensaje del maldito mapache: ",message.toString());
      let alert = this.alertCtrl.create({
        title: 'Mensaje Nuevo',
        subTitle: mess,
        buttons: ['cancel']
      });
      alert.present();
    })
  }

}