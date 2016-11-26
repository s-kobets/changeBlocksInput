
//определение переменной окружения
const NODE_ENV = process.env.NODE_ENV || "development";
const webpack = require('webpack');
const ExtractTextPlugin = require ('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './static_src/js/index.js',
    output: {
        path: __dirname + "/public",
        filename: "index.js"
        // library: "ScrollTo" // global name
    },

    watch: NODE_ENV == "development",

    //ждет 100мс а потом запускает сборку во время watch
    watchOptions: {
        aggregateTimeout: 100
    },

    devtool: NODE_ENV == "development" ? "cheap-module-inline-source-map" : null,

    plugins:[
        new webpack.DefinePlugin({ //делаем ключ NODE_ENV доступный клиенту
            NODE_ENV : JSON.stringify(NODE_ENV),  //делает строковым типом
            LANG     : JSON.stringify('ru')
        }),
        new ExtractTextPlugin('[name].css', {allChunks: true}),
        //one HTML file
        new HtmlWebpackPlugin({
            filename: 'index.html',
            inject : true,
            devServer: 'http://localhost:8080',
            template: './static_src/index.jade',
            chunks: 'filename'
        })
    ],

    resolve: { //указывает где искать модули, например ./static_src/scripts/main.js
        modulesDirectories: ['node_modules'],
        extensions: ['','.js']
    },

    resolveLoader: { //указывает где искать модули для loaders например babel
        modulesDirectories: ['node_modules'],
        moduleTemplates: ['*-loader', '*'],
        extensions: ['','.js']
    },

    module: { //устанавливаем нужные модули -- npm i имя
        loaders: [
            // js
            {
                test: /\.(js|jsx)$/,   //файлы заканчивающиеся на .js, применим babel      
                loader: "babel"
                // ,exclude: /(parsleyjs)/
            },
            // css
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
            },
            // stylus
            {
              test:   /\.styl$/,
              loader: ExtractTextPlugin.extract('css!autoprefixer?browsers=last 2 versions!stylus?resolve url')
            },
            // html
            {
              test: /\.jade$/,
              loader: 'jade'
            },
            // Copy images
            {
                test: /\.(png|jpg|gif|svg)/,
                loader: "file-loader?name=[path][name].[ext]"
            },
            // Copy fonts
            {
                test: /\.(woff2?|ttf|eot)/,
                loaders: ['file']
            }

        ]
    },
    eslint: {
        configFile: __dirname + '.eslintrc'
    }
};

if (NODE_ENV == 'production'){  // для минификации кода
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,  //не нужно предупреждений
                drop_console: true,  //убрать сonsole.log
                unsafe: true  //небезопасные штуки использовать
            }
        })
    );
}
    


