import json
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from goods.models import goods
from GLCServer.request import response_en, request_body, response_error
import os
from django.conf import settings
from datetime import datetime
from openpyxl import load_workbook
from datetime import datetime,timedelta
import re


class goods_reqeust():
    def insert_db(g_data=[],e_date='',goods_type=0):
        if len(g_data) < 7 :
            return 501
        db = goods()
        db.goods_param_0 = g_data[0]
        db.goods_param_1 = g_data[1]
        db.goods_param_2 = g_data[2]
        db.goods_param_3 = g_data[3]
        db.goods_param_4 = g_data[4]
        db.goods_param_5 = g_data[5]
        db.goods_id      = g_data[6]
        db.goods_position_list = g_data[7]
        # db.goods_status = g_data[8]
        # db.goods_stock = g_data[9]
        # db.goods_stock_max = g_data[10]
        db.goods_type    = goods_type
        if e_date != None and len(e_date) > 0:
            db.goods_expiration_date = datetime.strptime(e_date,'%Y-%m-%d %H:%M:%S')
        else:
            db.goods_expiration_date = datetime.now()+timedelta(days=30*3)
        db.save()
        return 200

    def delete_db(g_id):
        db = goods.objects.get(goods_id=g_id)
        db.delete()

    def modify_db(g_id,g_data,e_date=''):
        db = goods.objects.get(goods_id=g_id)
        db.goods_param_0 = g_data[0]
        db.goods_param_1 = g_data[1] if g_data[1]!=None else ''
        db.goods_param_2 = g_data[2] if g_data[2]!=None else ''
        db.goods_param_3 = g_data[3] if g_data[3]!=None else ''
        db.goods_param_4 = g_data[4] if g_data[4]!=None else ''
        db.goods_param_5 = g_data[5] if g_data[5]!=None else ''
        # db.goods_id      = g_data[6]#主id不允许修改
        db.goods_position_list = g_data[7]
        db.goods_status = g_data[8] if g_data[8]!=None else '0'
        db.goods_stock = g_data[9]
        db.goods_stock_max = g_data[10]
        if e_date != None and len(e_date) > 0:
            db.goods_expiration_date = datetime.strptime(e_date,'%Y-%m-%d %H:%M:%S')
        else:
            db.goods_expiration_date = datetime.now()+timedelta(days=30*3)
        db.save()

    def find_db(g_id):
        result = goods.objects.filter(goods_id=g_id)
        return goods_reqeust.result_to_arr(result)

    def result_to_arr(result2):
        arr = []
        for c in result2:
            arr.append({
                'g_p_0':c.goods_param_0,
                'g_p_1':c.goods_param_1,
                'g_p_2':c.goods_param_2,
                'g_p_3':c.goods_param_3,
                'g_p_4':c.goods_param_4,
                'g_p_5':c.goods_param_5,
                'g_id':c.goods_id,
                'g_goods_position_list':c.goods_position_list,
                'goods_status':c.goods_status,
                'goods_stock':c.goods_stock,
                'goods_stock_max':c.goods_stock_max,
                'goods_type':c.goods_type,
                'goods_expiration_date':c.goods_expiration_date.strftime('%Y-%m-%d %H:%M:%S'),
                'db_install_time':c.db_install_time.strftime('%Y-%m-%d %H:%M:%S'),
                'db_update_time':c.db_update_time.strftime('%Y-%m-%d %H:%M:%S'),
            })
        return arr

    @csrf_exempt
    def insert(request):
        error = response_error(request,'POST',['data'])
        if error[1] != 200:
            return response_en(error[0],error[1])
        data = request_body(request,'data')
        e_date = request_body(request,'eDate')
        goods_type = request_body(request,'goods_type')
        if len(data) != 8 or data==None:
            return response_en("数据格式错误",500)
        if len(goods_reqeust.find_db(data[6])) > 0 :
            return response_en("商品ID重复",500)
        status_code = goods_reqeust.insert_db(data,e_date,int(goods_type))
        return response_en("存入成功" if status_code==200 else "保存异常",status_code)


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
        path_path = os.path.join(settings.MEDIA_ROOT,"upload_goods",date_path+'_'+myFile.name)
        try:
            if not os.path.exists(settings.MEDIA_ROOT+"/upload_goods"):
                os.mkdir(settings.MEDIA_ROOT+"/upload_goods")
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
                    if row.index(col) > 7:
                        line[7] = line[-1]+','+str(col)
                    else:
                        line.append(col)
            db_data_list.append(line)
        error_id = []
        for data in db_data_list if db_data_list!=None else []:
            if len(data) != 8:
                return response_en("数据格式错误",500)
            if len(goods_reqeust.find_db(data[6])) > 0 :
                error_id.append(data[6])
                continue
            status_code = goods_reqeust.insert_db(data,None,0)
            if status_code != 200 :
                return response_en("保存异常",status_code)
        # if len(error_id) > 0 :
        #     return response_en("教材ID重复",200,{"error_id_list" : error_id})
        # else:
        #     return response_en("数据保存成功",200)
        res_mes = "成功录入"+str(len(db_data_list)-len(error_id))+"条数据"
        if len(error_id) > 0 :
            res_mes += "\n"+str(len(error_id))+"条数据ID重复"
        return response_en(res_mes,200)

    @csrf_exempt
    def delete(request):
        error = response_error(request,'POST',['g_id'])
        if error[1] != 200:
            return response_en(error[0],error[1])
        g_id = request_body(request,'g_id')
        if len(goods_reqeust.find_db(g_id)) > 0 :
            goods_reqeust.delete_db(g_id)
            return response_en("删除成功",200)
        else:
            return response_en("没有找到对应数据",501)

    @csrf_exempt
    def modify(request):
        error = response_error(request,'POST',['g_id','g_list'])
        if error[1] != 200:
            return response_en(error[0],error[1])
        g_id = request_body(request,'g_id')
        g_list = request_body(request,'g_list')
        e_date = request_body(request,'eDate')
        try:
            datetime.strptime(e_date,'%Y-%m-%d %H:%M:%S')
        except:
            return response_en("过期时间输入错误",501)

        if len(g_list) < 10 :
            return response_en("传入参数错误",500)
        if len(goods_reqeust.find_db(g_id)) > 0 and g_id!=None and g_list!=None:
            list = goods_reqeust.modify_db(g_id,g_list,e_date)
            return response_en("修改成功",200,goods_reqeust.find_db(g_id))
        else:
            return response_en("没有找到对应数据",501)

    @csrf_exempt
    def find(request):
        error = response_error(request,'POST',['g_id'])
        if error[1] != 200:
            return response_en(error[0],error[1])
        g_id = request_body(request,'g_id')
        list = goods_reqeust.find_db(g_id)
        return response_en(list,200)

    @csrf_exempt
    #获取订单状态列表,用于指定查询专用
    def get_filter_list(request):
        error = response_error(request,'POST')
        if error[1] != 200:
            return response_en(error[0],error[1])
        goods_param_0 = []
        goods_param_1 = []
        goods_param_2 = []
        goods_param_3 = []
        goods_param_4 = []
        goods_param_5 = []
        for p in goods.objects.raw('SELECT * FROM GLCGoods'):
            goods_param_0.append(p.goods_param_0)
            goods_param_1.append(p.goods_param_1)
            goods_param_2.append(p.goods_param_2)
            goods_param_3.append(p.goods_param_3)
            goods_param_4.append(p.goods_param_4)
            goods_param_5.append(p.goods_param_5)
        return response_en("查询成功",200,{"goods_param_0":list(set(goods_param_0)),"goods_param_1":list(set(goods_param_1)),"goods_param_2":list(set(goods_param_2)),"goods_param_3":list(set(goods_param_3)),"goods_param_4":list(set(goods_param_4)),"goods_param_5":list(set(goods_param_5)),})


    @csrf_exempt
    def get_list(request):
        error = response_error(request,'POST',['page_index','page_size'])
        if error[1] != 200:
            return response_en(error[0],error[1])
        #必传参数
        page_index  = int(request_body(request,'page_index'))
        page_size   = int(request_body(request,'page_size'))
        #可选参数
        goods_id    = request_body(request,'goods_id')
        goods_name   = request_body(request,'goods_name')
        sql         = 'SELECT * FROM GLCGoods WHERE 1=1 '
        if goods_id != None:
            sql += 'and goods_id like \'%%'+str(goods_id)+'%%\' '
        if goods_name != None:
            search_sql = ' like \'%%'+str(goods_name)+'%%\' '
            sql += 'and ('+'goods_param_0'+search_sql+' or goods_param_1'+search_sql+' or goods_param_2'+search_sql+' or goods_param_3'+search_sql+' or goods_param_4'+search_sql+' or goods_param_5'+search_sql+')'

        #排序语句需要加到后面
        sql += 'ORDER BY id DESC'
        #先查出count
        count_sql = sql#.replace("*","count(*)")
        all_count    = goods.objects.raw(count_sql) #暂时找不到更好的办法

        #分页需要加到最后面
        sql += ' LIMIT '+str(page_size)+' offset '+str(page_size*page_index)

        print('sql - '+sql)
        all_data    = goods.objects.raw(sql)
        # print('all_data - '+str(len(all_data)))
        return response_en("数据正常",200,{'list':goods_reqeust.result_to_arr(all_data),'all_count':len(all_count),'page_index':page_index,'page_size':page_size})


    #课程列表中展示具体的教材
    @csrf_exempt
    def findGoods(request):
        error = response_error(request,'POST',['goodids'])
        if error[1] != 200:
            return response_en(error[0],error[1])
        goodids = request_body(request,"goodids")
        id_list = goodids.split(",")
        # print(id_list)
        if type(id_list)!=type([]) or len(id_list)==0:
            return response_en("教材id异常",500)
        data_list = {}
        for aid in id_list:
            alist = goods_reqeust.find_db(aid)
            data_list[aid] = alist[0] if len(alist)>0 else {}
        return response_en("数据正常",200,{'list':data_list})

    def findGoodsData(goods_id):
        id_list = goods_id.split(",")
        if type(id_list)!=type([]) or len(id_list)==0:
            return {}
        data_list = {}
        for aid in id_list:
            alist = goods_reqeust.find_db(aid)
            data_list[aid] = alist[0] if len(alist)>0 else {}
        return data_list


    @csrf_exempt
    def batch_check_with_goods_ids(request):
        error = response_error(request,'POST',['goods_ids'])
        if error[1] != 200:
            return response_en(error[0],error[1])
        #必传参数
        goods_ids  = request_body(request,'goods_ids')
        if type(goods_ids) != type([]) or len(goods_ids) == 0:
            return response_en('没有找到可用id',500)
        desc_list = []
        desc_count = 0
        for gid_str in goods_ids:
            #传过来的id数组可能带有*-=
            gid = gid_str
            desc = ''
            find_index = -1
            if max(gid_str.find('+'),gid_str.find('＋')) != -1 :
                find_index = max(gid_str.find('+'),gid_str.find('＋'))
                desc = ' 库存增加 '
            elif max(gid_str.find('-'),gid_str.find('－')) != -1 :
                find_index = max(gid_str.find('-'),gid_str.find('－'))
                desc = ' 库存减少 '
            elif max(gid_str.find('*'),gid_str.find('＊')) != -1 :
                find_index = max(gid_str.find('*'),gid_str.find('＊'))
                desc = ' 库存设为 '

            if find_index != -1:
                gid = gid_str[0:find_index]
                num_list = re.findall(r'^\d+',gid_str[find_index+1:])
                desc += num_list[0] if len(num_list)!=0 else '0'

            result = goods.objects.filter(goods_id=gid)
            if len(gid) == 0:
                desc_list.append('')
            elif len(result) == 0 :
                desc_list.append('没有找到对应教材')
            else:
                desc_count += 1
                c_data = result[0]
                c_name = ''
                if int(c_data.goods_type) == 0:
                    c_name = c_data.goods_param_0+'-'+c_data.goods_param_1+'-'+c_data.goods_param_2+'-'+c_data.goods_param_3+'-'+c_data.goods_param_4+'-'+c_data.goods_param_5
                else:
                    c_name = c_data.goods_param_0
                desc_list.append(c_name + '  '+desc)
        return response_en(str(desc_count)+"条数据校验通过",200,{'list':desc_list})


    @csrf_exempt
    def batch_modify_with_goods_ids(request):
        error = response_error(request,'POST',['goods_ids'])
        if error[1] != 200:
            return response_en(error[0],error[1])
        #必传参数
        goods_ids  = request_body(request,'goods_ids')
        if type(goods_ids) != type([]) or len(goods_ids) == 0:
            return response_en('没有找到可用id',500)
        desc_count = 0
        for gid_str in goods_ids:
            #传过来的id数组可能带有*-=
            gid = gid_str
            goods_stock = 0
            if max(gid_str.find('+'),gid_str.find('＋')) != -1 :
                find_index = max(gid_str.find('+'),gid_str.find('＋'))
                gid = gid_str[0:find_index]
                num_list = re.findall(r'^\d+',gid_str[find_index+1:])
                goods_stock = int(num_list[0]) if len(num_list)!=0 else 0
                result = goods.objects.filter(goods_id=gid)
                if len(result) > 0:
                    desc_count += 1
                    c_data = result[0]
                    c_data.goods_stock = c_data.goods_stock + goods_stock
                    c_data.save()
            elif max(gid_str.find('-'),gid_str.find('－')) != -1 :
                find_index = max(gid_str.find('-'),gid_str.find('－'))
                gid = gid_str[0:find_index]
                num_list = re.findall(r'^\d+',gid_str[find_index+1:])
                goods_stock = int(num_list[0]) if len(num_list)!=0 else 0
                result = goods.objects.filter(goods_id=gid)
                if len(result) > 0:
                    desc_count += 1
                    c_data = result[0]
                    c_data.goods_stock = c_data.goods_stock - goods_stock
                    c_data.save()
            elif max(gid_str.find('*'),gid_str.find('＊')) != -1 :
                find_index = max(gid_str.find('*'),gid_str.find('＊'))
                gid = gid_str[0:find_index]
                num_list = re.findall(r'^\d+',gid_str[find_index+1:])
                goods_stock = int(num_list[0]) if len(num_list)!=0 else 0
                result = goods.objects.filter(goods_id=gid)
                if len(result) > 0:
                    desc_count += 1
                    c_data = result[0]
                    c_data.goods_stock = goods_stock
                    c_data.save()
        if desc_count > 0:
            return response_en(str(desc_count)+"条数据修改成功",200)
        else:
            return response_en("没有找到合适的id",500)
