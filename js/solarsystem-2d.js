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
    canvas_draw_path({
      'properties': {
        'fillStyle': body['color'],
      },
      'vertices': [
        {
          'endAngle': math_tau,
          'radius': body['radius'],
          'startAngle': 0,
          'type': 'arc',
          'x': body['x'],
          'y': body['y'],
        },
      ],
    });

    // Draw orbit path and line to parent, if player allows it.
    if(core_storage_data['line-orbit']
      || core_storage_data['line-parent']){
        var vertices = [];
        if(core_storage_data['line-orbit']){
            vertices.push({
              'endAngle': math_tau,
              'radius': body['orbit'],
              'startAngle': 0,
              'type': 'arc',
              'x': offset_x,
              'y': offset_y,
            });
        }
        if(core_storage_data['line-parent']){
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

        canvas_draw_path({
          'properties': {
            'strokeStyle': body['color'],
            'lineWidth': Math.ceil(body['radius'] / 10) / zoom,
          },
          'style': 'stroke',
          'vertices': vertices,
        });
    }

    // Draw moons.
    if(body['moons']){
        var moonloop_counter = body['moons'].length - 1;
        do{
            draw_body(body['moons'][moonloop_counter]);
        }while(moonloop_counter--);
    }
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
    canvas_draw_path({
      'properties': {
        'fillStyle': core_storage_data['solar-color'],
      },
      'vertices': [
        {
          'endAngle': math_tau,
          'radius': core_storage_data['solar-radius'],
          'startAngle': 0,
          'type': 'arc',
          'x': 0,
          'y': 0,
        },
      ],
    });

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

    var bodyloop_counter = core_random_integer({
      'max': 5,
    }) + 1;
    do{
        var radius = core_random_integer({
          'max': 10,
        }) + 3;

        // Create body.
        bodies.push({
          'color': '#' + core_random_hex(),
          'orbit': core_random_integer({
            'max': 2323,
          }) + 232,
          'radius': radius,
          'rotation': core_random_integer({
            'max': 360,
          }),
          'speed': Math.random() / 100,
          'x': 0,
          'y': 0,
        });

        // Should this new body have moons?
        if(core_random_boolean()){
            bodies[bodies.length - 1]['moons'] = [];

            var moonloop_counter = core_random_integer({
              'max': 2,
            }) + 1;
            do{
                radius = core_random_integer({
                  'max': 5,
                }) + 2;

                // Create moon for this new body.
                bodies[bodies.length - 1]['moons'].push({
                  'color': '#'+ core_random_hex(),
                  'orbit': core_random_integer() + 15,
                  'parent': bodyloop_counter,
                  'radius': radius,
                  'rotation': core_random_integer({
                    'max': 360,
                  }),
                  'speed': (Math.random() - .5) / 5,
                  'x': 0,
                  'y': 0,
                });
            }while(moonloop_counter--);
        }
    }while(bodyloop_counter--);

    core_storage_data['solar-color'] = '#'+ core_random_hex();
    core_storage_data['solar-radius'] = core_random_integer({
      'max': 99,
    }) + 5;
}

function logic(){
    // Update camera position.
    if(core_keys[core_storage_data['movement-keys'].charCodeAt(2)]['state']){
        camera_y -= core_storage_data['camera-speed'] / zoom;
    }
    if(core_keys[core_storage_data['movement-keys'].charCodeAt(1)]['state']){
        camera_x += core_storage_data['camera-speed'] / zoom;
    }
    if(core_keys[core_storage_data['movement-keys'].charCodeAt(3)]['state']){
        camera_x -= core_storage_data['camera-speed'] / zoom;
    }
    if(core_keys[core_storage_data['movement-keys'].charCodeAt(0)]['state']){
        camera_y += core_storage_data['camera-speed'] / zoom;
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

function repo_init(){
    core_storage_init({
      'data': {
        'camera-speed': 10,
        'line-keys': 'LO',
        'line-orbit': true,
        'line-parent': true,
        'movement-keys': 'WASD',
        'restart-key': 'H',
        'solar-color': '#fff',
        'solar-radius': 1,
      },
      'prefix': 'SolarSystem-2D.htm-',
    });
    var keybinds = {};
    keybinds[core_storage_data['line-keys'][0]] = {
      'todo': function(){
          core_storage_data['line-parent'] = !core_storage_data['line-parent'];
      },
    };
    keybinds[core_storage_data['line-keys'][1]] = {
      'todo': function(){
          core_storage_data['line-orbit'] = !core_storage_data['line-orbit'];
      },
    };
    keybinds[core_storage_data['movement-keys'][0]] = {};
    keybinds[core_storage_data['movement-keys'][1]] = {};
    keybinds[core_storage_data['movement-keys'][2]] = {};
    keybinds[core_storage_data['movement-keys'][3]] = {};
    keybinds[core_storage_data['restart-key']] = {
      'todo': generate_solarsystem,
    };
    core_events_bind({
      'keybinds': keybinds,
      'mousebinds': {
        'mousedown': {},
        'mousemove': {},
        'mousewheel': {
          'todo': function(event){
              zoom += (event.wheelDelta || -event.detail) > 0
                ? .05
                : -.05;

              if(zoom < .1){
                  zoom = .1;

              }else if(zoom > 3){
                  zoom = 3;
              }

              zoom = parseFloat(zoom.toFixed(2));
          },
        },
      },
    });
    canvas_init();
    generate_solarsystem();
}

var bodies = [];
var camera_x = 0;
var camera_y = 0;
var zoom = 1;
