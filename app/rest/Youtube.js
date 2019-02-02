import globals from '../globals';
//const ytlist = require('youtube-playlist');
const rp = require('request-promise');
const $ = require('cheerio');
const getArtistTitle = require('get-artist-title');
const lastfm = require('./LastFm');

function prepareUrl (url) {
  return `${url}&key=${globals.ytApiKey}`;
}

export function trackSearch (track) {
  return fetch(prepareUrl('https://www.googleapis.com/youtube/v3/search?part=id,snippet&type=video&maxResults=50&q=' + encodeURIComponent(track)));
}

function isValidURL (str) {
  let pattern = new RegExp('^(https?:\\/\\/)' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name and extension
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?' + // port
    '(\\/[-a-z\\d%@_.~+&:]*)*' + // path
    '(\\?[;&a-z\\d%@_.,~+&:=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return pattern.test(str);
}


const tag = {
	name: 'data-title',
	url: 'data-video-id',
	id: 'data-video-id'
};

const splitCurrentPlay = str => {
	return str.indexOf('watch') === -1 ? str : `https://www.youtube.com/playlist?list=${str.split('&list=')[1].split('&t=')[0]}`;
};

const ytListSearch = (data, opt) => {
  const url = 'https://youtube.com/watch?v=';
	return rp(splitCurrentPlay(data)).then(res => { 
    const thumb = $('tr', res);
    
		const arr = {playlist: []};

		if (!opt) {
			opt = Object.keys(tag);
		}

		const prefixUrl = (holder, marks) => holder === 'url' ? `${url}${marks}` : marks;

		const multipleDetails = Array.isArray(opt);
		arr.playlist = thumb.map((index, el) => {
			if (multipleDetails) {
				return opt.reduce((prev, holder) => {
					prev[holder] = prefixUrl(holder, el.attribs[tag[holder]]);
					return prev;
				}, {});
			}
			return prefixUrl(opt, el.attribs[tag[opt]]);
		}).get();

		return {data: arr};
	});
};

export function playlistSearch (url) {
  if (isValidURL(url)) {

    return ytListSearch(url, 'name')
      .then(res => {
        let allTracks = res.data.playlist.map((elt) => {
          let result = getArtistTitle(elt);
          if (result) {
            return lastfm.searchTracks(result[0] + ' ' + result[1], 1)
              .then(tracks => tracks.json())
              .then(tracksJson => {
                return new Promise((resolve) => {
                  resolve(tracksJson.results.trackmatches.track[0]);
                });
              });
          } else {
            return new Promise((resolve) => {
              resolve({});
            });
          }
        });
        return Promise.all(allTracks);
      })
      .catch(function () {
        return new Promise((resolve) => {
          resolve([]);
        });
      });
  } else {
    return new Promise((resolve) => {
      resolve([]);
    });
  }
}


