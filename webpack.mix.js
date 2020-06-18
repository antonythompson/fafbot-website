const mix = require('laravel-mix');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const imageminMozjpeg = require('imagemin-mozjpeg');


mix
    .setPublicPath('public')
    .setResourceRoot('../')
    .webpackConfig({
        mode: process.env.NODE_ENV || 'development',
        plugins : [
            new CopyWebpackPlugin([{
                from: 'resources/images',
                to: 'images',
            }]),
            new ImageminPlugin({
                test: /\.(jpe?g|png|gif|svg)$/i,
                disable: process.env.NODE_ENV !== 'production', // Disable during development
                pngquant: {
                    quality: '50'
                },
                svgo : {
                    removeViewBox: false
                },
                plugins: [
                    imageminMozjpeg({
                        quality: 50,
                        progressive : true
                    })
                ]
            }),
        ],
        devtool: 'cheap-source-map'
    })
    .sass('resources/sass/app.scss', 'public/stylesheets')
    .js('resources/js/app.js', 'public/javascripts')



if (process.env.NODE_ENV === 'production') {
    mix.version();
} else {
    mix.sourceMaps(true, 'source-map');
}