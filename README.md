# eztv2transmission

## What is this?

**eztv2transmission** is a simple program that automates the downloading for your favourite TV shows using eztv.ag API and your local transmission daemon.

## How to use?

Just edit the `config.json` file and run `npm install`. Once all dependencies are downloaded, run `npm start`.

For developement run `npm run dev`. To build: `npm run build`.

## Notes

* The `name` param in the config is just for internal use, and it's the name of the directory that will contain all the episodes

* You should get the `id` param from EZTV

* The `quality` param is an array ordered by priority. The quality is just a substring contained in the extra field of the episode object provided by EZTV