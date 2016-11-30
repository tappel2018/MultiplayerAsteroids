function clientWrapper (socket, name, uuid) {
  var myself = this;
  this.socket = socket;
  this.name = name;
  this.uuid = uuid;
  this.connectTime = new Date();
  console.log(clientWrapper.angle);
  this.color = HSVtoHex(360*clientWrapper.angle, 1.0, 0.7);
  clientWrapper.angle += 0.61803398875;
  clientWrapper.angle %= 1;

  console.log(this.uuid);

  this.disconnect = function() {
    console.log("Player disconnected: " + myself.uuid);
    return;
  }

  this.receiveMessage = function(data) {
    console.log(myself.uuid);
    console.log("User: " + myself.uuid + " / Message: " + data.msg)
    if (data.msg != "") {
      clients.forEach(function(c) {
        c.socket.emit("messageFromServer", {msg: myself.name + ": " + data.msg, color: myself.color})
      })
    }
    return;
  }

  this.socket.on('disconnect', this.disconnect);
  this.socket.on('message', this.receiveMessage);


}

clientWrapper.angle=0.0;

var HSVtoHex = function(h, s, v) {
  var rgb, i, data = [];
  if (s === 0) {
    rgb = [v,v,v];
  } else {
    h = h / 60;
    i = Math.floor(h);
    data = [v*(1-s), v*(1-s*(h-i)), v*(1-s*(1-(h-i)))];
    switch(i) {
      case 0:
        rgb = [v, data[2], data[0]];
        break;
      case 1:
        rgb = [data[1], v, data[0]];
        break;
      case 2:
        rgb = [data[0], v, data[2]];
        break;
      case 3:
        rgb = [data[0], data[1], v];
        break;
      case 4:
        rgb = [data[2], data[0], v];
        break;
      default:
        rgb = [v, data[0], data[1]];
        break;
    }
  }
  return '#' + rgb.map(function(x){
    return ("0" + Math.round(x*255).toString(16)).slice(-2);
  }).join('');
};


module.exports = clientWrapper;