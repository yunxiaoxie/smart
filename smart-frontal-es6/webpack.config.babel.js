import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

export default {
    entry: {
        app: './src/app/app.js',
        vendor: './src/vendor.js'
    },
    devtool: 'inline-source-map', // 根据情况修改参数
    output: {
        path: path.resolve(__dirname, 'src'),
        publicPath: '/',
        filename: '[name].js'   //filename: '[name].[hash].js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: ['babel-loader']
            },
            {
                test: /\.html$/,
                exclude: /node_modules/,
                loader: 'html-loader'
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            },
            {
                test: /\.(jpg|png|gif|svg|woff2|ttf|woff|eot|ico)$/,
                use: 'file-loader'
            }
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: false,
        open: true,
        stats: 'errors-only'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            favicon: 'src/dr-favicon.ico',
            inject: true
        }),
        new ExtractTextPlugin('[name].css'), //提取出来的样式放在style.css文件中
        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            $: 'jquery'
        }),
        new webpack.DefinePlugin({
            IsDebug: true,
            APIENDPOINT: JSON.stringify("http://127.0.0.1:80/")
        })
    ]
};
