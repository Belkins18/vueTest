module.exports = {
    presets: [
        '@vue/app',
        ["@babel/preset-env", {
            "modules": false,
            "targets": {
                "browsers": ["last 2 versions", "not < 1%", "not ie 11", "not op_mini all"]
            },
            "shippedProposals": true,
            "debug": false
        }]
    ]
};
