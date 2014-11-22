function draw_body(id){
    // Bodies orbit around their parent.
    bodies[id][6] += bodies[id][5];
    if(bodies[id][6] > 360){
        bodies[id][6] -= 360;
    }else if(bodies[id][6] < 0){
        bodies[id][6] += 360;
    }
    bodies[id][0] = bodies[id][4] * Math.cos(bodies[id][6]);
    bodies[id][1] = bodies[id][4] * Math.sin(bodies[id][6]);

    // Draw body.
    canvas.fillStyle = bodies[id][7];
    canvas.beginPath();
    canvas.arc(
      bodies[id][0],
      bodies[id][1],
      bodies[id][2],
      0,
      pi_times_two,
      1
    );
    canvas.closePath();
    canvas.fill();

    // Draw orbit path and line to parent, if player allows it.
    if(settings['line-orbit']
      || settings['line-parent']){
        canvas.strokeStyle = bodies[id][7];
        canvas.lineWidth = Math.ceil(bodies[id][2] / 10) / zoom;

        canvas.beginPath();
        if(settings['line-orbit']){
            canvas.arc(
              0,
              0,
              bodies[id][4],
              0,
              pi_times_two,
              1
            );
        }
        if(settings['line-parent']){
            canvas.moveTo(
              bodies[id][0],
              bodies[id][1]
            );
            canvas.lineTo(
              0,
              0
            );
        }
        canvas.closePath();
        canvas.stroke();
    }

    // If no moons, we're done here.
    if(bodies[id][8] == 0){
        return;
    }

    // Draw moons.
    var moonloop_counter = bodies[id][8].length - 1;
    if(moonloop_counter >= 0){
        do{
            bodies[id][8][moonloop_counter][6] += bodies[id][8][moonloop_counter][5];
            if(bodies[id][8][moonloop_counter][6] > 360){
                bodies[id][8][moonloop_counter][6] -= 360;
            }else if(bodies[id][8][moonloop_counter][6] < 0){
                bodies[id][8][moonloop_counter][6] += 360;
            }
            bodies[id][8][moonloop_counter][0] =
              bodies[id][8][moonloop_counter][4]
              * Math.cos(bodies[id][8][moonloop_counter][6])
              + bodies[id][0];
            bodies[id][8][moonloop_counter][1] =
              bodies[id][8][moonloop_counter][4]
              * Math.sin(bodies[id][8][moonloop_counter][6])
              + bodies[id][1];

            canvas.fillStyle = bodies[id][8][moonloop_counter][7];
            canvas.beginPath();
            canvas.arc(
              bodies[id][8][moonloop_counter][0],
              bodies[id][8][moonloop_counter][1],
              bodies[id][8][moonloop_counter][2],
              0,
              pi_times_two,
              1
            );
            canvas.closePath();
            canvas.fill();

            // Draw orbit path and line to parent, if player allows it.
            if(settings['line-orbit']
              || settings['line-parent']){
                canvas.strokeStyle = bodies[id][8][moonloop_counter][7];
                canvas.lineWidth = Math.ceil(bodies[id][8][moonloop_counter][2] / 10) / zoom;

                canvas.beginPath();
                if(settings['line-orbit']){
                    canvas.arc(
                      bodies[id][0],
                      bodies[id][1],
                      bodies[id][8][moonloop_counter][4],
                      0,
                      pi_times_two,
                      1
                    );
                }
                if(settings['line-parent']){
                    canvas.moveTo(
                      bodies[id][0],
                      bodies[id][1]
                    );
                    canvas.lineTo(
                      bodies[id][8][moonloop_counter][0],
                      bodies[id][8][moonloop_counter][1]
                    );
                }
                canvas.closePath();
                canvas.stroke();
            }
        }while(moonloop_counter--);
    }
}

