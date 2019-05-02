import fs, { write } from 'fs';
let math = require('mathjs');
var crypto = require('crypto');
const zlib = require('zlib');
const { Transform } = require('stream');

math.config({
    number: 'BigNumber', // Default type of number:
                       // 'number' (default), 'BigNumber', or 'Fraction'
  precision: 128
})

const maxSecret = 99999999 - 100000;
const maxCoefficient = 100;
const maxValue = 50;

class Shamir{

    static generateKeys(total, required, secret){
        let pol = [];
        pol.push(secret);
        for(let i = 1; i < required; i++){
            pol.push(Math.ceil(Math.random() * maxCoefficient));
        }
        let keys = []
        console.log(pol)
        for(let i = 0; i < total; i++){
            const val = Math.floor(Math.random() * maxValue + 1);
            if(keys.findIndex(key=>key.x===val)===-1)
            {
                keys.push(new FunctionValue(val, evaluateEq(pol, val)));
            }
            else
            {
                i--;
            }
        }
        return keys;
    }

    static cypher(total, required, file, success){
        const secret = Math.ceil(Math.random()*maxSecret+100000)
        const pwd = crypto.createHash('sha256').update(String(secret), 'utf-8').digest();
        // console.log(secret);
        // console.log(pwd.length);
        // console.log(file);

        const initVect = crypto.randomBytes(16);


        const readStream = fs.createReadStream(file.path);
        const gzip = zlib.createGzip();
        const cipher = crypto.createCipheriv('aes-256-cbc', pwd, initVect);
        const appendInitVect = new AppendInitVect(initVect);
        const writeStream = fs.createWriteStream(file.path+".enc");
        

        readStream
            .pipe(gzip)
            .pipe(cipher)
            .pipe(appendInitVect)
            .pipe(writeStream)
            .on('finish', ()=>{
                success()
            });;
        
        return this.generateKeys(total, required, secret);
    }

    static decypher(required, keys, file, newFile, success, errorHandler){

        const secret = Math.round(Shamir.obtainKeys(required, keys));
        console.log(secret);
        const pwd = crypto.createHash('sha256').update(String(secret), 'utf-8').digest();

        const readInitVect = fs.createReadStream(file.path, { end: 15 });

        let path;
        if(newFile === ''){
            path = file.path.split('.').slice(0, -1).join('.');
        }
        else{
            let ext = file.path.split('.').slice(0, -1)
            ext = ext[ext.length-1];
            path = file.path.split(/\\|\//)
            path.pop();
            
            path.push(newFile+'.'+ext);
            path = path.join('/')
        }


        console.log(path);

        let initVect;
        readInitVect.on('data', (chunk) => {
            initVect = chunk;
        });

        let error = false;

        try{
            readInitVect.on('error', (err)=>{
                errorHandler(err);
                error = true;
            })
            readInitVect.on('close', () => {
                if(!error){
                    const readStream = fs.createReadStream(file.path, { start: 16 });
                    const decipher = crypto.createDecipheriv('aes-256-cbc', pwd, initVect);
                    const unzip = zlib.createUnzip();
                    const writeStream = fs.createWriteStream(path);
    
                    let handle = (err)=>{
                        if(!error){                        
                            errorHandler(err); 
                            error=true;
                        }
                        if(error){
                            writeStream.close();
                            writeStream.end();
                            readStream.close();
                        }
                    }
    
                    readStream
                    .pipe(decipher).on('error',handle)
                    .pipe(unzip).on('error',handle)
                    .pipe(writeStream).on('error',handle)
                    .on('finish', ()=>{
                        if(!error){
                            success();
                        }
                    });
                }
            });
        }
        catch(err){
            errorHandler(err);
        }
        
    }

    static obtainKeys(required, keys){
        let sum = math.bignumber(0);
        for(let i = 0; i < required; i++){
            let product = math.bignumber(keys[i].fx);
            for(let j = 0; j < required; j++){
                if(j !== i){
                    product = math.multiply(
                        math.divide( 
                            math.bignumber(math.subtract(math.bignumber(0), math.bignumber(keys[j].x) )), 
                            math.bignumber(math.subtract( math.bignumber(keys[i].x), math.bignumber(keys[j].x) ))
                        ), math.bignumber(product)
                    )
                }
            }
            sum = math.sum(product, sum);
        }
        return sum.toNumber();
    }
}

class FunctionValue{

    constructor(x, fx){
        this.x = x;
        this.fx = fx;
    }
}

class AppendInitVect extends Transform {
    constructor(initVect, opts) {
      super(opts);
      this.initVect = initVect;
      this.appended = false;
    }
  
    _transform(chunk, encoding, cb) {
      if (!this.appended) {
        this.push(this.initVect);
        this.appended = true;
      }
      this.push(chunk);
      cb();
    }
  }

function evaluateEq(eq, x){
    let sum = 0;
    for(let i = 0; i<eq.length; i++){
        sum += Math.pow(x, i) * eq[i];
    }
    return sum;
}


export {
    Shamir,
    FunctionValue
}