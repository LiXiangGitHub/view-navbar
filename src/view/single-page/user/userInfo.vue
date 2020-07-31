<template>
    <Card id="userInfoFieldCar" :bordered="true" title="用户中心">
        <Row style="height: 100%;" type="flex" :gutter="50">
            <Col :span="10" :offset="2">
            <Row>
                <Form ref="userInfoForm" :model="userInfoForm" :label-width="108" label-position="right">
                    <Row style="padding-top: 4px;">
                        <i-col span="24" style="height: 62px;">
                            <FormItem prop="userCode" label="用户编号：">
                                <Input type="text" v-model="userInfoForm.userCode" readonly/>
                            </FormItem>
                        </i-col>
                        <i-col span="24" style="height: 62px;">
                            <FormItem prop="userName" label="用户名称：">
                                <Input type="text" v-model="userInfoForm.userName" readonly/>
                            </FormItem>
                        </i-col>
                        <i-col span="24" style="height: 62px;">
                            <FormItem prop="userPhone" label="手机号：">
                                <Input type="text" v-model="userInfoForm.userPhone" readonly/>
                            </FormItem>
                        </i-col>
                        <i-col span="24" style="height: 62px;">
                            <FormItem prop="orgName" label="所属部门：">
                                <Input type="text" v-model="userInfoForm.orgName" readonly/>
                            </FormItem>
                        </i-col>
                    </Row>
                    <Row style="padding-left: 105px;width: 260px;"><!--style="padding-left: 100px;width: 150px;"-->
                        <Button type="error" long @click="btnChangePassWord">更改密码</Button>
                    </Row>
                </Form>
            </Row>
            </Col>
            <Col :span="12">
            <Upload
                    style="height: 100%;"
                    type="drag"
                    :before-upload="fileBeforeUpload"
                    action="//jsonplaceholder.typicode.com/posts/">
                <div>
                    <img id="userHeadImg" style="border-radius:50%;width: 252px;height: 252px;" :src="userInfoForm.userHead">
                    <div>
                        <Button type="success">点击更换头像</Button>
                    </div>
                </div>
            </Upload>
            </Col>
            <Modal ref="passWordDialog" v-model="passWordDialog" :title="passWordDialogTitle"
                   @on-ok="passWordDialogConfirm">
                <Form ref="passWordDialogForm" :model="passWordDialogForm" :rules="rolePassWordDialogFormForm"
                      :label-width="98">
                    <Row type="flex">
                        <i-col span="24">
                            <FormItem prop="originalPassword" label="原密码：">
                                <i-input type="text" v-model="passWordDialogForm.originalPassword">
                                    <span slot="prepend">
                                        <Icon :size="16" type="md-unlock"></Icon>
                                    </span>
                                </i-input>
                            </FormItem>
                        </i-col>
                        <i-col span="24">
                            <FormItem prop="newPassword" label="新密码：">
                                <i-input type="password" v-model="passWordDialogForm.newPassword">
                                    <span slot="prepend">
                                        <Icon :size="16" type="md-lock"></Icon>
                                    </span>
                                </i-input>
                            </FormItem>
                        </i-col>
                        <i-col span="24">
                            <FormItem prop="affirmNewPassword" label="确认密码：">
                                <i-input type="password" v-model="passWordDialogForm.affirmNewPassword">
                                    <span slot="prepend">
                                        <Icon :size="16" type="md-lock"></Icon>
                                    </span>
                                </i-input>
                            </FormItem>
                        </i-col>
                    </Row>
                </Form>
            </Modal>
        </Row>
    </Card>
</template>

