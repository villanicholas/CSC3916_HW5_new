#!/bin/bash

# Build the React app
npm run build

# Move the build files to the server's public directory if needed
# uncomment and modify the line below if you need to copy to a specific location
# cp -r build/* ../path/to/server/public/ 