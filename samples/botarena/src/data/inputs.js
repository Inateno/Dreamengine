/**
 * @ContributorsList
 * @Inateno / http://inateno.com / http://dreamirl.com
 *
 * this is the inputs list sample that will be loaded by the project
 * Please declare in the same way than this example.
 */

define( [],
function()
{
  var inputs = {
    "left"    :{"keycodes":[ 'K.a', 'K.q' ] }
    ,"right"  :{"keycodes":[ 'K.d' ] }
    ,"up"     :{"keycodes":[ 'K.z', 'K.w' ] }
    ,"down"   :{"keycodes":[ 'K.s' ] }

    ,"useMine":{"keycodes":[ 'K.space' ] }
  };
  
  return inputs;
} );