<script>
    import {updatePassWord,updateHead,queryUser} from '@/api/user.js';
    import {chitu2userlogout} from '@/api/user'
    import {mapActions} from 'vuex'
    export default {
        name: 'userInfo',
        data() {
            return {
                userInfoForm: {
                    userCode: JSON.parse(sessionStorage.getItem("userInfo")).userId,
                    userName: '',
                    userPhone: '',
                    orgName: '',
                    userHead: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&amp;amp;gp=0.jpg'
                },
                file: null,
                //提现弹出框信息
                passWordDialog: false,
                passWordDialogTitle: '更改密码',
                passWordDialogFormCode: false,
                passWordDialogForm: {
                    userCode: JSON.parse(sessionStorage.getItem("userInfo")).userId,
                    originalPassword: '',
                    newPassword: '',
                    affirmNewPassword: ''
                },
                rolePassWordDialogFormForm: {
                    originalPassword: [
                        {required: true, message: '请输入原密码.', trigger: 'blur'}
                    ],
                    newPassword: [
                        {required: true, message: '请输入新密码.', trigger: 'blur'}
                    ],
                    affirmNewPassword: [
                        {required: true, message: '请输入新密码.', trigger: 'blur'}
                    ]
                }

            };
        },
        mounted() {
            this.queryUserInfo();
        },
        methods: {
            ...mapActions([
                'handleLogOut'
            ]),
            queryUserInfo: function () {
                queryUser({userCode: JSON.parse(sessionStorage.getItem("userInfo")).userId}).then(res => {
                    if(res.status===200){
                        this.userInfoForm.userCode = res.data.data.sysAuthUserQueryVoList[0].userCode;
                        this.userInfoForm.userName = res.data.data.sysAuthUserQueryVoList[0].userName;
                        this.userInfoForm.userPhone = res.data.data.sysAuthUserQueryVoList[0].userPhone;
                        this.userInfoForm.orgName = JSON.parse(sessionStorage.getItem("userInfo")).orgName;
                        //获取用户头像
                        let appid = "mps";
                        let serial_no = res.data.data.sysAuthUserQueryVoList[0].userHead;
                        if(serial_no!=null){
                            let xhr = new XMLHttpRequest();
                            let host = this.$fmsHost;
                            let vaurl = `/fsm/api/fsm_api/preview.do?file_app_id=${appid}&file_serial_no=${serial_no}`;
                            let url = host + vaurl;
                            xhr.open('GET', url, true);
                            xhr.responseType = 'blob';
                            xhr.onload = function (e) {
                                if (this.status == 200) {
                                    var blob = this.response;
                                    let imgUrl=URL.createObjectURL(blob);
                                    var imgSmall = document.getElementById('userHeadImg'); 	// 获取要显示图片的标签
                                    imgSmall.src=imgUrl;
                                }
                            };
                            xhr.send();
                        }
                    }else {
                        this.$Modal.error({title: '用户信息查询异常', content: response.msg});
                    }
                }).catch(error => {
                    this.$Modal.error({title: '用户信息查询异常', content: error.msg});
                });

            },
            fileBeforeUpload(file) {
                this.file = file;
                this.$Modal.confirm({
                    okText:'确定上传',
                    onOk:this.imgUploadSend,
                    render: (h) => {
                        return h('div', {
                            style:{
                                textAlign:'center'
                            }
                        },[
                            h('img',{
                                attrs: {
                                    id: 'userHeadImgShow'
                                },
                                style: {
                                    width: '252px',
                                    height: '252px',
                                    marginLeft:'center'
                                }
                            })
                        ])
                    }
                });
                var reader = new FileReader();	// 实例化一个FileReader对象，用于读取文件
                var img = document.getElementById('userHeadImgShow'); 	// 获取要显示图片的标签

                //读取File对象的数据
                reader.onload = function (evt) {
                    img.src = evt.target.result;
                }
                reader.readAsDataURL(this.file);
                return false;
            },
            imgUploadSend(){
                var data = new FormData();
                data.append('file', this.file);
                data.append('file_app_id', 'mps');
                let xhr = new XMLHttpRequest();
                let host = this.$fmsHost;
                let vaurl = "/fsm/api/fsm_api/upload.do";
                let url=host+vaurl;
                xhr.onreadystatechange=()=>{
                    //上传成功回调
                    let responText=xhr.responseText;
                    if(responText!=null && responText!=''){
                        let res=JSON.parse(responText);
                        let file_serial_no=res.data[0].file_serial_no;
                        updateHead({
                            userCode:this.userInfoForm.userCode,
                            userHead:file_serial_no
                        }).then(res => {
                            if(res.status===200){
                                var reader = new FileReader();	// 实例化一个FileReader对象，用于读取文件
                                var img = document.getElementById('userHeadImg'); 	// 获取要显示图片的标签
                                // var imgSmall = document.getElementById('userSmallHead').firstChild; 	// 获取要显示图片的标签
                                //读取File对象的数据
                                reader.onload = function (evt) {
                                    img.src = evt.target.result;
                                    // imgSmall.src = evt.target.result;
                                }
                                reader.readAsDataURL(this.file);
                                this.$Message.info({title: '上传成功!', content: res.data.errorCode+res.data.msg});
                            }else {
                                this.$Modal.error({title: '上传异常!', content: res.data.errorCode+res.data.msg});
                            }
                        }).catch(error => {
                            this.$Modal.error({title: '上传异常!', content: error.msg});
                        });
                    }
                };
                xhr.open('POST',url,false);
                xhr.send(data);
            },
            btnChangePassWord: function () {
                this.$refs.passWordDialogForm.resetFields();
                this.passWordDialogFormCode = false;
                this.passWordDialog = true;
            },
            passWordDialogConfirm: function () {
                //判断两次密码是否一致
                if (this.passWordDialogForm.newPassword != this.passWordDialogForm.affirmNewPassword) {
                    this.$Modal.warning({title: '操作失败', content: '两次密码输入不一致，请确认！'});
                    this.$refs.passWordDialog.visible = true;
                    this.passWordDialog = true;
                    return;
                }
                if (this.passWordDialogForm.newPassword.length < 6) {
                    this.$Modal.warning({title: '操作失败', content: '密码必须大于等于6位！'});
                    this.$refs.passWordDialog.visible = true;
                    this.passWordDialog = true;
                    return;
                }
                this.$refs.passWordDialogForm.validate((valid) => {
                    if (valid) {
                        if (!this.passWordDialogFormCode) {
                            updatePassWord(this.passWordDialogForm).then(res => {
                                if(res.status===200){
                                    this.$Message.info({title: '修改成功!', content: res.data.msg});
                                    this.handleLogOut().then(() => {
                                        //赤兔二代免登陆注销处理
                                        chitu2userlogout({}).then(res => {
                                            setchitu2Token('');
                                            setchitu2Org('');
                                            location.href = '/login'
                                            this.$Message.info({title: '提示信息', content: '赤兔二代免登陆注销处理成功!'});
                                        }).catch(error => {
                                            location.href = '/login'
                                            this.$Modal.error({title: '赤兔二代免登陆注销处理异常!', content: error.msg});
                                        });
                                    })
                                }else {
                                    this.$Modal.error({title: '修改异常!', content: res.data.msg});
                                }
                            }).catch(error => {
                                this.$Modal.error({title: '修改异常!', content: error.msg});
                            });
                        }
                    } else {
                        // form验证不通过时，弹出框不关闭
                        this.$refs.passWordDialog.visible = true;
                        this.passWordDialog = true;
                    }
                });
            },
        }
    };
</script>

<style>
</style>
