import en from '../lib/en.json'
import ja from '../lib/ja.json'

const getPropertyValue = (obj, key) => {
    return obj[key]
}

const useCaption = (locale) => {
    return (key) => {
        const token = key.split(".")
        const el = locale.indexOf("en") >= 0 ? getPropertyValue(en, token[0]) : getPropertyValue(ja, token[0])
        return getPropertyValue(el, token[1])
    }
}

export default useCaption