
const getPropertyValue = (obj, key) => {
    return obj[key]
}

const useTheme = (style, theme) => {
    return (key) => {
        const el = getPropertyValue(style, key)
        return getPropertyValue(el, theme)
    }
}


export default useTheme