# OWA Transport

## Setup

Copy the config.example.json to config.json and modify the values to your needs.

## Building

`npm run start`

## Usage

Copy the contents of the dist/index.js file into your preferred user-script browser extension and reload the OWA.

## TODO

- [x] Create template engine
- [x] Inject elements add the correct location
- [x] Add import and export button
- [x] Add dialog
- [x] Add minimal required elements to dialog (title, close button)
- [x] Obtain existing inbox rules from outlook via service api
- [x] Filter rule values to actually set values
- [x] Implement multi-select for rules to export
- [x] Implement export functionality
- [ ] Implement import functionality
- [ ] Display required categories before import
- [ ] Automatically create categories after import
- [ ] Implement export and import of folder data
- [ ] Aria