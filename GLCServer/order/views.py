import json
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from order.models import order
from GLCServer.request import response_en,request_body,response_error
from django.utils.dateparse import parse_datetime
import os
from django.conf import settings
from datetime import datetime
from openpyxl import load_workbook
import time
from curriculum.views import curriculum_reqeust
from goods.models import goods

class order_reqeust():
    def insert_db(o_data=[]):
        if o_data==None or len(o_data) < 7 :
            return 501
        # print(o_data)
        db = order()
        db.order_id         = o_data[0] if o_data[0]!=None else ''
        db.tracking_id      = o_data[1] if o_data[1]!=None else ''
        db.platform_id      = o_data[2] if o_data[2]!=None else ''
        db.other_order_id   = o_data[3] if o_data[3]!=None else ''
        db.order_status     = o_data[4] if o_data[4]!=None else ''
        db.other_param_0    = o_data[5] if o_data[5]!=None else ''
        db.other_param_1    = o_data[6] if o_data[6]!=None else ''
        db.other_param_2    = o_data[7] if o_data[7]!=None else ''
        db.other_param_3    = o_data[8] if o_data[8]!=None else ''
        db.other_param_4    = o_data[9] if o_data[9]!=None else ''
        db.other_param_5    = o_data[10] if o_data[10]!=None else ''
        db.other_param_6    = o_data[11] if o_data[11]!=None else ''
        db.other_param_7    = o_data[12] if o_data[12]!=None else ''
        db.other_param_8    = o_data[13] if o_data[13]!=None else ''
        db.other_param_9    = o_data[14] if o_data[14]!=None else ''
        db.other_param_a    = o_data[15] if o_data[15]!=None else ''
        db.user_name        = o_data[16] if o_data[16]!=None else ''
        db.user_phone       = o_data[17] if o_data[17]!=None else ''
        db.user_addr        = o_data[18] if o_data[18]!=None else ''
        db.user_company     = o_data[19] if o_data[19]!=None else ''
        db.order_package_number = o_data[20] if o_data[20]!=None else ''
        db.curriculum       = o_data[21] if o_data[21]!=None else ''
        db.order_time       = o_data[22] if o_data[22]!=None else ''
        db.other_param_b    = o_data[23] if o_data[23]!=None else ''
        db.other_param_c    = o_data[24] if o_data[24]!=None else ''
        db.other_param_d    = o_data[25] if o_data[25]!=None else ''
        db.other_param_e    = o_data[26] if o_data[26]!=None else ''
        db.other_param_f    = o_data[27] if o_data[27]!=None else ''
        db.other_param_10   = o_data[28] if o_data[28]!=None else ''
        db.expected_time    = o_data[29] if o_data[29]!=None else ''
        db.order_weight     = o_data[30] if o_data[30]!=None else ''
        db.other_param_11   = o_data[31] if o_data[31]!=None else ''
        db.other_param_12   = o_data[32] if o_data[32]!=None else ''
        db.order_state_time = o_data[33] if o_data[33]!=None else ''
        # db.curriculum_num   = o_data[34] if len(o_data)>34 and o_data[34]!=None else '1'
        db.order_db_status  = 0 if o_data[4] =='下单' else 6
        db.save()
        return 200

    def delete_db(o_id):
        if o_id == None :
            return
        db = order.objects.get(order_id=o_id)
        db.delete()

    def modify_db(o_id,o_data):
        if o_id == None :
            return
        db = order.objects.get(order_id=o_id)
        db.order_id         = o_data[0] if o_data[0]!=None else ''
        db.tracking_id      = o_data[1] if o_data[1]!=None else ''
        db.platform_id      = o_data[2] if o_data[2]!=None else ''
        db.other_order_id   = o_data[3] if o_data[3]!=None else ''
        db.order_status     = o_data[4] if o_data[4]!=None else ''
        db.other_param_0    = o_data[5] if o_data[5]!=None else ''
        db.other_param_1    = o_data[6] if o_data[6]!=None else ''
        db.other_param_2    = o_data[7] if o_data[7]!=None else ''
        db.other_param_3    = o_data[8] if o_data[8]!=None else ''
        db.other_param_4    = o_data[9] if o_data[9]!=None else ''
        db.other_param_5    = o_data[10] if o_data[10]!=None else ''
        db.other_param_6    = o_data[11] if o_data[11]!=None else ''
        db.other_param_7    = o_data[12] if o_data[12]!=None else ''
        db.other_param_8    = o_data[13] if o_data[13]!=None else ''
        db.other_param_9    = o_data[14] if o_data[14]!=None else ''
        db.other_param_a    = o_data[15] if o_data[15]!=None else ''
        db.user_name        = o_data[16] if o_data[16]!=None else ''
        db.user_phone       = o_data[17] if o_data[17]!=None else ''
        db.user_addr        = o_data[18] if o_data[18]!=None else ''
        db.user_company     = o_data[19] if o_data[19]!=None else ''
        db.order_package_number = o_data[20] if o_data[20]!=None else ''
        db.curriculum       = o_data[21] if o_data[21]!=None else ''
        db.order_time       = o_data[22] if o_data[22]!=None else ''
        db.other_param_b    = o_data[23] if o_data[23]!=None else ''
        db.other_param_c    = o_data[24] if o_data[24]!=None else ''
        db.other_param_d    = o_data[25] if o_data[25]!=None else ''
        db.other_param_e    = o_data[26] if o_data[26]!=None else ''
        db.other_param_f    = o_data[27] if o_data[27]!=None else ''
        db.other_param_10   = o_data[28] if o_data[28]!=None else ''
        db.expected_time    = o_data[29] if o_data[29]!=None else ''
        db.order_weight     = o_data[30] if o_data[30]!=None else ''
        db.other_param_11   = o_data[31] if o_data[31]!=None else ''
        db.other_param_12   = o_data[32] if o_data[32]!=None else ''
        db.order_state_time = o_data[33] if o_data[33]!=None else ''
        # db.curriculum_num   = o_data[34] if o_data[34]!=None else ''
        db.order_db_status  = o_data[34] if o_data[34]!=None else '6'
        db.save()



    def find_db(o_id):
        if o_id == None :
            return []
        result = order.objects.filter(order_id=o_id)
        return order_reqeust.result_to_arr(result)

    def result_to_arr(result):
        arr = []
        for c in result:
            arr.append({
                'order_id':c.order_id,
                'tracking_id':c.tracking_id,
                'platform_id':c.platform_id,
                'other_order_id':c.other_order_id,
                'order_status':c.order_status,
                'other_param_0':c.other_param_0,
                'other_param_1':c.other_param_1,
                'other_param_2':c.other_param_2,
                'other_param_3':c.other_param_3,
                'other_param_4':c.other_param_4,
                'other_param_5':c.other_param_5,
                'other_param_6':c.other_param_6,
                'other_param_7':c.other_param_7,
                'other_param_8':c.other_param_8,
                'other_param_9':c.other_param_9,
                'other_param_a':c.other_param_a,
                'user_name':c.user_name,
                'user_phone':c.user_phone,
                'user_addr':c.user_addr,
                'user_company':c.user_company,
                'order_package_number':c.order_package_number,
                'curriculum':c.curriculum,
                'order_time':c.order_time,#.strftime('%Y-%m-%d %H:%M:%S'),
                'other_param_b':c.other_param_b,
                'other_param_c':c.other_param_c,
                'other_param_d':c.other_param_d,
                'other_param_e':c.other_param_e,
                'other_param_f':c.other_param_f,
                'other_param_10':c.other_param_10,
                'expected_time':c.expected_time,
                'order_weight':c.order_weight,
                'other_param_11':c.other_param_11,
                'other_param_12':c.other_param_12,
                'order_state_time':c.order_state_time,
                'order_db_status':c.order_db_status,
                'order_db_install_time':c.order_db_install_time.strftime('%Y-%m-%d %H:%M:%S'),
                'order_db_update_time':c.order_db_update_time.strftime('%Y-%m-%d %H:%M:%S'),
                # 'curriculum_num':c.curriculum_num
            })
        return arr

    @csrf_exempt
    def insert(request):
        error = response_error(request,'POST',['data'])
        if error[1] != 200:
            return response_en(error[0],error[1])
        data = request_body(request,'data')
        if len(data) != 34 or data == None:
            return response_en("数据格式错误",500)
        if data[0] == None:
            return response_en("订单ID错误",500)
        if len(order_reqeust.find_db(data[0])) > 0 :
            return response_en("订单ID重复",500)
        status_code = order_reqeust.insert_db(data)
        return response_en("存入成功" if status_code==200 else "保存异常",status_code)

    # @csrf_exempt
    # def insert_list(request):
    #     error = response_error(request,'POST',['list_data'])
    #     if error[1] != 200:
    #         return response_en(error[0],error[1])
    #     list_data = request_body(request, 'list_data')
    #     error_id  = []
    #     for data in list_data if list_data!=None else []:
    #         if len(data) != 35:
    #             return response_en("数据格式错误",500)
    #         if len(order_reqeust.find_db(data[0])) > 0 :
    #             error_id.append(data[0])
    #             continue
    #         status_code = order_reqeust.insert_db(data)
    #         if status_code != 200 :
    #             return response_en("保存异常",status_code)
    #     if len(error_id) > 0 :
    #         return response_en("订单ID重复",503,{"error_id_list":error_id})
    #     else:
    #         return response_en("数据保存成功",200)

    @csrf_exempt
    def upload_file(request):
        start = time.time()
        # 获取上传的文件，如果没有文件，则默认为None
        myFile =request.FILES.get("file", None)
        # print(myFile)
        if not myFile:
            return response_en("没有找到上传的文件",500)
        # 打开特定的文件进行二进制的写操作
        date_path = datetime.now().strftime('%Y-%m-%d %H.%M.%S')
        path_path = os.path.join(settings.MEDIA_ROOT,"upload_order",date_path+'_'+myFile.name)
        # print("test1 - "+str(time.time()-start))
        try:
            if not os.path.exists(settings.MEDIA_ROOT+"/upload_order"):
                os.mkdir(settings.MEDIA_ROOT+"/upload_order")
        except:
            print("create path error "+path_path)
            return response_en("创建路径失败",500)
            #在服务器留存一份上传文件
        # print("test2 - "+str(time.time()-start))
        destination = open(path_path,'wb+')
        for chunk in myFile.chunks():      # 分块写入文件
            destination.write(chunk)
        destination.close()

        # print("test3 - "+str(time.time()-start))
        if os.path.splitext(myFile.name)[-1] != '.xlsx':
            return response_en("上传文件格式错误",500)
        #print(path_path)
        workbook = load_workbook(path_path)
        sheets = workbook.get_sheet_names()         #从名称获取sheet
        booksheet = workbook.get_sheet_by_name(sheets[0])
        #迭代所有的行
        print("test4 - "+str(time.time()-start))
        all_data = []
        for row in booksheet.rows:
            line = [col.value for col in row]
            if type(line)==type([]) and line[0] != None:
                all_data.append(line)
        if len(all_data) <= 1:
            return response_en("上传文件没有包含数据",500)
        # print("test5 - "+str(time.time()-start))
        #取出真正要存到数据库中的数据
        db_data_list = all_data[1:]
        error_id = []
        for data in db_data_list if db_data_list!=None else []:
            if len(data) != 34:#京东xlsx表格中横向只有34条数据
                return response_en("数据格式错误,目前仅支持京东模版",500)
            # print("test5-1 - "+str(time.time()-start))
            # result = order.objects.filter(order_id=data[0])
            # if len(result) > 0 :
            #     print("test5-2 - "+str(time.time()-start))
            #     error_id.append(data[0])
            #     continue
            try:
                status_code = order_reqeust.insert_db(data)
                # print("test5-2 - "+str(time.time()-start))
                if status_code != 200 :
                    return response_en("保存异常",status_code)
            except:
                error_id.append(data[0])
                # print("test5-3 - "+str(time.time()-start))
        # print("test6 - "+str(time.time()-start))
        res_mes = "成功录入"+str(len(db_data_list)-len(error_id))+"条数据"
        if len(error_id) > 0 :
            res_mes += "\n"+str(len(error_id))+"条数据ID重复"
        return response_en(res_mes,200)

    @csrf_exempt
    def delete(request):
        error = response_error(request,'POST',['o_id'])
        if error[1] != 200:
            return response_en(error[0],error[1])
        o_id = request_body(request, 'o_id')
        if len(order_reqeust.find_db(o_id)) > 0 :
            order_reqeust.delete_db(o_id)
            return response_en("删除成功",200)
        else:
            return response_en("没有找到对应数据",501)

    @csrf_exempt
    def modify(request):
        error = response_error(request,'POST',['o_id','o_list'])
        if error[1] != 200:
            return response_en(error[0],error[1])
        o_id = request_body(request,'o_id')
        o_list = request_body(request,'o_list')
        # if len(o_list) != 34 or o_id == None:
        #     return response_en("数据格式错误",500)
        if len(order_reqeust.find_db(o_id)) > 0 :
            list = order_reqeust.modify_db(o_id,o_list)
            return response_en('修改成功',200)#order_reqeust.find_db(o_id)
        else:
            return response_en("没有找到对应数据",501)

    @csrf_exempt
    def find(request):
        error = response_error(request,'POST',['o_id'])
        if error[1] != 200:
            return response_en(error[0],error[1])
        o_id = request_body(request, 'o_id')
        list = order_reqeust.find_db(o_id)
        return response_en(list,200)

    @csrf_exempt
    def set_Status(request):
        error = response_error(request,'POST',['o_id','o_status'])
        if error[1] != 200:
            return response_en(error[0],error[1])
        o_id = request_body(request,'o_id')
        o_status = request_body(request,'o_status')
        if o_status == None or o_id == None:
            return response_en("数据格式错误",500)
        if len(order_reqeust.find_db(o_id)) > 0 :
            # 将订单库存设置为4 已发货
            db = order.objects.get(order_id=o_id)
            db.order_db_status = o_status
            db.save()
            # 找到这个课程
            cur_data_map = curriculum_reqeust.search_cur_data(db.curriculum)
            for key in cur_data_map:
                f_cur_list = cur_data_map[key]
                for cur_data_map in f_cur_list:
                    c_num = cur_data_map['c_num']
                    for goods_data_id in cur_data_map['c_goods_list']:
                        goods_db = goods.objects.get(goods_id=goods_data_id)
                        goods_db.goods_stock = goods_db.goods_stock - c_num
                        goods_db.save()
            return response_en("修改成功",200,order_reqeust.find_db(o_id))
        else:
            return response_en("没有找到对应数据",501)



    @csrf_exempt
    #获取订单状态列表,用于指定查询专用
    def get_status_list(request):
        error = response_error(request,'POST')
        if error[1] != 200:
            return response_en(error[0],error[1])
        status_list = []
        for p in order.objects.raw('SELECT order_status , id FROM GLCOrder'):
            status_list.append(p.order_status)
        return response_en("查询成功",200,{"status":list(set(status_list))})

    @csrf_exempt
    def get_list(request):
        error = response_error(request,'POST',['page_index','page_size'])
        if error[1] != 200:
            return response_en(error[0],error[1])
        #必传参数
        page_index  = int(request_body(request,'page_index'))
        page_size   = int(request_body(request,'page_size'))
        #可选参数
        order_id    = request_body(request,'order_id')
        tracking_id    = request_body(request,'tracking_id')
        user_name   = request_body(request,'user_name')
        start_time  = request_body(request,'start_time')
        end_time    = request_body(request,'end_time')
        order_status= request_body(request,'order_status')
        order_db_status = request_body(request,'order_db_status')
        try:
            sql         = 'SELECT * FROM GLCOrder WHERE 1=1 '
            if order_id != None:
                sql += 'and order_id like \'%%'+str(order_id)+'%%\' '
            if tracking_id != None:
                sql += 'and tracking_id =\''+str(tracking_id)+'\' '
            if user_name != None:
                sql += 'and user_name like \'%%'+str(user_name)+'%%\' '
            if order_status != None:
                sql += 'and order_status =\''+str(order_status)+'\' '
            if start_time != None:
                sql += 'and order_db_install_time>\''+str(start_time)+' 00:00:00\' '
            if end_time != None:
                sql += 'and order_db_install_time<\''+str(end_time)+' 23:59:59\' '
            if order_db_status != None:
                sql += 'and order_db_status='+order_db_status+' '
            #排序语句需要加到后面
            sql += 'ORDER BY id DESC'
            #先查出count
            count_sql = sql#.replace("*","count(*)")
            all_count    = order.objects.raw(count_sql) #暂时找不到更好的办法

            #分页需要加到最后面
            sql += ' LIMIT '+str(page_size)+' offset '+str(page_size*page_index)

            print('sql - '+sql)
            all_data    = order.objects.raw(sql)
            print('all_data - '+str(len(all_data)))
            return response_en("数据正常",200,{'list':order_reqeust.result_to_arr(all_data),'all_count':len(all_count),'page_index':page_index,'page_size':page_size})
        except:
            return response_en("服务器错误",500,{})
