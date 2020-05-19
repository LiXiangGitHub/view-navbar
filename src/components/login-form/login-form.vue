<template>
    <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
        <FormItem prop="userName">
            <Input  v-model="form.userName" placeholder="请输入用户名">
        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
            </Input>
        </FormItem>
        <FormItem prop="encodePassword">
            <Input type="password" v-model="form.encodePassword" placeholder="请输入密码">
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
            </Input>
        </FormItem>

        <FormItem prop="captchaCode" v-if="captchaUrl!=='' && captchaUrl!==undefined">
            <div style="display: flex">
                <Input type="text" v-model="form.captchaCode" placeholder="请输入验证码" style="width: 220px;">
                                <span slot="prepend">
                                    <Icon :size="16" type="ios-umbrella"></Icon>
                                </span>
                </Input>
                <img style="margin-left: 18px;" :src="captchaUrl" v-on:click="changeCaptcha">
            </div>

        </FormItem>

        <FormItem>
            <Button @click="handleSubmit" type="primary" long>登录</Button>
        </FormItem>
    </Form>
</template>
<script>
    import {trans} from '@/api/user'
    import {Message} from 'iview';
    export default {
        name: 'LoginForm',
        props: {
            userNameRules: {
                type: Array,
                default: () => {
                    return [
                        {required: true, message: '用户名不能为空', trigger: 'blur'}
                    ]
                }
            },
            passwordRules: {
                type: Array,
                default: () => {
                    return [
                        {required: true, message: '密码不能为空', trigger: 'blur'}
                    ]
                }
            },
            captchaCodeRules: {
                type: Array,
                default: () => {
                    return [
                        {required: true, message: '验证码不能为空', trigger: 'blur'}
                    ]
                }
            }
        },
        data() {
            return {
                captchaUrl: '',
                form: {
                    userName: '',
                    password: '',
                    captchaCode: '',
                    encodePassword: ''
                }
            }
        },
        computed: {
            rules() {
                return {
                    userName: this.userNameRules,
                    encodePassword: this.passwordRules,
                    captchaCode: this.captchaCodeRules
                }
            }
        },
        methods: {
            handleSubmit() {
                this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                      trans(this.form).then(res => {
                          if(res.data.code==200){
                              this.form.password = res.data.data
                              this.$emit('on-success-valid', this.form)
                          }else {
                              const msg = Message.error({
                                  content: res.data.msg,
                                  duration: 0
                              });
                              setTimeout(msg, 3000);
                          }
                      })
                    }
                })
            },
            changeCaptcha() {
                this.captchaUrl = this.captchaUrl + '?d' + new Date();
            }
        },
        created() {
            this.captchaUrl = this.$captchaUrl + '?d' + new Date();
        }
    }
</script>
<style>
    .form-con .ivu-input{
        height: 40px;
    }
</style>
