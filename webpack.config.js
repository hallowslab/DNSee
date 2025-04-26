const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');



module.exports = {
    mode: 'production',  // Or 'development' for dev mode
    entry: {
        main: './src/main.js',    // Entry for main.js
    },
    output: {
        path: path.resolve(__dirname, 'dist'),  // Output folder
        filename: 'assets/[name].js',  // Output JavaScript files
        clean: true,  // Clean the output folder before each build
    },
    plugins: [
        // Copy popup.html and CSS files to the dist folder
        new CopyWebpackPlugin({
            patterns: [
                { from: 'public/manifest.json', to: 'manifest.json' },  // Copy manifest file
                { from: 'src/background.js', to: 'background.js' },  // Copy manifest file
                { from: 'icons/', to: 'icons/' },  // Copy icons
            ],
        }),
        new MiniCssExtractPlugin({
            filename: 'styles.css', // Matches your <link href="styles.css">
        }),
        new HtmlWebpackPlugin({
            template: './src/popup.html',
            filename: 'popup.html',
            chunks: ['main'], // Only inject popup.js into this HTML
            inject: 'body',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        sourceType: 'module'
                    }
                }
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
        ],
    },
    devtool: 'source-map',  // Enable source maps for easier debugging
};
