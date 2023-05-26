import colors from 'vuetify/lib/util/colors'

/** @type {Object} */
const commonColors = {
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107',
};


export default {
    grey_1: {
        colors: Object.assign({
            primary: colors.shades.white,
            secondary: colors.grey.lighten2,
            accent: colors.blueGrey.lighten2,
        }, commonColors),
    },
    grey_2: {
        colors: Object.assign({
            primary: colors.grey.darken2,
            secondary: colors.grey.lighten1,
            accent: colors.blueGrey.lighten4,
        }, commonColors),
    },
    grey_3: {
        colors: Object.assign({
            primary: colors.shades.black,
            secondary: colors.grey.darken2,
            accent: colors.blueGrey.darken1,
        }, commonColors),
    },

    blue: {
        colors: Object.assign({
            primary: colors.blue.darken2,
            secondary: colors.blue.lighten4,
            accent: colors.blue.accent2,
        }, commonColors),
    },

    blue_1: {
        colors: Object.assign({
            primary: colors.blue.lighten3,
            secondary: colors.blue.lighten5,
            accent: colors.blue.accent1,
        }, commonColors),
    },
    blue_2: {
        colors: Object.assign({
            primary: colors.blue.darken1,
            secondary: colors.blue.lighten4,
            accent: colors.blue.accent2,
        }, commonColors),
    },
    blue_3: {
        colors: Object.assign({
            primary: colors.blue.darken4,
            secondary: colors.blue.lighten2,
            accent: colors.blue.accent3,
        }, commonColors),
    },

    red_1: {
        colors: Object.assign({
            primary: colors.red.lighten3,
            secondary: colors.red.lighten5,
            accent: colors.red.accent1,
        }, commonColors),
    },
    red_2: {
        colors: Object.assign({
            primary: colors.red.darken1,
            secondary: colors.red.lighten4,
            accent: colors.red.accent2,
        }, commonColors),
    },
    red_3: {
        colors: Object.assign({
            primary: colors.red.darken4,
            secondary: colors.red.lighten2,
            accent: colors.red.accent3,
        }, commonColors),
    },

    green_1: {
        colors: Object.assign({
            primary: colors.green.lighten3,
            secondary: colors.green.lighten5,
            accent: colors.green.accent1,
        }, commonColors),
    },
    green_2: {
        colors: Object.assign({
            primary: colors.green.darken1,
            secondary: colors.green.lighten4,
            accent: colors.green.accent2,
        }, commonColors),
    },
    green_3: {
        colors: Object.assign({
            primary: colors.green.darken4,
            secondary: colors.green.lighten2,
            accent: colors.green.accent3,
        }, commonColors),
    },

    purple_1: {
        colors: Object.assign({
            primary: colors.purple.lighten3,
            secondary: colors.purple.lighten5,
            accent: colors.purple.accent1,
        }, commonColors),
    },
    purple_2: {
        colors: Object.assign({
            primary: colors.purple.darken1,
            secondary: colors.purple.lighten4,
            accent: colors.purple.accent2,
        }, commonColors),
    },
    purple_3: {
        colors: Object.assign({
            primary: colors.purple.darken4,
            secondary: colors.purple.lighten2,
            accent: colors.purple.accent3,
        }, commonColors),
    },

    orange_1: {
        colors: Object.assign({
            primary: colors.orange.lighten3,
            secondary: colors.orange.lighten5,
            accent: colors.orange.accent1,
        }, commonColors),
    },
    orange_2: {
        colors: Object.assign({
            primary: colors.orange.darken1,
            secondary: colors.orange.lighten4,
            accent: colors.orange.accent2,
        }, commonColors),
    },
    orange_3: {
        colors: Object.assign({
            primary: colors.orange.darken4,
            secondary: colors.orange.lighten2,
            accent: colors.orange.accent3,
        }, commonColors),
    },
}