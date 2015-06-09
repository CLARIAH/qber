#!/bin/bash
echo "For the RDF file specified, use its name to find the graph uri, remove the old graph"
echo "Then add the new file to Stardog under the same graph uri"
FILES=$1
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
