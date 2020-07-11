/*
 * Example plugin template
 */

jsPsych.plugins["moving-window"] = (function() {

  var plugin = {};

  plugin.info = {
    name: "moving-window",
    parameters: {
      words: {
        type: jsPsych.plugins.parameterType.STRING, // BOOL, STRING, INT, FLOAT, FUNCTION, KEYCODE, SELECT, HTML_STRING, IMAGE, AUDIO, VIDEO, OBJECT, COMPLEX
        default: undefined
      },
      key: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        default: 32
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    // initalize some variables
    var trial_data = { words: trial.words }; // data object for the trial
    var n_words = trial.words.split(' ').length; // number of words in the trial
    var rt = []; // empty array for collecting RTs
    var current_word = 0; // current word

    // create a function for generating the stimulus with moving window
    function create_moving_window(words, position){
      var word_list = words.split(' ');
      var stimulus = word_list.map(function(word, index){
        if(index==position){
          return word;
        } else {
          return "-".repeat(word.length);
        }
      }).join(' ')
      return stimulus;
    }

    // create a function for showing the stimulus and collecting the response
    function show_stimulus(position){
      display_element.innerHTML = '<p style="font-size: 24px; font-family:monospace;">' + create_moving_window(trial.words, position) + '</p>';

      jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: [trial.key],
        rt_method: 'performance',
        persist: false,
        allow_held_key: false
      });
    }

    // create a function for handling a response
    function after_response(response_info){
      rt.push(response_info.rt);
      current_word++;
      if(current_word == n_words){
        end_trial();
      } else {
        show_stimulus(current_word);
      }
    }
    
    // create a function to handle ending the trial
    function end_trial(){
      trial_data.rt = JSON.stringify(rt);

      display_element.innerHTML = "";

      jsPsych.finishTrial(trial_data)
    }

    // show the first stimulus
    show_stimulus(current_word);
    
  };

  return plugin;
})();
