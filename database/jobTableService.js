const connection = require("./connection");

let instance = null;

// Can create multiple classes like this
class JobInfo {

    // Creates one instance of this class
    static getjobInfoInstance(){
        return instance ? instance : new JobInfo();
    }
    async insertJobData(tableData){
           // console.log(tableData);
        const {
         Ordernotes,
            Msf,
        } = tableData
        const where = {
           Msf
        }
        try {
            const response = await new Promise((resolve, reject) => {
                const query = " \
                    INSERT INTO comments \
                    (Ordernotes , Msf) \
                    VALUES (?, ?) \
                    ON DUPLICATE KEY \
                    UPDATE  Ordernotes = ? ";


                const values = [
                    Ordernotes,
                    Msf,
                ];

                connection.query(query, [Ordernotes,Msf , Ordernotes], (err, results) => {
                    if(err){
                        reject(new Error(err.message));
                    }

                    // console.log(results);

                    resolve(results);
                });
            })
            console.log('<----------Database Response------>');
           console.log(response)
            return response;
        } catch (error) {
            console.log(error);
        }
    }


    async editJobData(Ordernotes , Msf) {
        console.log('<------------Captured from the frontend ------------>')
      console.log(Ordernotes);
      console.log(Msf);
        // const where = {
        //     Msf
        // }
        const query = "UPDATE schedule \n" +
            "SET Ordernotes = ? \n" +
            "WHERE Msf = ?;"
        // const query = "UPDATE schedule SET ? WHERE ?  ";

//         const queryTest = `UPDATE schedule
// SET ?
// WHERE ? IN (select ? from
//  (
//  SELECT
//        row_number() OVER(PARTITION BY Column1  ORDER BY Column1 ) AS rno,
//        ? FROM schedule
//  )
//                    where rno=2
//                   )`;
        try {
            const response = new Promise((resolve, reject) => {
                connection.query(query, [Ordernotes, Msf], (err, results) => {
                    if(err){
                        reject(new Error(err.message));
                    }
                    console.log(results);
                    resolve(results.insertId);
                });
            })

            return response;
        } catch (error) {
            console.log(error);
        }
    }


    async getJobData(requestedJobNumber) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM job_info WHERE job_number = ?";

                connection.query(query, [requestedJobNumber], (err, results) => {
                    if(err){
                        reject(new Error(err.message));
                    }

                    resolve(results);
                });
            })

            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async searchJobData(requestedJobNumber) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM job_info WHERE job_number LIKE ?";

                connection.query(query, [`%${requestedJobNumber}%`], (err, results) => {
                    if(err){
                        reject(new Error(err.message));
                    }

                    resolve(results);
                });
            })

            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async getAllTableData(){
        try {
           let response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM schedule";

                connection.query(query, (err, results) => {
                    if(err){
                        reject(new Error(err.message));
                    }

                    resolve(results);
                });
            })
            // console.log('<--------------Response Data --------------->');
           // console.log(response);
            response = this.dataFormat(response);
            return response;
        } catch (error) {
            console.log(error);
        }
    }


    async dataFormat(response) {
        try {
            // console.log('<------------Perform the data formatting ------------->')
            // console.log(response);
            // if the quantity data of response is a string
            // if(await stringCheck(response)){
            // const result = await pipe(quantityData,stringData, trimString, integerData)(response);
            //    response = await ArrayOfObject(result)(response)
            //
            // }
            response = await sortData(response)
            return response;
        } catch (error) {
            console.log(error);
        }
    }

}


function pipe(...fns) {
    return (arg) => fns.reduce((prev, fn) => fn(prev), arg);
}


// perform a string check if true convert the quantity to a number

let stringCheck = array => array.some(a => (typeof a.quantity === "string"));

// capture quantity
let quantityData = array => array.map(a => a.quantity);

// convert them all to strings
let stringData = array => array.map(a => a.toString());
// remove space and comma from the quantity  & convert to a numner
const regex = /[.,\s]/g;
let trimString = array => array.map(a => a.replace(regex, ""));
// convert to a number
let integerData = array => array.map(a => parseInt(a));
// Add back to the array of objects

function curry(f) { // curry(f) does the currying transform
    return function(a) {
        return function(b) {
            return f(a, b);
        };
    };
}

function arrayObject(a, b) {
    for (var i = 0; i < b.length; i++) {
        // merge objects into one with multiple props
        b[i] = Object.assign(b[i], {

            quantity: a[i],


        });
    }

    return b;
    //  return `Data : ${a}  + Response : ${b}`;

}

let ArrayOfObject = curry(arrayObject);

// sort by the qty, die and ac ascending

let sortData = array =>   array.sort((a, b) =>  a.Die.localeCompare(b.Die)  || a.TaskQty - b.TaskQty || new Date(a.Shipdate) - new Date(b.Shipdate));


module.exports = JobInfo;