function draw(){
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

    canvas.clearRect(
      0,
      0,
      width,
      height
    );

    // Save the current canvas state.
    canvas.save();

    // Setup camera offset.
    canvas.translate(
      x,
      y
    );
    canvas.scale(
      zoom,
      zoom
    );
    canvas.translate(
      camera_x,
      camera_y
    );

    // Draw bodies.
    var loop_counter = bodies.length - 1;
    if(loop_counter >= 0){
        do{
            draw_body(loop_counter);
        }while(loop_counter--);
    }

    // Draw the star.
    canvas.fillStyle = settings['solar-color'];
    canvas.beginPath();
    canvas.arc(
      0,
      0,
      settings['solar-radius'],
      0,
      pi_times_two,
      1
    );
    canvas.closePath();
    canvas.fill();

    // Restore the canvas state.
    canvas.restore();

    // Draw instructions.
    canvas.font = '23pt sans-serif';
    canvas.fillStyle = '#fff';
    canvas.fillText(
      'H,L,MouseWheel,O,WASD',
      0,
      23
    );
    canvas.fillText(
      zoom,
      0,
      50
    );
}

function generate_solarsystem(){
    bodies.length = 0;

    var bodyloop_counter = random_number(5) + 1;
    var moonloop_counter = 0;
    var radius = 0;
    do{
        radius = random_number(10) + 3;

        // Create body.
        bodies.push([
          0,
          0,
          radius,
          radius,
          random_number(2323) + 232,
          Math.random() / 100,
          random_number(360),
          '#'
            + (random_number(5) + 4)
            + (random_number(5) + 4)
            + (random_number(5) + 4),
          0,
        ]);

        // Should this new body have moons?
        if(Math.random() > .5){
            bodies[bodies.length - 1][8] = [];

            moonloop_counter = random_number(2) + 1;
            do{
                radius = random_number(5) + 2;

                // Create moon for this new body.
                bodies[bodies.length - 1][8].push([
                  0,
                  0,
                  radius,
                  radius,
                  random_number(100) + 15,
                  (Math.random() - .5) / 5,
                  random_number(360),
                  '#'
                    + (random_number(5) + 4)
                    + (random_number(5) + 4)
                    + (random_number(5) + 4),
                  bodies.length - 1
                ]);
            }while(moonloop_counter--);
        }
    }while(bodyloop_counter--);

    settings['solar-color'] = '#'
        + (random_number(4) + 5)
        + (random_number(4) + 5)
        + (random_number(4) + 5);
    settings['solar-radius'] = random_number(99) + 5;
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
    document.getElementById('canvas').height = height;
    y = height / 2;

    width = window.innerWidth;
    document.getElementById('canvas').width = width;
    x = width / 2;
}

var bodies = [];
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
  'line-orbit': true,
  'line-parent': true,
  'solar-color': '#fff',
  'solar-radius': 1,
};
var width = 0;
var x = 0;
var y = 0;
var zoom = 1;

generate_solarsystem();

window.onresize = resize;
resize();

if('onmousewheel' in window){
    window.onmousewheel = mouse_wheel;

}else{
    document.addEventListener(
      'DOMMouseScroll',
      mouse_wheel,
      false
    );
}

setInterval(
  'draw()',
  35
);

window.onkeydown = function(e){
    var key = e.keyCode || e.which;

    if(key === 65){ // A
        key_left = true;

    }else if(key === 68){ // D
        key_right = true;

    }else if(key === 83){ // S
        key_down = true;

    }else if(key === 87){ // W
        key_up = true;

    }else if(key === 76){ // L
        settings['line-parent'] = !settings['line-parent'];

    }else if(key === 79){ // O
        settings['line-orbit'] = !settings['line-orbit'];

    }else if(key === 72){ // H
        generate_solarsystem();
    }
};

window.onkeyup = function(e){
    var key = e.keyCode || e.which;

    if(key === 65){ // A
        key_left = false;

    }else if(key === 68){ // D
        key_right = false;

    }else if(key === 83){ // S
        key_down = false;

    }else if(key === 87){ // W
        key_up = false;
    }
};
