<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login">
        <div class="login-con">
            <Card icon="log-in" title="欢迎登录" :bordered="false">
                <div class="form-con">
                    <login-form @on-success-valid="handleSubmit"></login-form>
                    <p class="login-tip">中骅物流IT信息技术中心提供</p>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
    import LoginForm from '_c/login-form'
    import {Message} from 'iview';
    import {queryMenu, orgQuery} from '@/api/user'
    import router from '@/router';
    import {mapActions} from 'vuex'
    import {routers} from '@/router/routers'
    import { convert } from '@/libs/util'
    import Main from '@/components/main'

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
                    // 加载菜单
                    queryMenu({
                        userCode: userName,
                        sysCode: window.getAllSys().join(',').replace(/view-/g, '')
                    }).then(res => {
                        let menus = res.data.data.menus;
                        let syss = res.data.data.syss;
                        sessionStorage.setItem("navbar-buttons", JSON.stringify(res.data.data.buttons));
                        sessionStorage.setItem("navbar-menus", JSON.stringify(menus));
                        let converMenus = convert(menus == null ? [] : menus);
                        let addRouters = [];
                        syss.forEach(item => {
                            let sys=
                                {
                                    path: '/view-'+item.sysCode,
                                    name: item.sysCode,
                                    meta: {
                                        icon: item.sysIcon,
                                        title: item.sysName
                                    },
                                    component: Main,
                                    children: converMenus.filter(m => item.sysCode === m.resParCode)
                                };
                            addRouters.push(sys);

                        });
                        sessionStorage.setItem("navbar-syss", JSON.stringify(syss));
                        sessionStorage.setItem("navbar-converMenus", JSON.stringify(converMenus));
                        router.addRoutes(addRouters)
                        routers.push(...(addRouters.filter(item => {
                            return routers.indexOf(item) < 0
                        })));
                        // 获取用户基本信息
                        this.getUserInfo({
                            userCode: userName
                        }).then(res => {

                        })
                    })
                }).catch(error => {
                    const msg = Message.error({
                        content: error.response.data.error_description==null?error.response.data.message:error.response.data.error_description,
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
