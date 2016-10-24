'use strict';

function draw_body(body){
    // Calculate offset.
    var offset_x = 0;
    var offset_y = 0;
    if(body['parent'] !== void 0){
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
    canvas_draw_path(
      [
        {
          'endAngle': math_tau,
          'radius': body['radius'],
          'startAngle': 0,
          'type': 'arc',
          'x': body['x'],
          'y': body['y'],
        },
      ],
      {
        'fillStyle': body['color'],
      }
    );

    // Draw orbit path and line to parent, if player allows it.
    if(settings_settings['line-orbit']
      || settings_settings['line-parent']){
        var vertices = [];
        if(settings_settings['line-orbit']){
            vertices.push({
              'endAngle': math_tau,
              'radius': body['orbit'],
              'startAngle': 0,
              'type': 'arc',
              'x': offset_x,
              'y': offset_y,
            });
        }
        if(settings_settings['line-parent']){
            vertices.push({
              'type': 'moveTo',
              'x': body['x'],
              'y': body['y'],
            });
            vertices.push({
              'x': offset_x,
              'y': offset_y,
            });
        }

        canvas_draw_path(
          vertices,
          {
            'strokeStyle': body['color'],
            'lineWidth': Math.ceil(body['radius'] / 10) / zoom,
          },
          'stroke'
        );
    }

    // If no moons, we're done here.
    if(body['moons'] == void 0){
        return;
    }

    // Draw moons.
    var moonloop_counter = body['moons'].length - 1;
    do{
        draw_body(body['moons'][moonloop_counter]);
    }while(moonloop_counter--);
}

function draw_logic(){
    // Save the current buffer state.
    canvas_buffer.save();

    // Setup camera offset.
    canvas_buffer.translate(
      canvas_x,
      canvas_y
    );
    canvas_buffer.scale(
      zoom,
      zoom
    );
    canvas_buffer.translate(
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
    canvas_draw_path(
      [
        {
          'endAngle': math_tau,
          'radius': settings_settings['solar-radius'],
          'startAngle': 0,
          'type': 'arc',
          'x': 0,
          'y': 0,
        },
      ],
      {
        'fillStyle': settings_settings['solar-color'],
      }
    );

    // Restore the buffer state.
    canvas_buffer.restore();

    // Draw zoom.
    canvas_buffer.fillStyle = '#fff';
    canvas_buffer.fillText(
      zoom,
      0,
      25
    );
}

function generate_solarsystem(){
    bodies.length = 0;

    var bodyloop_counter = random_integer(5) + 1;
    var moonloop_counter = 0;
    var radius = 0;
    do{
        radius = random_integer(10) + 3;

        // Create body.
        bodies.push({
          'color': '#'
            + (random_integer(5) + 4)
            + (random_integer(5) + 4)
            + (random_integer(5) + 4),
          'orbit': random_integer(2323) + 232,
          'radius': radius,
          'rotation': random_integer(360),
          'speed': Math.random() / 100,
          'x': 0,
          'y': 0,
        });

        // Should this new body have moons?
        if(random_boolean()){
            continue;
        }

        bodies[bodies.length - 1]['moons'] = [];

        moonloop_counter = random_integer(2) + 1;
        do{
            radius = random_integer(5) + 2;

            // Create moon for this new body.
            bodies[bodies.length - 1]['moons'].push({
              'color': '#'
                + (random_integer(5) + 4)
                + (random_integer(5) + 4)
                + (random_integer(5) + 4),
              'orbit': random_integer(100) + 15,
              'parent': bodyloop_counter,
              'radius': radius,
              'rotation': random_integer(360),
              'speed': (Math.random() - .5) / 5,
              'x': 0,
              'y': 0,
            });
        }while(moonloop_counter--);
    }while(bodyloop_counter--);

    settings_settings['solar-color'] = '#'
      + (random_integer(4) + 5)
      + (random_integer(4) + 5)
      + (random_integer(4) + 5);
    settings_settings['solar-radius'] = random_integer(99) + 5;
}

function logic(){
    // Update camera position.
    if(key_down){
        camera_y -= settings_settings['camera-speed'] / zoom;
    }
    if(key_left){
        camera_x += settings_settings['camera-speed'] / zoom;
    }
    if(key_right){
        camera_x -= settings_settings['camera-speed'] / zoom;
    }
    if(key_up){
        camera_y += settings_settings['camera-speed'] / zoom;
    }
}

function mouse_wheel(e){
    zoom += (e.wheelDelta || -e.detail) > 0
      ? .05
      : -.05;

    if(zoom < .1){
        zoom = .1;

    }else if(zoom > 3){
        zoom = 3;
    }

    zoom = parseFloat(zoom.toFixed(2));
}

var bodies = [];
var camera_x = 0;
var camera_y = 0;
var drag = false;
var drag_x = 0;
var drag_y = 0;
var key_down = false;
var key_left = false;
var key_right = false;
var key_up = false;
var zoom = 1;

window.onkeydown = function(e){
    var key = String.fromCharCode(e.keyCode || e.which);

    if(key === settings_settings['movement-keys'][1]){
        key_left = true;

    }else if(key === settings_settings['movement-keys'][3]){
        key_right = true;

    }else if(key === settings_settings['movement-keys'][2]){
        key_down = true;

    }else if(key === settings_settings['movement-keys'][0]){
        key_up = true;

    }else if(key === settings_settings['line-keys'][0]){
        settings_settings['line-parent'] = !settings_settings['line-parent'];

    }else if(key === settings_settings['line-keys'][1]){
        settings_settings['line-orbit'] = !settings_settings['line-orbit'];

    }else if(key === settings_settings['restart-key']){
        generate_solarsystem();
    }
};

window.onkeyup = function(e){
    var key = String.fromCharCode(e.keyCode || e.which);

    if(key === settings_settings['movement-keys'][1]){
        key_left = false;

    }else if(key === settings_settings['movement-keys'][3]){
        key_right = false;

    }else if(key === settings_settings['movement-keys'][2]){
        key_down = false;

    }else if(key === settings_settings['movement-keys'][0]){
        key_up = false;
    }
};

window.onload = function(){
    canvas_init();
    settings_init(
      'SolarSystem-2D.htm-',
      {
        'camera-speed': 10,
        'line-keys': 'LO',
        'line-orbit': true,
        'line-parent': true,
        'movement-keys': 'WASD',
        'restart-key': 'H',
        'solar-color': '#fff',
        'solar-radius': 1,
      }
    );
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
};

window.onmousedown =
  window.ontouchstart = function(e){
    drag = true;
    drag_x = e.pageX;
    drag_y = e.pageY;
};

window.onmousemove =
  window.ontouchmove = function(e){
    if(!drag){
        return;
    }

    camera_x -= (drag_x - e.pageX) / zoom;
    camera_y -= (drag_y - e.pageY) / zoom;
    drag_x = e.pageX;
    drag_y = e.pageY;
};

window.onmouseup =
  window.ontouchend = function(e){
    drag = false;
};
