<template>
    <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
        <FormItem prop="userName">
            <Input v-model="form.userName" placeholder="请输入用户名">
        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
            </Input>
        </FormItem>
        <FormItem prop="password">
            <Input type="password" @input="transPassword" v-model="form.encodePassword" placeholder="请输入密码">
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
            </Input>
        </FormItem>

        <FormItem prop="captchaCode" v-if="captchaUrl!=='' && captchaUrl!==undefined">
            <Input type="text" v-model="form.captchaCode" placeholder="请输入验证码" style="width: 220px;float: left">
                                <span slot="prepend">
                                    <Icon :size="16" type="ios-umbrella"></Icon>
                                </span>
            </Input>
            <div style="float: right;margin-left: 10px;">
                <img :src="captchaUrl" v-on:click="changeCaptcha">
            </div>
        </FormItem>

        <FormItem>
            <Button @click="handleSubmit" type="primary" long>登录</Button>
        </FormItem>
    </Form>
</template>
<script>
    import {trans} from '@/api/user'

    export default {
        name: 'LoginForm',
        props: {
            userNameRules: {
                type: Array,
                default: () => {
                    return [
                        {required: true, message: '账号不能为空', trigger: 'blur'}
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
                    userName: '910001',
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
                    password: this.encodePassword,
                    captchaCode: this.captchaCode
                }
            }
        },
        methods: {
            handleSubmit() {
                this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        this.$emit('on-success-valid', this.form)
                    }
                })
            },
            transPassword() {
                trans(this.form).then(res => {
                    this.form.password = res.data.data
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
