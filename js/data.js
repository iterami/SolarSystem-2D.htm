'use strict';

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
