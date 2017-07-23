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
        'fillStyle': solar_color,
      },
      'vertices': [
        {
          'endAngle': math_tau,
          'radius': solar_radius,
          'startAngle': 0,
          'type': 'arc',
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

function logic(){
    // Update camera position.
    if(core_keys[65]['state']){
        camera_x += 10 / zoom;
    }
    if(core_keys[68]['state']){
        camera_x -= 10 / zoom;
    }
    if(core_keys[83]['state']){
        camera_y -= 10 / zoom;
    }
    if(core_keys[87]['state']){
        camera_y += 10 / zoom;
    }
}

function repo_init(){
    core_repo_init({
      'info': '<input onclick="canvas_setmode();core_escape()" type=button value="Generate SolarSystem">',
      'keybinds': {
        65: {},
        68: {},
        83: {},
        87: {},
      },
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
      'title': 'SolarSystem-2D.htm',
    });
    canvas_init();
}

var bodies = [];
var camera_x = 0;
var camera_y = 0;
var solar_color = '';
var solar_radius = 0;
var zoom = 1;
