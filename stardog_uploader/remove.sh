#!/bin/bash
echo "For the RDF file specified, use its name to find the graph uri and remove the graph"
FILES=$1
DATASET="qber"
for f in $FILES
do
  SHORT=${f%.ttl}
  GRAPH="http://data.socialhistory.org/resource/graph/$SHORT"
  echo "Processing $SHORT file in graph $GRAPH..."
  stardog data remove -g $GRAPH $DATASET
  echo "Removed the graph"
done
echo "Done"
