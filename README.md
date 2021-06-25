# Aquila Probe

Aquila Probe is the agent that send informations to Aquila Management.
In addition to the information retrievals that have been developed, a "scripts" folder is available to add server-specific Bash scripts.
So, you can also use this project as an interface between HTTP requests and Bash scripts.

## Getting Started

1. yarn install

If you want to run it in a production mode :
2. cp ecosystem.config.example.cjs ecosystem.config.cjs
3. npm run start:pm2

If you want to run it in a development mode :
2. npm run start:dev