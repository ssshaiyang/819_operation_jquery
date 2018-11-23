var token = localStorage.getItem("token");
// URL = 'http://192.168.1.180/819_operation'
URL = 'http://819operationapi.j7w5.net'
$.ajaxSetup({
    dataType: "json",
    headers: {
        'Accept': 'application/json',
        'Authorization': '' + token
    },
    // success:function(e){
    //     console.log(e)
    //     if (e.code == 1002) {
    //         alert("登录信息过期！请重新登录");
    //         location.href = '../login.html'
    //     }
    // }
    
    complete:function(xhr){
        if (xhr.responseJSON.code == 1002) {
            // parent.layer.closeAll();
            alert("登录信息过期！请重新登录");
            top.location.href = './login.html'
        }
    }
    // xhrFields: {
    //     withCredentials: true
    // },
    // complete: function(xhr) {
    //     //token过期，则跳转到登录页面
    //     if(xhr.responseJSON.code == 401){
    //         parent.location.href = baseURL + 'login.html';
    //     }
    // }
});



// $.ajaxSetup({
//     beforeSend: function () {
//     //ajax请求之前
//     },
//     complete: function () {
//          //ajax请求完成，不管成功失败
//      },
//      error: function () {
//         //ajax请求失败
//     }
// })
