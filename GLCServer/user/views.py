import json
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from user.models import user
from GLCServer.request import response_en, request_body, response_error
import hashlib
import os
import time


class user_reqeust():

    def modify_db_pwd(username,password):
        db = user.objects.get(username=username)
        db.username = username
        db.password = password
        db.save()

    #查询用户名是否重复
    def find_user(username):
        result = user.objects.filter(username=username)
        return result

    @csrf_exempt
    def register(request):
        error = response_error(request,'POST',['username','password','user_type'],False)
        if error[1] != 200:
            return response_en(error[0],error[1])
        username = request_body(request,'username')
        password = request_body(request,'password')
        user_type= request_body(request,'user_type')
        if username==None or password==None:
            return response_en("数据格式错误",500)
        result = user.objects.filter(username=username)
        if len(result) > 0 :
            return response_en("用户名已注册",500)
        db = user()
        db.username = username
        db.password = password
        db.user_type= user_type if user_type!=None else 0
        db.user_token = hashlib.sha1(os.urandom(24)).hexdigest()
        db.token_timeout = time.time()+3600*24
        db.save()
        user_dict = {"username":db.username,"user_type":db.user_type,"user_token":db.user_token,"token_timeout":db.token_timeout}
        return response_en("注册成功",200,user_dict)

    @csrf_exempt
    def login(request):
        error = response_error(request,'POST',['username','password'],False)
        if error[1] != 200:
            return response_en(error[0],error[1])
        username = request_body(request,'username')
        password = request_body(request,'password')
        if username==None or password==None:
            return response_en("数据格式错误",500)
        if len(user.objects.filter(username=username)) == 0 :
            return response_en("没有找到用户",505)
        db = user.objects.get(username=username)
        if db.password != password:
            return response_en("密码错误",506)
        db.user_token = hashlib.sha1(os.urandom(24)).hexdigest()
        db.token_timeout = time.time()+3600*24
        db.save()
        user_dict = {"username":db.username,"user_type":db.user_type,"user_token":db.user_token,"token_timeout":db.token_timeout}
        return response_en("登录成功",200,user_dict)


    # @csrf_exempt
    # def delete(request):
    #     if request.method != 'POST':
    #         return response_en("只支持post方式",500)
    #     username = request_body(request,'username')
    #     db = user.objects.get(username=username)
    #     db.delete()
    #     return response_en("删除成功",200)
    #
    #
    # @csrf_exempt
    # def modify(request):
    #     if request.method != 'POST':
    #         return response_en("只支持post方式",500)
    #     g_id = request_body(request,'g_id')
    #     g_list = request_body(request,'g_list')
    #     if len(goods_reqeust.find_db(g_id)) > 0 and g_id!=None and g_list!=None:
    #         list = goods_reqeust.modify_db(g_id,g_list)
    #         return response_en(goods_reqeust.find_db(g_id),200)
    #     else:
    #         return response_en("没有找到对应数据",501)
    #
    # @csrf_exempt
    # def find(request):
    #     if request.method != 'POST':
    #         return response_en("只支持post方式",500)
    #     g_id = request_body(request,'g_id')
    #     list = goods_reqeust.find_db(g_id)
    #     return response_en(list,200)

