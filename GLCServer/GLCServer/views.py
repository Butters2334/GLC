import json
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from goods.models import goods
from order.models import order
from curriculum.models import curriculum
from GLCServer.request import response_en, request_body, response_error
import os
from django.conf import settings
from datetime import datetime
from openpyxl import load_workbook
import time
from django.db.models import Count


class server_reqeust():
    @csrf_exempt
    def dashboard(request):
        error = response_error(request,'POST',[])
        if error[1] != 200:
            return response_en(error[0],error[1])
        today_time_str = time.strftime("%Y-%m-%d", time.localtime())
        start = time.time()
        # print("test1 - "+str(time.time()-start))
        all_goods_count    = goods.objects.count()
        # print("test2 - "+str(time.time()-start))
        today_goods_count    = len(goods.objects.raw('SELECT * FROM GLCGoods WHERE ( datediff ( db_install_time , \''+today_time_str+'\' ) = 0 )'))
        # print("test3 - "+str(time.time()-start))

        all_cur_count    = curriculum.objects.count()
        # print("test4 - "+str(time.time()-start))
        today_cur_count    = len(curriculum.objects.raw('SELECT * FROM GLCCurriculum WHERE ( datediff ( db_install_time , \''+today_time_str+'\' ) = 0 )'))
        # print("test5 - "+str(time.time()-start))

        all_order_count    = order.objects.count()
        # print("test6 - "+str(time.time()-start))
        today_order_count    = len(order.objects.raw('SELECT * FROM GLCOrder WHERE ( datediff ( order_db_install_time , \''+today_time_str+'\' ) = 0 )'))
        # print("test7 - "+str(time.time()-start))

        order_status = []
        db_status = ['待拣货','拣货中','待打包','待发货','发货中','已收件','已存档']
        for status in db_status:
            status_id       = str(db_status.index(status))
            status_count    = order.objects.filter(order_db_status=status_id).count()
            order_status.append({"status_name":status,"status_id":status_id,"status_count":status_count})
            # print("test8 - "+status_id+' - '+str(time.time()-start))

        return response_en("数据正常",200,{"all_goods_count":all_goods_count,"today_goods_count":today_goods_count,"all_cur_count":all_cur_count,"today_cur_count":today_cur_count,"all_order_count":all_order_count,"today_order_count":today_order_count,"order_status":order_status})