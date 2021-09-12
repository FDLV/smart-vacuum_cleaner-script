//node .\vacuum_cleaner.js 200 
let dust = process.argv[2];

console.log(dust)

//Заряд батареи
let battery = (Math.random() * (100 - 15) + 15).toFixed();
battery = Number(battery);

//Объём пылесборника
let dust_container_available_volume = (Math.random() * 500).toFixed();
dust_container_available_volume = Number(dust_container_available_volume);

//Коэффициент загрязнённости квартиры
let coeff = (Math.random() * (3 - 0) + 0).toFixed();
coeff = Number(coeff);

//Должно храниться на iot платформе
//Состояние пылесоса
// 1 - тихая уборка; 2 - стандартная уборка; 3 - интенсивная уборка; 4 - зарядка; 5 - возвращение на зарядку; 6 - выключен
let vacuum_cleaner_state = (Math.random() * (4 - 1) + 1).toFixed()


const mqtt = require('mqtt').connect('mqtt://dev.rightech.io', {
  //В кавычках написать идентификатор
  clientId: process.env.MQTT_CLIENTID || ''
});
 
mqtt.on('connect', ()=> {
  console.log(`${new Date}: connected`);
  mqtt.subscribe('base/state/battery');
});
 
mqtt.on('message', (topic, message) => {
  console.log(`${new Date}: [${topic}] ${message.toString()}`);

  if (vacuum_cleaner_state == 1) {
    console.log("Состояние пылесоса: Проводится тихая уборка");
  }
  else if (vacuum_cleaner_state == 2) {
    console.log("Состояние пылесоса: Проводится стандартная уборка");
  }
  else if (vacuum_cleaner_state == 3) {
    console.log("Состояние пылесоса: Проводится интенсивная уборка");
  }
  else if (vacuum_cleaner_state == 4) {
    console.log("Состояние пылесоса: Зарядка");
  }

  console.log("Осталось заряда батареи: " + battery + "%")
  console.log("Осталось свободного места в пылесборнике: " + dust_container_available_volume + " мл\n")

});



setInterval(()=> {
    if (battery < 15 || dust_container_available_volume < 20) {
        vacuum_cleaner_state = 5;
    }

    if (vacuum_cleaner_state == 1) {
        battery = battery - 2;
        dust_container_available_volume = dust_container_available_volume - Number((Math.random() * (3 - 1) + 1).toFixed()) - coeff * 1;
    }
    else if (vacuum_cleaner_state == 2) {
        battery = battery - 3;
        dust_container_available_volume = dust_container_available_volume - Number((Math.random() * (6 - 4) + 4).toFixed()) - coeff * 2;
    }
    else if (vacuum_cleaner_state == 3) {
        battery = battery - 4;
        dust_container_available_volume = dust_container_available_volume - Number((Math.random() * (9 - 7) + 7).toFixed()) - coeff * 3;
    }
    else if (vacuum_cleaner_state == 4) {
        if (battery < 100) {
            battery = battery + 10;
        }
        if (battery > 100) {
            battery = 100;
        }
        if (battery == 100) {
            vacuum_cleaner_state = 5;
        }        
    }


    mqtt.publish('base/state/battery', battery.toString())
    mqtt.publish('base/state/dust_container_available_volume', dust_container_available_volume.toString())
    mqtt.publish('base/state/vacuum_cleaner_state', vacuum_cleaner_state.toString())
}, 5000);