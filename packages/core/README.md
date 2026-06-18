Structure of proyect:
.
├── packages
│   ├── core
│   │   ├── dist
│   │   │   ├── index.esm.js
│   │   │   ├── index.esm.js.map
│   │   │   ├── index.js
│   │   │   └── index.js.map
│   │   ├── src
│   │   │   ├── actions
│   │   │   │   ├── auth.js
│   │   │   │   ├── Database.js
│   │   │   │   ├── Queries.js
│   │   │   │   └── RealTime.js
│   │   │   ├── firebase
│   │   │   │   └── firebase.js
│   │   │   ├── slices
│   │   │   │   ├── firestoreSlice.js
│   │   │   │   └── storageSlice.js
│   │   │   ├── store
│   │   │   │   └── store.js
│   │   │   ├── utils
│   │   │   │   ├── buildQueryParameters.js
│   │   │   │   └── resolveReferences.js
│   │   │   └── index.js
│   │   ├── .babelrc
│   │   ├── package.json
│   │   ├── README.md
│   │   └── rollup.config.js
│   ├── example-angular
│   ├── example-react
│   │   ├── public
│   │   ├── src
│   │   │   ├── components
│   │   │   │   ├── TodoModal.js
│   │   │   │   └── TodoTable.js
│   │   │   ├── App.js
│   │   │   ├── index.css
│   │   │   └── index.js
│   │   ├── .env
│   │   ├── .gitignore
│   │   ├── package.json
│   │   └── README.md
│   ├── example-simple
│   │   ├── config.js
│   │   └── index.html
│   └── example-vue
├── tests
├── .gitignore
├── LICENSE
├── package.json
├── package-lock.json
└── README.md