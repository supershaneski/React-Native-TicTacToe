
/**
 * 
 * @param {*} payload 
 * @returns 
 */
export const wait = (payload) => {
    const delay = 1000 + Math.round(2000 * Math.random())
    return new Promise((resolve) => setTimeout(() => {
        resolve(payload)
    }, delay))
}

// @usage
// return wait({result: { status: 200, items: member_items }})


/**
 * 
 * @param {Array} arr 
 * @returns 
 */
export function shuffle(arr) {
    
    let currentIndex = arr.length, randomIndex

    while(currentIndex != 0) {

        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--

        [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]]

    }

    return arr

} 

/**
 * 
 * @param {int} min 
 * @param {int} max 
 * @returns 
 */
export function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}