import eztv from 'eztv';
import config from '../config';
import fs from 'fs';
import Transmission from 'transmission';
var transmission = new Transmission({
	host: 'localhost',
	username: config.username,
	password: config.password
});

const getShow = (showId, cb) => {
  const episodes = {};
  
  eztv.getShowEpisodes(showId, (error, results) => {
    results.episodes.map((ep) => {
      if (!episodes[`s${ep.seasonNumber}`]) {
        episodes[`s${ep.seasonNumber}`] = {};
      }
      if (!episodes[`s${ep.seasonNumber}`][`e${ep.episodeNumber}`]) {
        episodes[`s${ep.seasonNumber}`][`e${ep.episodeNumber}`] = [];
      }

      episodes[`s${ep.seasonNumber}`][`e${ep.episodeNumber}`].push(ep);
    });
    
    cb(episodes);
  });
}

const getPath = (sNum, eNum) => 'S'+ ('0' + sNum).slice(-2) + 'E' + ('0' + eNum).slice(-2);

const run = () => {
  config.shows.map((show) => {
    console.log(`Sync for ${show.name}`);
    const showPath = `${config.savePath}/${show.name}`;
    if (!fs.existsSync(showPath)) {
      console.log('Creating path directory...');
      fs.mkdirSync(showPath);
    }
  
    getShow(show.id, (episodes) => {
      Object.keys(episodes).map((season) => {
        Object.keys(episodes[season]).map((episode) => {
          let found = false;
          show.quality.map((quality) => {
            if (!found) {
              episodes[season][episode].map((ep) => {
                if (ep.extra.indexOf(quality) > -1 && !found) {
                  found = true;
                  const epPath = showPath + '/' + getPath(ep.seasonNumber, ep.episodeNumber) + '/';
                  if (!fs.existsSync(epPath) && ep.seasonNumber === 5 && ep.episodeNumber === 3) {
                    console.log(`Downloading ${epPath}`);
                    transmission.addUrl(ep.magnet, {
                      "download-dir" : epPath
                    }, function(err, result) {
                        if (err) {
                            return console.log(err);
                        }
                        var id = result.id;
                        console.log('Just added a new torrent.');
                        console.log('Torrent ID: ' + id);
                    });
                  }
                }
              });
            }
          })
        })
      })
    });
  });
}
