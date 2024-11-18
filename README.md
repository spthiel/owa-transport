# OWA Transport

## Setup

Copy the config.example.json to config.json and modify the values to your needs.

## Building

`npm run start`

## Usage

Copy the contents of the dist/index.js file into your preferred user-script browser extension and reload the OWA.

## TODO

- [x] Inject elements add the correct location
- [x] Add import and export button
- [x] Add dialog
- [ ] Add minimal required elements to dialog (title, close button)
- [x] Obtain existing inbox rules from outlook via service api
- [ ] Filter rule values to actually set values
- [ ] Implement multi-select for rules to export
- [ ] Implement export functionality
- [ ] Implement import functionality
- [ ] Display required categories before import
- [ ] Automatically create categories after import