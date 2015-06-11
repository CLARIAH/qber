echo "Installing dependencies"
echo "Requirements: pip, npm and bower"
echo "Installation will fail if one of these is not present on your system"
pip install -r ../requirements.txt
npm install
bower install
