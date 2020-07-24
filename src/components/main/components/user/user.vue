<template>
    <div class="user-avator-dropdown">
        <Dropdown @on-click="handleClick">
            <Badge :dot="!!messageUnreadCount">
                <Avatar :src="userAvator"/>
            </Badge>
            <Icon :size="18" type="md-arrow-dropdown"></Icon>
            <DropdownMenu slot="list">
                <DropdownItem name="message">
                    消息中心
                    <Badge style="margin-left: 10px" :count="messageUnreadCount"></Badge>
                </DropdownItem>
                <DropdownItem name="logout">退出登录</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    </div>
</template>

<script>
    import './user.less'
    import {chitu2userlogout} from '@/api/user'
    import {setchitu2Token,setchitu2Org} from '@/libs/util'
    import {mapActions} from 'vuex'

    export default {
        name: 'User',
        props: {
            userAvator: {
                type: String,
                default: ''
            },
            messageUnreadCount: {
                type: Number,
                default: 0
            }
        },
        methods: {
            ...mapActions([
                'handleLogOut'
            ]),
            logout() {
                this.handleLogOut().then(() => {
                    /*  this.$router.push({
                        name: 'login'
                      })*/
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
            },
            message() {
                this.$router.push({
                    name: 'message_page'
                })
            },
            handleClick(name) {
                switch (name) {
                    case 'logout':
                        this.logout()
                        break
                    case 'message':
                        this.message()
                        break
                }
            }
        }
    }
</script>
