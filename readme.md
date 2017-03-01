## QBer
**Author:**	Rinke Hoekstra  
**Copyright:**	Rinke Hoekstra, VU University Amsterdam  
**License:**	MIT License (see [license.txt](license.txt))  

QBer is a tool for automatically converting CSV or SAV files that contain statistical data (currently tailored for census data) to the [RDF Data Cube vocabulary of the W3C](http://www.w3.org/TR/vocab-data-cube/).

### Installation

##### Prerequisites

* Make sure you have a working version of the [CSDH API](https://github.com/CLARIAH/wp4-csdh-api) running (or can connect to one hosted elsewhere).


#### Running Qber

###### Using docker
* Make sure you have docker and docker-compose installed
* Run `docker-compose build` (this step can be removed when this img is pushed to docker hub)
* Optionally update the `docker-compose.yml` file to change the `CSDH_API` URL.
* Run `docker-compose up` to start qber.
* Qber is now running at `http://localhost:8000`

###### Locally

* Make sure you have [Node.js](http://nodejs.org) installed, including its package manager `npm`. Test this by running e.g. `npm --version` in a terminal window.
* If you don't have it, follow the instructions at [Node.js](http://nodejs.org). For MacOS users, we recommend you use [Homebrew](http://brew.sh) to install `npm` and its dependencies: `brew install npm`
* Clone the `master` branch of this repository to a directory of your choice: `git clone https://github.com/CLARIAH/qber.git`
* Change into the folder you just created, and run: `npm install`
* Edit the `QBerAPI.js` file in the `src/js/utils` directory and set the `CSDH_API` variable to the HTTP address of the CSDH instance of your choice, e.g.: `var CSDH_API = "http://localhost:5000"`
* To start qber:
  * In development mode: `npm run dev`
  * In production mode:
     * First build qber: `npm run build`
     * Then start qber: `npm run serve`
* Qber is now running at `http://localhost:8000`



#### Known issues

QBer has only been tested using the Google Chrome browser. Other browsers may not work as expected (e.g. Safari doesn't always show the login button)

If you experience any unexpected behavior, please report it using the GitHub issues tracker.
