const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const { GLOBAL, Logger } = require('../../config')
const Tables = require('./tables')

class Mongo{
    constructor(){
        if(!this.instance){
            this.instance = this
        }
        
        this.db;
        this.tables = Tables;
        this.ObjectID = ObjectID
        this.url = `${GLOBAL.MONGO_HOST}`;
        this.options = { 
            useNewUrlParser: true,
            useUnifiedTopology: true,
            /*auth:{
                user:"root",
                password:"123"
            }*/
        }
    }

    async connect(cb) {
        try {
            Logger.info('MongoDB connecting ... ')
            MongoClient.connect(this.url, this.options, (err, mongodb) => {
                if(err){
                    Logger.error('MongoDB connection error. '+err.message);
                    return cb(false)
                }
                Logger.info('MongoDB Connected. ', this.url)
                this.db = mongodb.db(GLOBAL.MONGO_DB);
                this.db.collection(this.tables.user).createIndex( { email: 1 }, { unique: true })
                //this.db.collection(this.tables.user).deleteMany({}) //QUITAR!
                //this.db.collection(this.tables.user).updateOne({email:"sebasay1@gmail.com"},{$set:{password:false}}) //QUITAR!
                //this.db.collection(this.tables.building).deleteMany({}) //QUITAR!
                //this.db.collection(this.tables.building).updateMany({},{$set:{type_building:0}}) //QUITAR!
                /*this.db.collection(this.tables.user).updateOne(
                    {
                        _id:"6065c6f7cd5fd825688df56d"
                    },
                    {
                        $set:{
                            'autorizaciones.SVXFFMM04' : {
                                "BCENT" : NumberDecimal(1.0),
                                "BDESC" : 1.0,
                                "ECONC" : 1.0,
                                "ECONT" : 1.0,
                                "ECORP" : 1.0,
                                "EGEMP" : 1.0,
                                "EINMO" : 1.0,
                                "EMEDM" : 1.0,
                                "EMEDP" : 1.0,
                                "EMPRG" : 1.0,
                                "EMPRM" : 1.0,
                                "ENASI" : 1.0,
                                "FAFP" : 1.0,
                                "FAVAL" : 1.0,
                                "FBCOC" : 1.0,
                                "FBCOI" : 1.0,
                                "FBCON" : 1.0,
                                "FBOLS" : 1.0,
                                "FCSEG" : 1.0,
                                "FFILB" : 1.0,
                                "FFINV" : 1.0,
                                "GGEE" : 1.0,
                                "ICENL" : 1.0,
                                "ICENT" : 1.0,
                                "ICNOL" : 1.0,
                                "IDECL" : 1.0,
                                "IDESC" : 1.0,
                                "IDNOL" : 1.0,
                                "IIYG" : 1.0,
                                "IMUNI" : 1.0,
                                "INSPP" : 1.0,
                                "ISFL" : 1.0,
                                "ISSAL" : 1.0,
                                "MISFL" : 1.0,
                                "MMIC" : 1.0,
                                "MMICA" : 1.0,
                                "MMSIN" : 1.0,
                                "MPEQ" : 1.0,
                                "MPEQA" : 1.0,
                                "MPSIN" : 1.0,
                                "MSOM" : 1.0,
                                "MSOP" : 1.0
                            },
                            'autorizaciones.SVXFFMM02': {
                                "BCENT" : 1.0,
                                "BDESC" : 1.0,
                                "ECONC" : 1.0,
                                "ECONT" : 1.0,
                                "ECORP" : 1.0,
                                "EGEMP" : 1.0,
                                "EINMO" : 1.0,
                                "EMEDM" : 1.0,
                                "EMEDP" : 1.0,
                                "EMPRG" : 1.0,
                                "EMPRM" : 1.0,
                                "ENASI" : 1.0,
                                "FAFP" : 1.0,
                                "FAVAL" : 1.0,
                                "FBCOC" : 1.0,
                                "FBCOI" : 1.0,
                                "FBCON" : 1.0,
                                "FBOLS" : 1.0,
                                "FCSEG" : 1.0,
                                "FFILB" : 1.0,
                                "FFINV" : 1.0,
                                "GGEE" : 1.0,
                                "ICENL" : 1.0,
                                "ICENT" : 1.0,
                                "ICNOL" : 1.0,
                                "IDECL" : 1.0,
                                "IDESC" : 1.0,
                                "IDNOL" : 1.0,
                                "IIYG" : 1.0,
                                "IMUNI" : 1.0,
                                "INSPP" : 1.0,
                                "ISFL" : 1.0,
                                "ISSAL" : 1.0,
                                "MISFL" : 1.0,
                                "MMIC" : 1.0,
                                "MMICA" : 1.0,
                                "MMSIN" : 1.0,
                                "MPEQ" : 1.0,
                                "MPEQA" : 1.0,
                                "MPSIN" : 1.0,
                                "MSOM" : 1.0,
                                "MSOP" : 1.0
                            }
                        }
                    })*/
                return cb(true)
            });
            
                        
        }catch (err) {
            Logger.error('Error: '+err)
            cb(false)
        }
    }

    collection(name){
        return this.db.collection(name)
    }
}
const mongo = new Mongo()
module.exports = mongo;