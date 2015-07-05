# cloudstub

Provides a proxy service for the Silver Peak Cloud Portal API service that essentially passes through all but one of the API endpoints. The API endpoint that is modified is used to seed SaaS information to the acceleration appliances. This service allows the adding of new SaaS platforms to the appliances without having them officially supported.

Note that this service requires the device to be signed-up to Silver Peak Cloud Intelligence. 

## Requirements
Any server/virtual machine with node.js 0.12 and npm installed. An SSL certificate is required (as the appliances connect via HTTPS) but this can be self-signed or otherwise not matching since it isn't validated. 

## Install
Short process - download and install dependencies.
```bash
cd /var
git clone https://github.com/davefinster/cloudstub.git
cd cloudstub
npm install
```

## Usage
This will start the cloudstub server running on port 8000. For the SSL certificate, two files called server.crt and server.key will need to be added to the root directory of the project.
```bash
node index.js
```
In order to add SaaS application definitions, use the file called additional_apps.json. Add new objects to the array as shown below.

## SaaS Definitions
When a device has been successfully registered, it queries the 'cloudapplication' api and retrieves a JSON array containing objects that look like this:
```javascript
{
    saasId: <unique-numeric-identifier>,
    application: 'A SaaS Platform',
    addresses: [ 
      { 
        subnet: '8.8.8.0/24',
        reachableIp: '8.8.8.8',
        pingMethod: 'TCP',
        pingPort: 80 
      }
    ],
    domains:[
      'saas.com',
      '*.saas.com'
    ],
    threshold: '10',
    ports: [ '80', '443'],
    processedAt: null,
    enabled: false 
}
```
The 'addresses' array contains the various IP address subnets that the particular SaaS application uses. For each subnet, an IP address that is pingable must be included. This is used by the appliances to determine proximity to the SaaS servers, but not in the SSL Acceleration/Decryption process. The domains array lists the DNS names (that would otherwise appear on some sort of SSL certificate) that the SaaS application uses. 

'processedAt' always appears to be null and 'enabled' appears to be false. 

## Discovering Reachability
Included is a 'discover_reachability' script, which will have a space separated list of CIDR IP ranges and determine a host that is reachable on port 443. This is useful for populating the 'addresses' array.
```bash
node discover_reachable.js 69.63.176.0/20 66.220.144.0/20
```
produces
```javascript
[{"subnet":"69.63.176.0/20","reachableIp":"69.63.190.1","pingMethod":"TCP","pingPort":443}, {"subnet":"66.220.144.0/20","reachableIp":"66.220.156.73","pingMethod":"TCP","pingPort":443}]
```

## License

MIT.

## Bugs

See <https://github.com/davefinster/cloudstub/issues>.