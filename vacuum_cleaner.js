console.log("\nПылесос физически включен\n")

//Заряд батареи
let battery = (Math.random() * (100 - 15) + 15).toFixed();
battery = Number(battery);

//Объём пылесборника
let dust_container_available_volume

if (typeof process.argv[2] === "undefined") {
  dust_container_available_volume = (Math.random() * 500).toFixed();
  dust_container_available_volume = Number(dust_container_available_volume);
}
else {
  dust_container_available_volume = Number(process.argv[2])
}

//Коэффициент загрязнённости квартиры
let coeff = (Math.random() * (3 - 0) + 0).toFixed();
coeff = Number(coeff);

//Должно храниться на iot платформе
//Состояние пылесоса
// 1 - тихая уборка; 2 - стандартная уборка; 3 - интенсивная уборка; 4 - зарядка; 5 - возвращение на зарядку; 6 - выключен
// let vacuum_cleaner_state = (Math.random() * (4 - 1) + 1).toFixed()
let vacuum_cleaner_state
let state_name
let response


const mqtt = require('mqtt').connect('mqtt://dev.rightech.io', {
  //В кавычках написать идентификатор
  clientId: process.env.MQTT_CLIENTID || ''
});

mqtt.on('connect', (topic, message)=> {
  console.log(`Соединение с сервером установлено: ${new Date}\n`);
});
 
mqtt.on('message', (topic, message) => {

    if (topic.toString() === "base/relay/change_state_to_1") {
      mqtt.subscribe('base/relay/change_state_to_1', function (err, granted) {
          if (err) {
              console.error(err)
              return
          }
          // console.log('Subscribed to topic: ' + JSON.stringify(topic))
          response = message.toString()
          state_name = JSON.parse(response).name
          vacuum_cleaner_state = Number(JSON.parse(response).state)

          console.log("Получены новые данные с сервера\nСостояние пылесоса:", state_name+"\n")
      });
    }
    else if (topic.toString() === "base/relay/change_state_to_2") {
        mqtt.subscribe('base/relay/change_state_to_2', function (err, granted) {
            if (err) {
                console.error(err)
                return
            }
            response = message.toString()
            state_name = JSON.parse(response).name
            vacuum_cleaner_state = Number(JSON.parse(response).state)

            console.log("Получены новые данные с сервера\nСостояние пылесоса:", state_name+"\n")
        });
    }
    else if (topic.toString() === "base/relay/change_state_to_3") {
      mqtt.subscribe('base/relay/change_state_to_3', function (err, granted) {
          if (err) {
              console.error(err)
              return
          }
          response = message.toString()
          state_name = JSON.parse(response).name
          vacuum_cleaner_state = Number(JSON.parse(response).state)

          console.log("Получены новые данные с сервера\nСостояние пылесоса:", state_name+"\n")
      });
    }
    else if (topic.toString() === "base/relay/change_state_to_4") {
      mqtt.subscribe('base/relay/change_state_to_4', function (err, granted) {
          if (err) {
              console.error(err)
              return
          }
          response = message.toString()
          state_name = JSON.parse(response).name
          vacuum_cleaner_state = Number(JSON.parse(response).state)

          console.log("Получены новые данные с сервера\nСостояние пылесоса:", state_name+"\n")
      });
    }
    else if (topic.toString() === "base/relay/change_state_to_5") {
      mqtt.subscribe('base/relay/change_state_to_5', function (err, granted) {
          if (err) {
              console.error(err)
              return
          }
          response = message.toString()
          state_name = JSON.parse(response).name
          vacuum_cleaner_state = Number(JSON.parse(response).state)

          console.log("Получены новые данные с сервера\nСостояние пылесоса:", state_name+"\n")
      });
    }
    else if (topic.toString() === "base/relay/change_state_to_6") {
      mqtt.subscribe('base/relay/change_state_to_6', function (err, granted) {
          if (err) {
              console.error(err)
              return
          }
          response = message.toString()
          state_name = JSON.parse(response).name
          vacuum_cleaner_state = Number(JSON.parse(response).state)

          console.log("Получены новые данные с сервера\nСостояние пылесоса:", state_name+"\n")
      });
    }

});


setInterval(()=> {

  if (typeof response !== "undefined") {
    
    if (battery < 15 || dust_container_available_volume < 20) {
      vacuum_cleaner_state = 6
      state_name = "выключен"
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
          vacuum_cleaner_state = 6;
          state_name = "выключен"
      }        
  }
 
   console.log("Состояние пылесоса:", state_name);
   console.log("Осталось заряда батареи: " + battery + "%")
   console.log("Осталось свободного места в пылесборнике: " + dust_container_available_volume + " мл\n")

   mqtt.publish('base/state/vacuum_cleaner_state', vacuum_cleaner_state.toString())
   mqtt.publish('base/state/dust_container_available_volume', dust_container_available_volume.toString())
   mqtt.publish('base/state/battery', battery.toString())
   mqtt.end
  }
 

}, 2500);