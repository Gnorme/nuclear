import Sound from 'react-sound';

import {
  START_PLAYBACK,
  PAUSE_PLAYBACK,
  UPDATE_PLAYBACK_PROGRESS,
  UPDATE_SEEK,
  UPDATE_VOLUME,
  UPDATE_PLAYBACK_STREAM_LOADING,
  ASSIGN_LAST_SONG,
  UPDATE_SONG_HISTORY,
} from '../actions/player';

import {
  NEXT_SONG,
  PREVIOUS_SONG,
  SELECT_SONG
} from '../actions/queue';

const initialState = {
  playbackStatus: Sound.status.PAUSED,
  playbackStreamLoading: false,
  playbackProgress: 0,
  seek: 0,
  volume: 100,
  previousSong: 'None',
  songHistory: []
};

export default function PlayerReducer(state=initialState, action) {
  switch (action.type) {
  case START_PLAYBACK:
    return Object.assign({}, state, {
      playbackStatus: Sound.status.PLAYING
    });
  case PAUSE_PLAYBACK:
    return Object.assign({}, state, {
      playbackStatus: Sound.status.PAUSED
    });
  case UPDATE_PLAYBACK_PROGRESS:
    return Object.assign({}, state, {
      playbackProgress: action.payload.progress,
      seek: action.payload.seek
    });
  case UPDATE_SEEK:
    return Object.assign({}, state, {
      seek: action.payload
    });
  case UPDATE_VOLUME:
    return Object.assign({}, state, {
      volume: action.payload
    });
  case NEXT_SONG:
  case PREVIOUS_SONG:
  case SELECT_SONG:
    return Object.assign({}, state, {
      playbackProgress: 0,
      seek: 0
    });
  case ASSIGN_LAST_SONG:
    return Object.assign({}, state, {
      previousSong: action.payload
    });
  case UPDATE_PLAYBACK_STREAM_LOADING:
    return Object.assign({}, state, {
      playbackStreamLoading: action.payload
    });
  case UPDATE_SONG_HISTORY:
    return Object.assign({}, state, {
      songHistory: action.payload
    });
  default:
    return state;
  }
}
