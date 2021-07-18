const { GLOBAL, Logger } = require('../../config')
const axios = require('axios')


class GoogleServices {

    static async AddressVerify(st_name, st_num, locality, city, country){
        try {
            const address = `${st_name} ${st_num}, ${locality}, ${city}, ${country}`
            const url = encodeURI(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${GLOBAL.GOOGLE_APIKEY}`)
            const { data = {} } = await axios.get(url)

            if(data.status === 'OK' && (Array.isArray(data.results) && data.results[0])){
                const { 
                    types : [ st_type ] = [], 
                    place_id, 
                    formatted_address, 
                    geometry : { location } = {},
                    partial_match
                } = data.results[0]

                if(partial_match || st_type !== 'street_address' || !place_id || !formatted_address || !location){
                    return { error: 'Invalid address', result: data.results[0] } 
                }

                data.results[0].country = ''  //FOR INDEX IN BD
                return data.results[0]
            }

            return { error: data.error_message || 'Provider services error' } 
        } catch (error) {
            Logger.fatal(`Fatal error Google AddressVerify`, error)
            return {error: 'Provider generic error'}
        }
    }
}
/**
 * jose francisco vergara, 3253, iquique, chile
 * ChIJ39iTMXsUUpER9z1UxkCiLZo
 * ChIJ39iTMXsUUpER9z1UxkCiLZo
 * ChIJ39iTMXsUUpER9z1UxkCiLZo
 * 
 * 
 * jose francisco vergara, 3254, iquique, chile
 * EjdKb3PDqSBGcmFuY2lzY28gVmVyZ2FyYSAzMjU0LCBJcXVpcXVlLCBUYXJhcGFjw6EsIENoaWxlIhsSGQoUChIJn4yiLnsUUpERuY1Dtv7hK9QQthk
 * 
 */


module.exports = GoogleServices;