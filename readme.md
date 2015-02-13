## QBer
**Author:**	Rinke Hoekstra  
**Copyright:**	Rinke Hoekstra, VU University Amsterdam  
**License:**	MIT License (see [license.txt](license.txt))  

QBer is a tool for automatically converting CSV or SAV files that contain statistical data (currently tailored for census data) to the [RDF Data Cube vocabulary of the W3C](http://www.w3.org/TR/vocab-data-cube/).

![Screenshot of QBer](screenshot.png)

### Installation

First, open a terminal or console and clone the QBer git repository to a directory of your choice:

`git clone https://github.com/CLARIAH-SDH/qber.git`  
(you can also download the source from Github)

Change directory to directory and then (to keep things nice and tidy) use [virtualenv](https://virtualenv.pypa.io/en/latest/installation.html) to create a virtual environment, and activate it:

`virtualenv .`

and

`source bin/activate` (on unix/linux-style systems)

Then install the required Python packages using [pip](https://pip.readthedocs.org):

`pip install -r requirements.txt`

Change directory to `src` and then:

`python run.py`

the QBer application will be running on <http://localhost:5000> (click this link, or copy it to your browser).

Make sure to always activate the virtualenv before running QBer again.

### Caveat Emptor

QBer is work in progress. For it to work properly, you need to give it a pointer to the dataset to load. (and to be entirely honest, it doesn't really do very much yet)

This is currently specified in the `canada.json` and `utrecht.json` files, located in the `src/loader` directory. 
* You need to edit `views.py` to point QBer to the right JSON file.
* QBer will only load the *first* dataset listed. 
* Make sure the path inside the JSON file points to the proper data file (the path is relative to the `src` directory). 
* For CSV files, change the value for `format` to `CSV`. SPSS support has now been disabled temporarily.
* There also is the option to load a file that specifies the to-be-expected metadata for the data (this is a two-column CSV file with variable-names in the first column, and a description in the second). The `canada.json` configuration loads from `metadata/canada_1901.csv`.








