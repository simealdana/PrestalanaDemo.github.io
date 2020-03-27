var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var webpack = require('webpack');


module.exports = {
    devtool: 'source-map',
    entry: "./app.tsx",
    mode: "development",
    output: {
        filename: "./app-bundle.js",
        devtoolModuleFilenameTemplate: '[resource-path]'  // removes the webpack:/// prefix
    },
    resolve: {
        extensions: ['.Webpack.js', '.web.js', '.ts', '.js', '.jsx', '.tsx', '.css']
    },
    watch:true,
    plugins: [
        new BrowserSyncPlugin({
            host: 'localhost',
            port: 1337,
            files: ['./*.tsx'],
            server: { baseDir: ['./'] }
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            Popper: 'popper.js'
        })
    ],
    module: {
        rules: [
            {
                test: /\.tsx$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'ts-loader'
                }
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?[\s\S]+)?$/,
                use: [
                    {
                        loader: 'file-loader?name=[name].[ext]'
                    }
                ]
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            }
        ]
    }
};