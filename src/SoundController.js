/*
  name: SoundController.js
  description: handles all audio - bg music and sound effects
*/

import AudioManager;

exports.sound = null;

// initialize the audio files if they haven't been already
exports.getSound = function () {
  if (!exports.sound) {
    exports.sound = new AudioManager({
      path: 'resources/sounds',
      files: {
        levelmusic: {
          path: 'music',
          volume: 0.5,
          background: true,
          loop: true
        },
        pop: {
          path: 'effect',
          background: false
        },
        pops: {
          path: 'effect',
          background: false
        },
        shoot: {
          path: 'effect',
          background: false
        }
      }
    });
  }
  return exports.sound;
};
