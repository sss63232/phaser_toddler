const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')

// Phaser webpack config
const phaserModule = path.join(__dirname, '/node_modules/phaser-ce/')
const phaser = path.join(phaserModule, 'build/custom/phaser-split.js')
const pixi = path.join(phaserModule, 'build/custom/pixi.js')
const p2 = path.join(phaserModule, 'build/custom/p2.js')

module.exports = {
    entry: {
        // 主程式進入點
        app: ['./src/App.es6'],
        // 少更動的 js,方便快取
        vendor: [
            'pixi',
            'p2',
            'phaser',
            './js/3rdparty/swfobject.js',
            './js/3rdparty/web_socket.js',
            // './js/Photon-Javascript_SDK.min.js'
        ]
    },
    devtool: 'cheap-source-map',
    output: {
        pathinfo: true,
        path: path.resolve(__dirname, 'dist'),
        // publicPath: './dist/',
        filename: 'bundle.js'
    },
    // watch: true,
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor' /* chunkName= */ ,
            filename: 'vendor.bundle.js' /* filename= */
        }),
        new HtmlWebpackPlugin({
            // 依據 output 路徑
            filename: '../index.html',
            // 依據該 config 檔路徑
            template: './src/index_template.html',
            chunks: ['vendor', 'app'],
            chunksSortMode: 'manual',
            minify: {
                removeAttributeQuotes: false,
                collapseWhitespace: false,
                html5: false,
                minifyCSS: false,
                minifyJS: false,
                minifyURLs: false,
                removeComments: false,
                removeEmptyAttributes: false
            },
            hash: false
        }),
        // new BrowserSyncPlugin({
        //     host: process.env.IP || 'localhost',
        //     port: process.env.PORT || 3000,
        //     server: {
        //         baseDir: ['./', './dist']
        //     }
        // }),
    ],
    module: {
        rules: [{
                test: /\.es6$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'babel-loader',
                }]
            },
            // { test: /Photon-Javascript_SDK.min\.js/, use: ['expose-loader?Photon'] },
            { test: /pixi\.js/, use: ['expose-loader?PIXI'] },
            { test: /phaser-split\.js$/, use: ['expose-loader?Phaser'] },
            { test: /p2\.js/, use: ['expose-loader?p2'] }
        ]
    },
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    },
    resolve: {
        extensions: [".js", ".es6"],
        alias: {
            'phaser': phaser,
            'pixi': pixi,
            'p2': p2
        }
    }
}