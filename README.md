# qb-oauth
a quick class demonstrating an OAuth2.0 implementation - in this case the Quickbooks api using the node library

These modules can be exported to a server.js file, implemented as middleware, and utilized in an application that uses the OAuth2.0 standard - even for server-to-server communication.  I wrote this while working with the Quickbooks API which requires the full OAuth2.0 process, so the OAuth routes wrap an application that can access the Quickbooks API

Would take a config file with the authorization endpoints and necessary keys.  Example:

```json
{
    "DISCOVERY_URL": "https://developer.intuit.com/.well-known/openid_sandbox_configuration/",
    "CLIENT_ID": YOUR_ID,
    "CLIENT_SECRET": YOUR_SECRET,
    "useSandbox" : true,
}
```
