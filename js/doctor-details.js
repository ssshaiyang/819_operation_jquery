var doctorDepRank =0;/*科室排名*/
      var docName ="";/*医生名*/
      var hosptialName="";/*医院名*/
      var departmentName ="";/*当前科室名*/
      var positionalTitle="";/*职称*/
      var careerAge="";/*职业年龄*/
      var hosptialId=-1;/*医院id*/
      var hosptialtext ="";
      var positionlist ="";/*职位下拉表*/
      var departmentList="";
      var doctorstatus=-1;/*用户是否被冻结*/
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
      var search = document.location.search;
      var arr =search.split("|")
      var strs = arr[0].split("=")[1]/*医生id*/
      var inquisitionId =arr[1].split("=")[1]/*问诊id*/
      // 医生信息获取
      $.ajax({
          type:'GET',
          url:URL+'/member/doctor/detail/'+strs,
          data:{
          },
          success:function(e){
              if(e.code==1000){
                $('#docName').html(e.data.docName)
                $('#avatar').attr('src',e.data.avatar)
                $('#positionalTitle').html(e.data.positionalTitle)
                $('#hosptialName').html(e.data.hosptialName)
                $('#phone').html(e.data.phone)
                $('#workHour').html(Number(e.data.workHour).toFixed(3))
                $('#surplusHour').html(Number(e.data.surplusHour).toFixed(3))
                $('#evaluationScore').html(e.data.evaluationScore)
                if(e.data.status==1){
                	$('#userstate').html('冻结用户')
                	doctorstatus=1;
                }else if(e.data.status==3){
                	doctorstatus=2;
                	$('#userstate').html('解冻用户')
                }
                doctorDepRank=e.data.doctorDepRank;
                docName =e.data.docName;/*医生名*/
                hosptialName=e.data.hosptialName;/*所在医院*/
                positionalTitle=e.data.positionalTitle;/*职称*/
                careerAge=e.data.careerAge;/*职业年龄*/
                departmentName=e.data.departmentName;/*科室名*/
                hosptialId=e.data.hospitalId;/*医院id*/
                hosptialtext=e.data.hosptialName;/*医院名称*/
                getposition();
                getdepartmentList();
              }else{
                layer.msg(e.msg)
              }
          }
      });

      // 医院名称获取
      function getdrop_down(){
            $.ajax({
                type:'GET',
                url:URL+'/member/doctor/getHospitalList?page=1&limit=5&filter='+$('#hosptialNames').val(),
                data:{
                  page:1,
                  limit:5,
                  filter:$('#hosptialNames').val()
                },
                success:function(e){
                  console.log(e)
                    if(e.code==1000){
                        $('#hosptiallist').empty();
                        if(e.data.data.length==0){
                          $('#hosptiallist').css('display','none');
                        }else{
                          $('#hosptiallist').css('display','block');
                        }
                        for(var i=0;i<e.data.data.length;i++){
                          var hosptial ="'"+e.data.data[i].name+"'";
                          $('#hosptiallist').append('<dd onclick="changhosptial('+e.data.data[i].id+','+hosptial+')">'+e.data.data[i].name+'</dd>')
                        }
                    }else{
                      layer.msg(e.msg)
                    }
                }
            });
      }
      // 科室下拉
      function getdepartmentList(){
          $.ajax({
                type:'GET',
                async:false,
                url:URL+'/content/secondDepartment?page=1&limit=1000',
                data:{
                },
                success:function(e){
                  departmentList="";
                    if(e.code==1000){
                      for(var i=0;i<e.data.data.length;i++){
                          if(e.data.data[i].departmentName==departmentName){
                            departmentList+='<option value="'+e.data.data[i].id+'" selected="selected">'+e.data.data[i].departmentName+'</option>'
                          }else{
                            departmentList+='<option value="'+e.data.data[i].id+'">'+e.data.data[i].departmentName+'</option>'
                          }
                      }
                    }else{
                        layer.msg(e.msg)
                      }
                 }
            });
      }
      // 职称下拉
      function getposition(){
        $.ajax({
                type:'GET',
                async:false,
                url:URL+'/member/doctor/getPositionalTitleList',
                data:{
                },
                success:function(e){
                  positionlist="";
                    if(e.code==1000){
                      for(var i=0;i<e.data.length;i++){
                          if(e.data[i].positionalTitle==positionalTitle){
                            positionlist+='<option value="'+e.data[i].positionalId+'" selected="selected">'+e.data[i].positionalTitle+'</option>'
                          }else{
                            positionlist+='<option value="'+e.data[i].positionalId+'">'+e.data[i].positionalTitle+'</option>'
                          }
                      }
                    }else{
                        layer.msg(e.msg)
                      }
                 }
            });
      }
      function changhosptial(id,name){
        hosptialId=id;
        $('#hosptialNames').val(name)
          $('#hosptiallist').css('display','none');
      }

      function getdetails(){
        $.ajax({
            type:'GET',
            url:URL+'/member/doctor/inquisitionList/'+strs,
            data:{
            },
            success:function(e){
                if(e.code==1000){
                  console.log(e)
                  $('#interrogationrecord').empty()
                  for(var i=0;i<e.data.length;i++){
                      var strs = arr[0].split("=")[1]
                      var inquisitionId =arr[1].split("=")[1]
                      var detailstext = "'问诊详情页','inquisition-details.html?docId="+strs+"&inquisitionId="+e.data[i].inquisitionId+"'"
                      var detailscore ='暂无评分'
                      if(e.data[i].score!=null){
                        detailscore=e.data[i].score+'分'
                      }
                     $('#interrogationrecord').append('<tbody><tr><td style="cursor:pointer" onclick="x_admin_show('+detailstext+')">'+e.data[i].content+'</td><td>'+e.data[i].createTime+'</td><td>'+detailscore+'</td><td>'+e.data[i].abnormal+'</td></tr></tbody>')
                  }
                }else{
                    layer.msg(e.msg)
                }
            }
        });
      }
      getdetails()
      // 加入黑名单
      function addblacklist(){
      	var str = "<div><h4>是否将改用户加入黑名单</h4><p>原因：<input type='text' id='reason' /></p></div>";
          layer.confirm(str, {btn: ['确认', '取消'], title: "提示"}, function () {
	        var price = $("#reason").val();
		        if (price == null || price == undefined ||price=="") {
		            alert('请输原因');
		        }else{            
               $.ajax({
                    type:'POST',
                    url:URL+'/member/doctor/addBlacklist',
                    data:{
                        docId:strs,
                        reason:price
                    },
                    success:function(e){
                        if(e.code==1000){
                          layer.msg('操作成功', {icon: 1});
                          x_admin_close();
                        }else{
                          layer.msg(e.msg)
                        }
                    }
                });
            }
	    });
      }
      function adjust_rank(){
         var str = "<div>当前用户科室排名<input type='text' id='ranking' value='"+doctorDepRank+"' /></div>";
          layer.confirm(str, {btn: ['确认', '取消'], title: "提示"}, function () {
          var ranking = $("#ranking").val();
            if (ranking == null || ranking == undefined ||ranking=="") {
                alert('请输入排名');
            }else{            
               $.ajax({
                    type:'PUT',
                    url:URL+'/member/doctor/modifyRank/'+strs,
                    data:{
                        rankingNum:ranking
                    },
                    success:function(e){
                        if(e.code==1000){
                          layer.msg('调整排名成功')
                          location.reload();
                        }else{
                          layer.msg(e.msg)
                        }
                    }
                });
            }
         });
      }
      function modifyinformation(){
        console.log("")
        var str = "<div class='changebox'><span>医生名</span><input type='text' id='doctorname' value='"+docName+"' /><div style='margin-top:10px;'><span>医院名</span><input type='text' id='hosptialNames' value='"+hosptialName+"' onkeyup='getdrop_down()'><dl class='hosptiallist' id='hosptiallist'></dl></div><div style='margin-top:10px;'><span>所在科室</span><select id='departmentId'>"+departmentList+"</select></div><div style='margin-top:10px;'><span>职称</span><select id='positionalId'>"+positionlist+"</select><div style='margin-top:10px;'><span>职业年龄</span><input type='text' id='careerAges' value='"+careerAge+"' /></div></div>";
          layer.confirm(str, {btn: ['确认', '取消'], title: "提示"}, function () {
          var doctorname = $("#doctorname").val();
           var careerAges = $("#careerAges").val();
           console.log(hosptialId)
            if (doctorname == null || doctorname == undefined ||doctorname==""||hosptialId==-1||careerAges==null) {
                alert('还有信息未填写');
            }else{       
               $.ajax({
                    type:'PUT',
                    url:URL+'/member/doctor/modifyInfo/'+strs,
                    data:{
                        name:doctorname,
                        hospitalId:hosptialId,
                        departmentId:$("#departmentId").val(),
                        positionalId:$("#positionalId").val(),
                        careerAge:careerAges
                    },
                    success:function(e){
                      console.log(e)
                        if(e.code==1000){
                          layer.msg('调整排名成功')
                          location.reload();
                        }else{
                          layer.msg(e.msg)
                        }
                    }
                });
            }
         });
      }
      // 冻结用户
      function doctorfrozen(){
      	 doctorstatus
      	 if(doctorstatus==1){
      	 	layer.confirm('是否冻结该用户', {btn: ['确认', '取消'], title: "提示"}, function () {
      	 		$.ajax({
                    type:'POST',
                    url:URL+'/member/doctor/frozen',
                    data:{
                        docId:strs,
                    },
                    success:function(e){
                      console.log(e)
                        if(e.code==1000){
                          layer.msg('已冻结该医生')
                          location.reload();
                        }else{
                          layer.msg(e.msg)
                        }
                    }
                });
      	 	})
      	 }else if(doctorstatus==2){
      	 	layer.confirm('是否解冻该用户', {btn: ['确认', '取消'], title: "提示"}, function () {
      	 		$.ajax({
                    type:'POST',
                    url:URL+'/member/doctor/unfreeze',
                    data:{
                        docId:strs,
                    },
                    success:function(e){
                      console.log(e)
                        if(e.code==1000){
                          layer.msg('已解冻该医生')
                          location.reload();
                        }else{
                          layer.msg(e.msg)
                        }
                    }
                });
      	 	})
      	 }
      }