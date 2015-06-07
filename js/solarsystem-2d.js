function draw_body(body){
    // Calculate offset.
    var offset_x = 0;
    var offset_y = 0;
    if(body['parent'] != null){
        offset_x += bodies[body['parent']]['x'];
        offset_y += bodies[body['parent']]['y'];
    }

    // Bodies orbit around their parent.
    body['rotation'] += body['speed'];
    if(body['rotation'] > 360){
        body['rotation'] -= 360;
    }else if(body['rotation'] < 0){
        body['rotation'] += 360;
    }
    body['x'] = body['orbit'] * Math.cos(body['rotation']) + offset_x;
    body['y'] = body['orbit'] * Math.sin(body['rotation']) + offset_y;

    // Draw body.
    buffer.fillStyle = body['color'];
    buffer.beginPath();
    buffer.arc(
      body['x'],
      body['y'],
      body['radius'],
      0,
      pi_times_two,
      1
    );
    buffer.closePath();
    buffer.fill();

    // Draw orbit path and line to parent, if player allows it.
    if(settings['line-orbit']
      || settings['line-parent']){
        buffer.strokeStyle = body['color'];
        buffer.lineWidth = Math.ceil(body['radius'] / 10) / zoom;

        buffer.beginPath();
        if(settings['line-orbit']){
            buffer.arc(
              offset_x,
              offset_y,
              body['orbit'],
              0,
              pi_times_two,
              1
            );
        }
        if(settings['line-parent']){
            buffer.moveTo(
              body['x'],
              body['y']
            );
            buffer.lineTo(
              offset_x,
              offset_y
            );
        }
        buffer.closePath();
        buffer.stroke();
    }

    // If no moons, we're done here.
    if(body['moons'] == undefined){
        return;
    }

    // Draw moons.
    var moonloop_counter = body['moons'].length - 1;
    do{
        draw_body(body['moons'][moonloop_counter]);
    }while(moonloop_counter--);
}

function draw(){
    buffer.clearRect(
      0,
      0,
      width,
      height
    );

    // Save the current buffer state.
    buffer.save();

    // Setup camera offset.
    buffer.translate(
      x,
      y
    );
    buffer.scale(
      zoom,
      zoom
    );
    buffer.translate(
      camera_x,
      camera_y
    );

    // Draw bodies.
    var loop_counter = bodies.length - 1;
    if(loop_counter >= 0){
        do{
            draw_body(bodies[loop_counter]);
        }while(loop_counter--);
    }

    // Draw the star.
    buffer.fillStyle = settings['solar-color'];
    buffer.beginPath();
    buffer.arc(
      0,
      0,
      settings['solar-radius'],
      0,
      pi_times_two,
      1
    );
    buffer.closePath();
    buffer.fill();

    // Restore the buffer state.
    buffer.restore();

    // Draw instructions.
    buffer.font = '23pt sans-serif';
    buffer.fillStyle = '#fff';
    buffer.fillText(
      settings['restart-key']
        + ','
        + settings['line-keys'][0]
        + ',MouseWheel,'
        + settings['line-keys'][1]
        + ','
        + settings['movement-keys'],
      0,
      23
    );
    buffer.fillText(
      zoom,
      0,
      50
    );

    canvas.clearRect(
      0,
      0,
      width,
      height
    );
    canvas.drawImage(
      document.getElementById('buffer'),
      0,
      0
    );

    window.requestAnimationFrame(draw);
}

