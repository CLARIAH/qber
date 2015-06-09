#!/bin/bash
echo "Downloading SDH RDF files from Dropbox"
wget -O rdf.zip https://www.dropbox.com/sh/2lz1zwgtuvt7kwc/AAASZIMIks6qgp1OpI-ZO5X9a?dl=1
echo "Done"
echo "Unzipping..."
unzip rdf.zip
echo "Done"
echo "For all RDF files, use their name as graph uri and remove the graph from Stardog"
echo "Then add the new file to Stardog under the same graph uri"
FILES=*.ttl
DATASET="qber"
for f in $FILES
do
  SHORT=${f%.ttl}
  GRAPH="http://data.socialhistory.org/resource/graph/$SHORT"
  echo "Processing $SHORT file in graph $GRAPH..."
  stardog data remove -g $GRAPH $DATASET
  echo "Removed old version"
  stardog data add -g $GRAPH $DATASET $f
  echo "Added new version"
done
echo "Done"
