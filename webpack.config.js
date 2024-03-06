const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    // The entry point of your application
    entry: './src/main.js',
    mode: 'development',
    // Configuration for your output files
    output: {
        path: path.resolve(__dirname, 'dist'), // Your distribution folder
        filename: 'bundle.js', // The name of the bundled output file
    },

    // This section is for defining how to handle different file types
    module: {
        rules: [
            {
                test: /\.css$/, // Regular expression to match all css files
                use: ['style-loader', 'css-loader'], // Loaders for processing CSS
            },
            {
                test: /\.js$/, // Regular expression to match all js files
                exclude: /node_modules/, // Exclude the node_modules directory
                use: {
                    loader: 'babel-loader', // Use babel-loader for transpiling JavaScript files
                    options: {
                        presets: ['@babel/preset-env'], // Preset used for env setup
                    },
                },
            },
        ],
    },

    // Development tool to enhance debugging by adding meta info for the browser devtools
    devtool: 'source-map',

    // Configuration for webpack-dev-server
    devServer: {
        static: './dist', // Where to serve the content from
        open: true, // To open the browser after server had been started
        compress: true, // Enable gzip compression
        port: 9000, // Port to run the server on,
        client: {
            overlay: {
                runtimeErrors: false,
            },
        },
    },


    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html' // Path to your HTML file
        }),
        new MonacoWebpackPlugin({
            // Include a subset of languages support
            // Add more languages you want to include
            languages: ['abap', 'apex', 'azcli', 'bat', 'bicep', 'cameligo', 'clojure', 'coffee', 'cpp', 'csharp', 'csp', 'css', 'cypher', 'dart', 'dockerfile', 'ecl', 'elixir', 'flow9', 'freemarker2', 'fsharp', 'go', 'graphql', 'handlebars', 'hcl', 'html', 'ini', 'java', 'javascript', 'json', 'julia', 'kotlin', 'less', 'lexon', 'liquid', 'lua', 'm3', 'markdown', 'mdx', 'mips', 'msdax', 'mysql', 'objective-c', 'pascal', 'pascaligo', 'perl', 'pgsql', 'php', 'pla', 'postiats', 'powerquery', 'powershell', 'protobuf', 'pug', 'python', 'qsharp', 'r', 'razor', 'redis', 'redshift', 'restructuredtext', 'ruby', 'rust', 'sb', 'scala', 'scheme', 'scss', 'shell', 'solidity', 'sophia', 'sparql', 'sql', 'st', 'swift', 'systemverilog', 'tcl', 'twig', 'typescript', 'vb', 'wgsl', 'xml', 'yaml']
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'node_modules/vscode-material-icons/generated/icons',
                    to: 'assets/material-icons',
                },
                { from: 'src/assets', to: 'assets' } // from: source folder, to: destination folder
            ],
        })
    ],
};
