'use strict';

function draw_body(body){
    let offset_x = 0;
    let offset_y = 0;
    if(body['parent'] !== void 0){
        offset_x += bodies[body['parent']]['x'];
        offset_y += bodies[body['parent']]['y'];
    }

    body['rotation'] += body['speed'];
    if(body['rotation'] > 360){
        body['rotation'] -= 360;
    }else if(body['rotation'] < 0){
        body['rotation'] += 360;
    }
    body['x'] = body['orbit'] * Math.cos(body['rotation']) + offset_x;
    body['y'] = body['orbit'] * Math.sin(body['rotation']) + offset_y;

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

    if(body['moons']){
        let moonloop_counter = body['moons'].length - 1;
        do{
            draw_body(body['moons'][moonloop_counter]);
        }while(moonloop_counter--);
    }
}

function load_data(){
    bodies.length = 0;

    bodies.push({
      'color': '#' + core_random_hex(),
      'orbit': 0,
      'radius': core_random_integer({
        'max': 99,
      }) + 5,
      'rotation': 0,
      'speed': 0,
      'x': 0,
      'y': 0,
    });

    let bodyloop_counter = core_random_integer({
      'max': 5,
    }) + 1;
    do{
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

        if(core_random_boolean()){
            bodies[bodies.length - 1]['moons'] = [];

            let moonloop_counter = core_random_integer({
              'max': 2,
            }) + 1;
            do{
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
