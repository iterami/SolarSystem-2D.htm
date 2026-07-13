'use strict';

function draw_body(body){
    let offset_x = 0;
    let offset_y = 0;
    if(body.parent !== void 0){
        offset_x += bodies[body.parent].x;
        offset_y += bodies[body.parent].y;
    }

    body.period += body.speed;
    if(body.period >= 360){
        body.period -= 360;

    }else if(body.period < 0){
        body.period += 360;
    }
    body.x = body.orbit * Math.cos(body.period) + offset_x;
    body.y = body.orbit * Math.sin(body.period) + offset_y;

    canvas_draw_path({
      'properties': {
        'fillStyle': body.color,
      },
      'vertices': [
        [
          'arc',
          body.x,
          body.y,
          body.radius,
          0,
          6.283185307179586,
        ],
      ],
    });

    canvas_draw_path({
      'properties': {
        'lineWidth': Math.ceil(body.radius / 10) / zoom,
        'strokeStyle': body.color,
      },
      'style': 'stroke',
      'vertices': [
        [
          'arc',
          offset_x,
          offset_y,
          body.orbit,
          0,
          6.283185307179586,
        ],
        [
          'moveTo',
          body.x,
          body.y,
        ],
        [
          'lineTo',
          offset_x,
          offset_y,
        ],
      ],
    });

    if(body.moons){
        for(const moon of body.moons){
            draw_body(moon);
        }
    }
}

function repo_drawlogic(){
    canvas.save();
    canvas.translate(
      canvas_properties.width_half,
      canvas_properties.height_half
    );
    canvas.scale(
      zoom,
      zoom
    );
    canvas.translate(
      -camera_x,
      -camera_y
    );

    for(const body of bodies){
        draw_body(body);
    }

    canvas.restore();
}

function repo_init(){
    core_repo_init({
      'events': {
        'generate': {
          'onclick': canvas_setmode,
        },
        'reset_camera': {
          'onclick': function(){
              reset_camera();
              core_escape(false);
          },
        },
      },
      'globals': {
        'bodies': [],
        'camera_x': 0,
        'camera_y': 0,
        'zoom': 1,
      },
      'info': '<button class=medium id=generate type=button>Generate SolarSystem</button><button id=reset_camera type=button>Reset Camera</button>',
      'pointerbinds': {
        'pointermove': function(){
            if(core_pointer.down_0){
                camera_x -= core_pointer.movement_x / zoom;
                camera_y -= core_pointer.movement_y / zoom;
            }
        },
        'wheel': function(event){
            zoom += (event.wheelDelta || -event.detail) > 0
              ? .05
              : -.05;

            if(zoom < .05){
                zoom = .05;

            }else if(zoom > 5){
                zoom = 5;

            }else{
                zoom = core_round({
                  'decimals': 2,
                  'number': zoom,
                });
            }

            core_ui_update({
              'ids': {
                'zoom': zoom,
              },
            });
        },
      },
      'storage_controls': true,
      'title': 'SolarSystem-2D.htm',
      'ui': ' Zoom: <span id=zoom>1</span>',
    });
    canvas_init({
      'cursor': 'pointer',
    });
}

function repo_load(){
    reset_camera();
    core_object_reset(bodies);

    bodies.push({
      'color': '#' + core_random_hex(),
      'orbit': 0,
      'period': 0,
      'radius': core_random_integer(99) + 5,
      'speed': 0,
      'x': 0,
      'y': 0,
    });

    const bodycount = core_random_integer(5) + 1;
    for(let i = 0; i < bodycount; i++){
        bodies.push({
          'color': '#' + core_random_hex(),
          'orbit': core_random_integer(2323) + 232,
          'period': core_random_integer(360),
          'radius': core_random_integer(10) + 3,
          'speed': Math.random() / 100,
          'x': 0,
          'y': 0,
        });

        if(core_random_boolean()){
            const body = bodies[bodies.length - 1];

            body.moons = [];
            const mooncount = core_random_integer(2) + 1;
            for(let j = 0; j < mooncount; j++){
                body.moons.push({
                  'color': '#' + core_random_hex(),
                  'orbit': core_random_integer(100) + 15,
                  'parent': i,
                  'period': core_random_integer(360),
                  'radius': core_random_integer(5) + 2,
                  'speed': (Math.random() - .5) / 5,
                  'x': 0,
                  'y': 0,
                });
            }
        }
    }
}

function repo_logic(){
    if(core_keys[core_storage_data.move_down].state){
        camera_y += 10 / zoom;
    }
    if(core_keys[core_storage_data.move_left].state){
        camera_x -= 10 / zoom;
    }
    if(core_keys[core_storage_data.move_right].state){
        camera_x += 10 / zoom;
    }
    if(core_keys[core_storage_data.move_up].state){
        camera_y -= 10 / zoom;
    }
}

function reset_camera(){
    camera_x = 0;
    camera_y = 0;
    zoom = 1;

    core_ui_update({
      'ids': {
        'zoom': zoom,
      },
    });
}
