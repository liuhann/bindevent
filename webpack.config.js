var path = require('path');

module.exports = {
    entry: {
        build: './src/entry.js',
        test: './examples/js/test.js'
    },
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    externals: {

    },

    module: {
        loaders: [
            { test: /\.html/, loader:  'jqtempl-loader'}
        ]
    }
};
