'use strict';

function draw_logic(){
    // Save the current buffer state.
    canvas_buffer.save();

    // Setup camera offset.
    canvas_buffer.translate(
      canvas_properties['width-half'],
      canvas_properties['height-half']
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
    let loop_counter = bodies.length - 1;
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
          'onclick': function(){
              canvas_setmode();
              core_escape();
          },
        },
      },
      'globals': {
        'bodies': [],
        'camera_x': 0,
        'camera_y': 0,
        'zoom': 1,
      },
      'info': '<input id=generate type=button value="Generate SolarSystem">',
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

              zoom = Number.parseFloat(zoom.toFixed(2));
          },
        },
      },
      'title': 'SolarSystem-2D.htm',
      'ui': 'Zoom: <span id=ui-zoom></span>',
    });
    canvas_init();
}
