#!/bin/bash

# Give permission for everything in the imagine-lacos-api directory
sudo chmod -R 777 /home/ec2-user/imagine-lacos-api

# Navigate into our working directory where we have all our GitHub files
cd /home/ec2-user/imagine-lacos-api

# Add NPM and Node to path
export NVM_DIR="$HOME/.nvm"	
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # loads nvm	
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # loads nvm bash_completion

# Install node_modules
npm install

# Start our node app in the background
node app.js > app.out.log 2> app.err.log < /dev/null & 