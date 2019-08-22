<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login">
        <div class="login-con">
            <Card icon="log-in" title="欢迎登录" :bordered="false">
                <div class="form-con">
                    <login-form @on-success-valid="handleSubmit"></login-form>
                    <p class="login-tip">输入任意用户名和密码即可</p>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
    import LoginForm from '_c/login-form'
    import {Message} from 'iview';

    import {mapActions} from 'vuex'

    export default {
        components: {
            LoginForm
        },
        methods: {
            ...mapActions([
                'handleLogin',
                'getUserInfo'
            ]),
            handleSubmit({userName, password, captchaCode}) {
                this.handleLogin({userName, password, captchaCode}).then(res => {

                    if (res.data.access_token != '') {
                        this.getUserInfo({
                            userCode:userName
                        }).then(res => {
                            this.$router.push({
                                name: this.$config.homeName
                            })
                        })
                    } else {
                        const msg = Message.error({
                            content: '用户名和密码错误！',
                            duration: 0
                        });
                        setTimeout(msg, 3000);
                    }
                })
                    .catch(error => {
                        const msg = Message.error({
                            content: error.response.data.message,
                            duration: 0
                        });
                        setTimeout(msg, 3000);
                    })
            }
        }
    }
</script>

<style>

</style>
