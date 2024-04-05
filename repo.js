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
          'endAngle': 6.283185307179586,
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
          'endAngle': 6.283185307179586,
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

function repo_drawlogic(){
    canvas.save();
    canvas.translate(
      canvas_properties['width-half'],
      canvas_properties['height-half']
    );
    canvas.scale(
      zoom,
      zoom
    );
    canvas.translate(
      camera_x,
      camera_y
    );

    let loop_counter = bodies.length - 1;
    if(loop_counter >= 0){
        do{
            draw_body(bodies[loop_counter]);
        }while(loop_counter--);
    }

    canvas.restore();
}

function repo_logic(){
    if(core_mouse['down-0']){
        camera_x += core_mouse['movement-x'] / zoom;
        camera_y += core_mouse['movement-y'] / zoom;
    }
    if(core_keys[core_storage_data['move-←']]['state']){
        camera_x += 10 / zoom;
    }
    if(core_keys[core_storage_data['move-→']]['state']){
        camera_x -= 10 / zoom;
    }
    if(core_keys[core_storage_data['move-↓']]['state']){
        camera_y -= 10 / zoom;
    }
    if(core_keys[core_storage_data['move-↑']]['state']){
        camera_y += 10 / zoom;
    }

    core_ui_update({
      'ids': {
        'zoom': zoom,
      },
    });
}

function repo_init(){
    core_repo_init({
      'events': {
        'generate': {
          'onclick': core_repo_reset,
        },
      },
      'globals': {
        'bodies': [],
        'camera_x': 0,
        'camera_y': 0,
        'zoom': 1,
      },
      'info': '<button id=generate type=button>Generate SolarSystem</button>',
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

              }else{
                  zoom = core_round({
                    'decimals': 2,
                    'number': zoom,
                  });
              }
          },
        },
      },
      'reset': canvas_setmode,
      'title': 'SolarSystem-2D.htm',
      'ui': 'Zoom: <span id=zoom></span>',
    });
    canvas_init();
}
