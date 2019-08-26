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
    import {queryMenu} from '@/api/user'
    import {appRouter} from '@/router/routers';
    import router from '@/router';
    import {mapActions} from 'vuex'
    import {routers} from '@/router/routers'

    /**
     * 构建树形数据
     * @param rows
     * @returns {Array}
     */
    function convert(rows) {
        function exists(rows, resParCode) {
            for (var i = 0; i < rows.length; i++) {
                if (rows[i].resCode == resParCode) return true;
            }
            return false;
        }

        function copyRoute(row) {
            return {
                resParCode: row.resParCode,
                resParName: row.resParName,
                resCode: row.resCode,
                name: row.resCode,
                meta: {
                    title: row.resName,
                    icon: row.resIcon
                },
                path: row.resUrl,
                sysCode: row.sysCode
                // component: row.resUrl,
            }
        }

        var nodes = [];
        // get the top level nodes
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if (!exists(rows, row.resParCode)) {
                nodes.push(copyRoute(row));
            }
        }
        var toDo = [];
        for (var i = 0; i < nodes.length; i++) {
            toDo.push(nodes[i]);
        }
        while (toDo.length) {
            var node = toDo.shift();
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                if (row.resParCode == node.resCode) {
                    var child = copyRoute(row)
                    if (node.children) {
                        node.children.push(child);
                    } else {
                        node.children = [child];
                    }
                    toDo.push(child);
                }
            }
        }
        return nodes;
    }

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
                        // 加载菜单
                        queryMenu({
                            userCode: userName,
                            sysCode: process.env.VUE_APP_SYSCODES
                        }).then(res => {
                            let menus = res.data.data.menus
                            let converMenus = convert(menus == null ? [] : menus)
                            let addRouters = []
                            appRouter.forEach(item => {
                                item.children = converMenus.filter(m => item.name === m.sysCode)
                                if (item.children != null && item.children.length > 0)
                                    addRouters.push(item)
                            })
                            sessionStorage.setItem("navbar-routers", JSON.stringify(converMenus))
                            router.addRoutes(addRouters)
                            routers.push(...addRouters)
                            // 获取用户基本信息
                            this.getUserInfo({
                                userCode: userName
                            }).then(res => {
                                this.$router.push({
                                    name: this.$config.homeName
                                })
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
