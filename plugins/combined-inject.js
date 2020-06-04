import appconst from '../utiltools/appconst'

export default function({ store, app }, inject) {
  inject('L', (value, source, ...argus) => {
    if (source) {
      return localize(value, source, argus)
    } else {
      return localize(value, appconst.localization.defaultLocalizationSourceName, argus)
    }
  })
  const localize = function(key, sourceName) {
    sourceName = sourceName || store.state.abp.localization.defaultSourceName

    const source = store.state.abp.localization.values[sourceName]

    if (!source) {
      return key
    }

    const value = source[key]
    if (value === undefined) {
      return key
    }

    const copiedArguments = Array.prototype.slice.call(arguments, 0)
    copiedArguments.splice(1, 1)
    copiedArguments[0] = value

    return formatString.apply(this, copiedArguments)
  }

  const formatString = function() {
    if (arguments.length < 1) {
      return null
    }

    let str = arguments[0]

    for (let i = 1; i < arguments.length; i++) {
      const placeHolder = '{' + (i - 1) + '}'
      str = replaceAll(str, placeHolder, arguments[i])
    }

    return str
  }
  const replaceAll = function(str, search, replacement) {
    const fix = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    return str.replace(new RegExp(fix, 'g'), replacement)
  }
}
