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
    canvas_draw_path({
      'properties': {
        'strokeStyle': body['color'],
        'lineWidth': Math.ceil(body['radius'] / 10) / zoom,
      },
      'style': 'stroke',
      'vertices': [
        {
          'endAngle': math_tau,
          'radius': body['orbit'],
          'startAngle': 0,
          'type': 'arc',
          'x': offset_x,
          'y': offset_y,
        },
        {
          'type': 'moveTo',
          'x': body['x'],
         'y': body['y'],
        },
        {
          'x': offset_x,
          'y': offset_y,
        },
      ],
    });

    // Draw moons.
    if(body['moons']){
        var moonloop_counter = body['moons'].length - 1;
        do{
            draw_body(body['moons'][moonloop_counter]);
        }while(moonloop_counter--);
    }
}

function load_data(){
    bodies.length = 0;
    solar_color = '#' + core_random_hex();
    solar_radius = core_random_integer({
      'max': 99,
    }) + 5;

    var bodyloop_counter = core_random_integer({
      'max': 5,
    }) + 1;
    do{
        // Create body.
        bodies.push({
          'color': '#' + core_random_hex(),
          'orbit': core_random_integer({
            'max': 2323,
          }) + 232,
          'radius': core_random_integer({
            'max': 10,
          }) + 3,
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
                // Create moon for this new body.
                bodies[bodies.length - 1]['moons'].push({
                  'color': '#'+ core_random_hex(),
                  'orbit': core_random_integer() + 15,
                  'parent': bodyloop_counter,
                  'radius': core_random_integer({
                    'max': 5,
                  }) + 2,
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
}