function generate_solarsystem(){
    bodies.length = 0;

    var bodyloop_counter = random_number(5) + 1;
    var moonloop_counter = 0;
    var radius = 0;
    do{
        radius = random_number(10) + 3;

        // Create body.
        bodies.push({
          'color': '#'
            + (random_number(5) + 4)
            + (random_number(5) + 4)
            + (random_number(5) + 4),
          'orbit': random_number(2323) + 232,
          'radius': radius,
          'rotation': random_number(360),
          'speed': Math.random() / 100,
          'x': 0,
          'y': 0,
        });

        // Should this new body have moons?
        if(Math.random() < .5){
            continue;
        }

        bodies[bodies.length - 1]['moons'] = [];

        moonloop_counter = random_number(2) + 1;
        do{
            radius = random_number(5) + 2;

            // Create moon for this new body.
            bodies[bodies.length - 1]['moons'].push({
              'color': '#'
                + (random_number(5) + 4)
                + (random_number(5) + 4)
                + (random_number(5) + 4),
              'orbit': random_number(100) + 15,
              'parent': bodyloop_counter,
              'radius': radius,
              'rotation': random_number(360),
              'speed': (Math.random() - .5) / 5,
              'x': 0,
              'y': 0,
            });
        }while(moonloop_counter--);
    }while(bodyloop_counter--);

    settings['solar-color'] = '#'
      + (random_number(4) + 5)
      + (random_number(4) + 5)
      + (random_number(4) + 5);
    settings['solar-radius'] = random_number(99) + 5;
}

function logic(){
    // Update camera position.
    if(key_down){
        camera_y -= 10 / zoom;
    }
    if(key_left){
        camera_x += 10 / zoom;
    }
    if(key_right){
        camera_x -= 10 / zoom;
    }
    if(key_up){
        camera_y += 10 / zoom;
    }
}

function mouse_wheel(e){
    zoom += (e.wheelDelta || -e.detail > 0) > 0
      ? .05
      : -.05;

    if(zoom < .1){
        zoom = .1;

    }else if(zoom > 3){
        zoom = 3;
    }

    zoom = parseFloat(zoom.toFixed(2));
}

function random_number(i){
    return Math.floor(Math.random() * i);
}

function resize(){
    height = window.innerHeight;
    document.getElementById('buffer').height = height;
    document.getElementById('canvas').height = height;
    y = height / 2;

    width = window.innerWidth;
    document.getElementById('buffer').width = width;
    document.getElementById('canvas').width = width;
    x = width / 2;
}

var bodies = [];
var buffer = document.getElementById('buffer').getContext('2d');
var camera_x = 0;
var camera_y = 0;
var canvas = document.getElementById('canvas').getContext('2d');
var height = 0;
var key_down = false;
var key_left = false;
var key_right = false;
var key_up = false;
var pi_times_two = Math.PI * 2;
var settings = {
  'line-keys': 'LO',
  'line-orbit': true,
  'line-parent': true,
  'movement-keys': 'WASD',
  'restart-key': 'H',
  'solar-color': '#fff',
  'solar-radius': 1,
};
var width = 0;
var x = 0;
var y = 0;
var zoom = 1;

window.onkeydown = function(e){
    var key = String.fromCharCode(e.keyCode || e.which);

    if(key === settings['movement-keys'][1]){
        key_left = true;

    }else if(key === settings['movement-keys'][3]){
        key_right = true;

    }else if(key === settings['movement-keys'][2]){
        key_down = true;

    }else if(key === settings['movement-keys'][0]){
        key_up = true;

    }else if(key === settings['line-keys'][0]){
        settings['line-parent'] = !settings['line-parent'];

    }else if(key === settings['line-keys'][1]){
        settings['line-orbit'] = !settings['line-orbit'];

    }else if(key === settings['restart-key']){
        generate_solarsystem();
    }
};

window.onkeyup = function(e){
    var key = String.fromCharCode(e.keyCode || e.which);

    if(key === settings['movement-keys'][1]){
        key_left = false;

    }else if(key === settings['movement-keys'][3]){
        key_right = false;

    }else if(key === settings['movement-keys'][2]){
        key_down = false;

    }else if(key === settings['movement-keys'][0]){
        key_up = false;
    }
};

window.onload = function(){
    window.onresize = resize;
    resize();

    generate_solarsystem();

    if('onmousewheel' in window){
        window.onmousewheel = mouse_wheel;

    }else{
        document.addEventListener(
          'DOMMouseScroll',
          mouse_wheel,
          false
        );
    }

    window.requestAnimationFrame(draw);
    window.setInterval(
      'logic()',
      35
    );
};
