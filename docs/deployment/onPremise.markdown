Deployment of UI5 apps to on premise systems
============================================

For a more streamlined development experience it is necessary not to switch out of your development environment.
Also for developers who are not familiar with SAP technology you may want to prepare a simpler way of deploying their
UI5 application to an SAP on premise system.

To accomplish this, you need to install the node.js module `ui5-nwabap-deployer-cli` with npm (either locally or globally)
For global installation execute

```shell
npm install ui5-nwabap-deployer-cli -g
```

Please refer to the documentation of the node.js module (see references for the link) for detailed 
installation instructions and further configuration options.

Create a file called `ui5deployrc` in your project root.

```json
{
    "server": "<your on premise system url>",
    "client": "<your on premise mandate>",
    "package": "<refer to a valid package here. if you specify a local package (beginning with $) it won't get deployed>",
    "bspContainer": "<container name to store the files to>",
    "bspContainerText": "<description for the container>",
    "createTransport": true,
    "transportText": "<description of the transport request>",
    "transportUseLocked": true
}
```

These are the minimal values to let the node module create a new transport (if not exists) in your system.
With this configuration it will reuse the transport if it is locked.

To authenticate with your on premise system it is discouraged to put your credentials within the `ui5deployrc` file,
because you will include it in your VCS.
Instead you may inject your username and password from environment variables of your system, while calling the node
module from the commandline. This procedure enabled you to even process your deployment from any CI/CD system.

For this simple bash script to work, you have to export `SAP_ONPREMISE_USER` and `SAP_ONPREMISE_PASSWORD` before executing.
It is best to add your variable definitions to your `.bashrc` to have them set in every future bash session.

```shell
#!/bin/bash

rm -rf dist
npm run "build"

ui5-deployer deploy --user "${SAP_ONPREMISE_USER}" --pwd "${SAP_ONPREMISE_PASSWORD}"
```

Change this script accordingly if you use a different shell.

References
----------

- ui5-task-nwabap-deployer (<https://www.npmjs.com/package/ui5-task-nwabap-deployer>)
