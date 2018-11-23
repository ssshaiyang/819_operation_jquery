// 添加请求头
      var url =URL+'/member/patient/getList'
      //筛选查询
      layui.use('form', function(){
        var form = layui.form;
        
        //监听提交
        form.on('submit(findContent)', function(data){
          console.log($('#attribute').val() )
          var findurl =url+"?filter="+$('#findusername').val()+"&attribute="+$('#attribute').val();
          console.log(findurl)
          gettable(findurl)    
          return false;
        });
      });
      layui.use('laydate', function(){
        var laydate = layui.laydate;
        
        //执行一个laydate实例
        laydate.render({
          elem: '#start' //指定元素
        });

        //执行一个laydate实例
        laydate.render({
          elem: '#end' //指定元素
        });
      });
      /*用户-加入黑名单*/
      function member_del(id){
      	  var str = "<div><h4>是否将改用户加入黑名单</h4><p>原因：<input type='text' id='price' /></p></div>";
          layer.confirm(str, {btn: ['确认', '取消'], title: "提示"}, function () {
	        var price = $("#price").val();
	        console.log(price)
		        if (price == null || price == undefined ||price=="") {
		            alert('请输原因');
		            console.log(123)
		        }else{            
               $.ajax({
                    type:'POST',
                    url:URL+'/member/patient/addBlacklist',
                    data:{
                        user_id:id,
                        reason:price
                    },
                    success:function(e){
                        if(e.code==1000){
                          layer.msg('操作成功', {icon: 1});
                          gettable(URL+'/member/patient/getList')
                        }else{
                          layer.msg(e.msg)
                        }
                    }
                });
            }
	       });
      }
        // 获取表单数据
        function gettable(urls){
            layui.use('table', function(){
              var table = layui.table;
              //第一个实例
              table.render({
                elem: '#patient-list'
                ,height: 312
                ,url: urls //数据接口
                ,page: true //开启分页
                ,cellMinWidth: 80
                ,cols: [[ //表头
                  {field: 'username', title: '用户名', fixed: 'left',templet:'#indexTpl'}
                  ,{field: 'phone', title: '手机号'}
                  ,{field: 'attribute', title: '属性'}
                  ,{field: 'lastLoginTime', title: '最后登录时间'}
                  ,{field: 'abnormal', title: '异常状态',templet:'#patientstatus'}
                  ,{field: 'uid',fixed: 'right', title:'操作', toolbar: '#barDemo'}
                ]],response: {
                      statusName: 'code' //数据状态的字段名称，默认：code
                      ,statusCode: 1000 //成功的状态码，默认：0
                      ,msgName: 'msg' //状态信息的字段名称，默认：msg
                      ,countName: 'count' //数据总数的字段名称，默认：count
                      ,dataName: 'data.data' //数据列表的字段名称，默认：data
                }
              });
              
            });
        }
        gettable(url);




        // 添加用户
        function addUser(){
          var strs = "<div><h4>请输入手机号</h4><input type='text' id='phonenumber' /><h4>请输入用户名</h4><input type='text' id='userpeoplename' /></div>";
          layer.confirm(strs, {btn: ['确认', '取消'], title: "提示"}, function () {
            var phonenumber = $("#phonenumber").val();
            var userpeoplename = $("#userpeoplename").val();
            if (userpeoplename == null || userpeoplename == undefined ||userpeoplename==""||phonenumber == null || phonenumber == undefined ||phonenumber=="") {
                alert('还有信息未填写');
            }else{
                $.ajax({
                    type:'POST',
                    url:URL+'/member/patient/addPatient',
                    data:{
                        username:userpeoplename,
                        phone:phonenumber
                    },
                    success:function(e){
                        if(e.code==1000){
                          layer.msg('操作成功', {icon: 1});
                          gettable('http://192.168.1.180/819_operation/member/patient/getList')
                        }else{
                          layer.msg(e.msg)
                        }
                    }
                });
            }
        })
      }

      // 上传导入名单文件
      function uploadingFiles(){
        var fileUrl =""
        var strs = '<div><div><button class="layui-btn" onclick="downtemplate()">下载模板</button></div><span>选择需要导入的名单</span><button class="layui-btn" id="uplodFilese"   accept: "file">上传文件</button><div style="overflow:hidden"><span>导入状态</span><span style="float:right" id="checkstate"></span></div></div>';
          layer.confirm(strs, {btn: ['导入', '取消'], title: "提示"}, function () {
                if(fileUrl==""){
                  alert('文件未上传')
                }else{
                      $.ajax({
                        type:'POST',
                        url:URL+'/member/patient/importList',
                        data:{
                            filename:fileUrl,
                        },
                        success:function(e){
                            if(e.code==1000){
                              layer.msg('操作成功')
                              getexamine()
                            }else{
                              layer.msg(e.msg)
                            }
                        }
                      });
                }              
          })
          layui.use('upload', function(){
              var upload = layui.upload;
               
              //执行实例
              var uploadInst = upload.render({
                elem: '#uplodFilese' //绑定元素
                ,url: URL+'/member/patient/uploadList' //上传接口
                ,accept: 'file'
                ,done: function(res){
                  //上传完毕回调
                  $('#checkstate').html('成功')
                  fileUrl =res.data.filePath
                }
                ,error: function(res){
                  $('#checkstate').html(res.msg)
                  //请求异常回调
                }
              });
            });
        }
        function downtemplate(){
          var url = URL+'/member/patient/downloadTemplate';
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url, true); 
          xhr.setRequestHeader('Authorization',localStorage.getItem("token"));
          xhr.responseType = "blob";  
          xhr.onload = function () {   
              if (this.status === 200) { 
                    var blob = this.response; 
                    var reader = new FileReader();    
                    reader.readAsDataURL(blob);
                    reader.onload = function (e) {       
                       var a = document.createElement('a');           
                       a.download = '用户模板.xlsx';            
                       a.href = e.target.result;             
                       $("body").append(a);    
                       a.click();               
                       $(a).remove();            
                    }       
                }   
              };    
              xhr.send()
        }
        