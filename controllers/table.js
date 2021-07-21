const { request, response } = require('express');
const jobInfo = require('../database/jobTableService');

exports.getJobData = (request, response) => {

    const info = jobInfo.getjobInfoInstance();

    const jobNumber = request.query.jobNumber;

    info.getJobData(jobNumber).then((data) => {
        response.json({
            data: data[0]
        })
    })

}

exports.searchJobData = (request, response) => {

    const info = jobInfo.getjobInfoInstance();

    const jobNumber = request.query.jobNumber;

    info.searchJobData(jobNumber).then((data) => {
        response.json({
            data: data
        })
    })

}

exports.getAllJobData = (request, response) => {
    // console.log(request);
    const queryParams = request.query;
    // //  Request Properties
    const filter = queryParams.filter || '' ,
          sortOrder = queryParams.sortOrder;




    // console.log(queryParams);
    const info = jobInfo.getjobInfoInstance();

    info.getAllTableData().then((data) => {
       // let pageNumber = parseInt(queryParams.pageNumber) || 0;
       //      let   pagesize = parseInt(queryParams.pageSize) || data.length;
       //      let from = pageNumber * pagesize;
       //      let to = from + pagesize;
        // console.log('<------------Response Data ----------->');
        // console.log(pagesize);
        // console.log(pageNumber);
        // const initialPos = pageNumber * pagesize;

        // data = data.slice(initialPos, initialPos + pagesize);
        // console.log(data);
      let count =  data.reduce((m, c) => {
            if (c.Die in m) m[c.Die].count += 1;
            else m[c.Die] = { Die: c.Die, count: 1};
            return m;
        }, {});
         // count = Object.entries(count).map((e) => ( { [e[0]]: e[1] } ));
        count = Object.entries(count).map((e) => ( { [e[0]]: e[1] } ));
       // console.log(count);
        response.json({
            data: data,
            tableCount: count
        });
    })
}

exports.submitJobData = (request, response) => {
    console.log('<----------request from the frontend --------->');
   console.log(request.body);
    const submittedData = request.body
    const {Msf, Ordernotes } = request.body;
    console.log('<--------All requests arriving -------->')
    console.log(submittedData);
    console.log(Ordernotes);
    console.log(Msf);
    const info = jobInfo.getjobInfoInstance();
    Promise.all([info.insertJobData(submittedData), info.editJobData(Ordernotes,Msf)])
        .then((data) => {
            console.log(data);
        response.json({
            itemId: data
        });
        });
// info.insertJobData(submittedData).then((data) => {
//         console.log('<--------Comment request--------->')
//        console.log(data);
//         response.json({
//             itemId: data
//         });
//     })
// info.editJobData(Ordernotes,Msf).then((data) => {
//     response.json({
//         itemId: data
//     });
// })

}

