'use strict';

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

    // Restore the buffer state.
    canvas_buffer.restore();
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

    core_ui_update({
      'ids': {
        'zoom': zoom,
      },
    });
}

function repo_init(){
    core_repo_init({
      'info': '<input id=generate type=button value="Generate SolarSystem">',
      'info-events': {
        'generate': {
          'todo': function(){
              canvas_setmode();
              core_escape();
          },
        },
      },
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
      'ui': 'Zoom: <span id=ui-zoom></span>',
    });
    canvas_init();
}

var bodies = [];
var camera_x = 0;
var camera_y = 0;
var zoom = 1;
