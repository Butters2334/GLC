import json
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from curriculum.models import curriculum
from GLCServer.request import response_en, request_body, response_error
import os
from django.conf import settings
from datetime import datetime
from openpyxl import load_workbook
from goods.views import goods_reqeust

class curriculum_reqeust():
    def insert_db(c_data=[],s_date='',e_date=''):
        if len(c_data) <=2 or c_data == None:
            return 501
        db = curriculum()
        db.curriculum_id = c_data[0]
        db.curriculum_name = c_data[1]
        g_list = c_data[2]
        while g_list.endswith(','):
            g_list = g_list[:-1]
        while ',,' in g_list:
            g_list = g_list.replace(',,',',')
        if g_list.startswith(','):
            g_list = g_list[1:]
        db.curriculum_good_list = g_list
        if s_date != None and len(s_date) > 0:
            db.cur_start_date = datetime.strptime(s_date,'%Y-%m-%d %H:%M:%S')
        if e_date != None and len(e_date) > 0:
            db.cur_expiration_date = datetime.strptime(e_date,'%Y-%m-%d %H:%M:%S')
        db.save()
        return 200

    def delete_db(c_id):
        if c_id==None:
            return
        db = curriculum.objects.get(curriculum_id=c_id)
        db.delete()

    def modify_db(c_id,c_name,c_list,s_date='',e_date=''):
        if c_id==None or c_name==None or c_list==None:
            return
        db = curriculum.objects.get(curriculum_id=c_id)
        #db.curriculum_id = c_id#主id不允许修改
        db.curriculum_name = c_name
        g_list = c_list
        while g_list.endswith(','):
            g_list = g_list[:-1]
        while ',,' in g_list:
            g_list = g_list.replace(',,',',')
        if g_list.startswith(','):
            g_list = g_list[1:]
        db.curriculum_good_list = g_list
        # print('e_date - '+e_date)
        if s_date != None and len(s_date) > 0:
            db.cur_start_date = datetime.strptime(s_date,'%Y-%m-%d %H:%M:%S')
        if e_date != None and len(e_date) > 0:
            db.cur_expiration_date = datetime.strptime(e_date,'%Y-%m-%d %H:%M:%S')
        db.save()

    def find_db(c_id):
        if c_id == None:
            return []
        result = curriculum.objects.filter(curriculum_id=c_id)
        arr = []
        for c in result:
            arr.append({'c_id':c.curriculum_id,
                        'c_name':c.curriculum_name,
                        'c_goods_list':c.curriculum_good_list,
                        'cur_expiration_date':c.cur_expiration_date.strftime('%Y-%m-%d %H:%M:%S'),
                        })
        return arr

    def find_db_name(c_name):
        if c_name == None:
            return []
        result = curriculum.objects.filter(curriculum_name=c_name)
        arr = []
        for c in result:
            arr.append({'c_id':c.curriculum_id,
                        'c_name':c.curriculum_name,
                        'c_goods_list':c.curriculum_good_list})
        return arr

    @csrf_exempt
    def insert(request):
        error = response_error(request,'POST',['data'])
        if error[1] != 200:
            return response_en(error[0],error[1])
        data = request_body(request,'data')
        s_date = request_body(request,'sDate')
        e_date = request_body(request,'eDate')
        if len(data) != 3 or data == None:
            return response_en("数据格式错误",500)
        if len(curriculum_reqeust.find_db(data[0])) > 0 :
            return response_en("课程ID重复",500)
        if len(curriculum_reqeust.find_db_name(data[1])) > 0 :
            return response_en("课程名称重复",500)
        status_code = curriculum_reqeust.insert_db(data,s_date,e_date)
        return response_en("存入成功" if status_code==200 else "保存异常",status_code)

    @csrf_exempt
    def delete(request):
        error = response_error(request,'POST',['c_id'])
        if error[1] != 200:
            return response_en(error[0],error[1])
        c_id = request_body(request,'c_id')
        if len(curriculum_reqeust.find_db(c_id)) > 0 :
            curriculum_reqeust.delete_db(c_id)
            return response_en("删除成功",200)
        else:
            return response_en("没有找到对应数据",501)

    @csrf_exempt
    def modify(request):
        error = response_error(request,'POST',['c_id','c_name','c_list'])
        if error[1] != 200:
            return response_en(error[0],error[1])
        c_id = request_body(request,'c_id')
        c_name = request_body(request,'c_name')
        c_list = request_body(request,'c_list')
        s_date = request_body(request,'sDate')
        e_date = request_body(request,'eDate')
        try:
            datetime.strptime(s_date,'%Y-%m-%d %H:%M:%S')
        except:
            return response_en("开课时间输入错误",501)
        try:
            datetime.strptime(e_date,'%Y-%m-%d %H:%M:%S')
        except:
            return response_en("结课时间输入错误",501)

        if len(curriculum_reqeust.find_db(c_id)) > 0 and c_id!=None and c_name!=None and c_list!=None:
            list = curriculum_reqeust.modify_db(c_id,c_name,c_list,s_date,e_date)
            return response_en("修改成功",200,curriculum_reqeust.find_db(c_id))
        else:
            return response_en("没有找到对应数据",501)

    @csrf_exempt
    def find(request):
        error = response_error(request,'POST',['c_id'])
        if error[1] != 200:
            return response_en(error[0],error[1])
        c_id = request_body(request,'c_id')
        list = curriculum_reqeust.find_db(c_id)
        return response_en(list,200)



    @csrf_exempt
    def upload_file(request):
        # error = response_error(request,'POST',[])
        # if error[1] != 200:
        #     return response_en(error[0],error[1])
        # 获取上传的文件，如果没有文件，则默认为None
        myFile =request.FILES.get("file", None)
        # print(myFile)
        if not myFile:
            return response_en("没有找到上传的文件",500)
        # if myFile.name:
        #     return response_en("文件名称错误")
        # 打开特定的文件进行二进制的写操作
        date_path = datetime.now().strftime('%Y-%m-%d %H.%M.%S')
        path_path = os.path.join(settings.MEDIA_ROOT,"upload_cur",date_path+'_'+myFile.name)
        try:
            if not os.path.exists(settings.MEDIA_ROOT+"/upload_cur"):
                os.mkdir(settings.MEDIA_ROOT+"/upload_cur")
            # if not os.path.exists(settings.MEDIA_ROOT+"/upload/"+date_path):
            #     os.mkdir(settings.MEDIA_ROOT+"/upload/"+date_path)
        except:
            print("create path error "+path_path)
            return response_en("创建路径失败",500)

        #在服务器留存一份上传文件
        destination = open(path_path,'wb+')
        for chunk in myFile.chunks():      # 分块写入文件
            destination.write(chunk)
        destination.close()

        if os.path.splitext(myFile.name)[-1] != '.xlsx':
            return response_en("上传文件格式错误",500)
        #print(path_path)
        workbook = load_workbook(path_path)
        sheets = workbook.get_sheet_names()         #从名称获取sheet
        booksheet = workbook.get_sheet_by_name(sheets[0])
        #迭代所有的行
        all_data = []
        for row in booksheet.rows:
            line = [col.value for col in row]
            if type(line)==type([]) and line[0] != None:
                all_data.append(line)
        if len(all_data) <= 1:
            return response_en("上传文件没有包含数据",500)
        #取出真正要存到数据库中的数据
        db_data_list = []
        #舍弃第一栏(不判断可能会出现的数据错误,因为处理订单数据太麻烦)
        for row in all_data[1:]:
            line = []
            for col in row:
                #简单的非空判断还是需要的
                if col != None:
                    #货架数据直接和最后一个数据合并
                    if row.index(col) > 2:
                        line[2] = line[-1]+','+str(col)
                    else:
                        line.append(col)
            db_data_list.append(line)
        error_id = []
        error_name = []
        for data in db_data_list if db_data_list!=None else []:
            if len(data) != 3:
                return response_en("数据格式错误",500)
            if len(curriculum_reqeust.find_db(data[0])) > 0 :
                error_id.append(data[0])
                continue
            if len(curriculum_reqeust.find_db_name(data[1])) > 0 :
                error_name.append(data[1])
                continue
            status_code = curriculum_reqeust.insert_db(data,None,None)
            if status_code != 200 :
                return response_en("保存异常",status_code)
        # if len(error_id) > 0 :
        #     return response_en("课程ID重复 "+str(error_id),503,{"error_id_list":error_id})
        # elif len(error_name) > 0 :
        #     return response_en("课程名称重复 "+str(error_name),503,{"error_id_list":error_name})
        # else:
        #     return response_en("数据保存成功",200)
        res_mes = "成功录入"+str(len(db_data_list)-len(error_id)-len(error_name))+"条数据"
        if len(error_id) > 0 :
            res_mes += "\n"+str(len(error_id))+"条数据课程ID重复"
        if len(error_name) > 0 :
            res_mes += "\n"+str(len(error_name))+"条数据课程名称重复"
        return response_en(res_mes,200)


    @csrf_exempt
    def get_list(request):
        error = response_error(request,'POST',['page_index','page_size'])
        if error[1] != 200:
            return response_en(error[0],error[1])
        #必传参数
        page_index  = int(request_body(request,'page_index'))
        page_size   = int(request_body(request,'page_size'))
        #可选参数
        c_id    = request_body(request,'cur_id')
        c_name   = request_body(request,'cur_name')
        g_ids   = request_body(request,'goods_id')
        sql         = 'SELECT * FROM GLCCurriculum WHERE 1=1 '
        if c_id != None:
            sql += 'and curriculum_id like \'%%'+str(c_id)+'%%\' '
        if c_name != None:
            sql += 'and curriculum_name like \'%%'+str(c_name).replace('	','').replace('	','').replace(' ','')+'%%\' '
        if g_ids != None and len(g_ids.split(',')) > 0:
            sql += 'and ('
            for gid in g_ids.split(','):
                sql += 'curriculum_good_list like \'%%'+str(gid)+'%%\' or '
            sql = sql[0:-3]#最后的or切掉
            sql += ') '
        # print(sql)

        #排序语句需要加到后面
        sql += 'ORDER BY id DESC'
        #先查出count
        count_sql = sql#.replace("*","count(*)")
        all_count    = curriculum.objects.raw(count_sql) #暂时找不到更好的办法

        #分页需要加到最后面
        sql += ' LIMIT '+str(page_size)+' offset '+str(page_size*page_index)

        print('sql - '+sql)
        all_data    = curriculum.objects.raw(sql)
        return response_en("数据正常",200,{'list':curriculum_reqeust.result_to_arr(all_data),'all_count':len(all_count),'page_index':page_index,'page_size':page_size})

    def result_to_arr(result2):
        # print(result2)
        arr = []
        for c in result2:
            arr.append({
                'c_id':c.curriculum_id,
                'c_name':c.curriculum_name,
                'g_id_list':c.curriculum_good_list,
                'db_install_time':c.db_install_time.strftime('%Y-%m-%d %H:%M:%S'),
                'db_update_time':c.db_update_time.strftime('%Y-%m-%d %H:%M:%S'),
                'cur_expiration_date':c.cur_expiration_date.strftime('%Y-%m-%d %H:%M:%S'),
                'cur_start_date':c.cur_start_date.strftime('%Y-%m-%d %H:%M:%S'),
            })
        return arr

    def search_cur_data(cur_name_list_tmp):
        cur_name_list = cur_name_list_tmp
        if type(cur_name_list_tmp) != type([]):
            cur_name_list = [cur_name_list_tmp]
        cur_data_map = {}
        for curName in cur_name_list:
            curName = curName.replace('，',',').replace('＊','*')
            cur_list = curName.split(',')
            if type(cur_list)!=type([]) or len(cur_list)==0:
                return response_en("教材名称异常",500,['教材名称异常'])
            f_cur_list = []
            for name_num in cur_list:
                name_num_list = name_num.split('*')
                c_name = name_num_list[0]
                c_num = name_num_list[1] if len(name_num_list) > 1 else 1
                # c_name_db = curriculum.objects.filter(curriculum_name=c_name.replace('	','').replace('	','').replace(' ',''))
                c_name_db = curriculum.objects.filter(curriculum_name=c_name)
                if len(c_name_db)==0:
                    f_cur_list.append({"c_name":c_name,"c_id":'000000',"c_num":c_num,"c_goods_list":[]})
                    continue
                # print('test')
                c_goods_list = goods_reqeust.findGoodsData(c_name_db[0].curriculum_good_list)
                f_cur_list.append({"c_name":c_name,"c_num":c_num,"c_id":c_name_db[0].curriculum_id,"c_goods_list":c_goods_list})
            cur_data_map[curName] = f_cur_list
        return cur_data_map

    @csrf_exempt
    def findCur(request):
        error = response_error(request,'POST')
        if error[1] != 200:
            return response_en(error[0],error[1])
        cur_name_list = request_body(request,"curNameList")
        if cur_name_list == None:
            if request_body(request,"curName") == None:
                return response_en(500,'curName或curNameList必须传一个')
            cur_name_list = [request_body(request,"curName")]
        return response_en("数据正常",200,curriculum_reqeust.search_cur_data(cur_name_list))
