import React, {Component} from 'react'
import {NavBar, Toast, Icon, Modal, WingBlank, WhiteSpace, List} from 'antd-mobile'
import Account from "../../../components/account/account";
import {storage, keys, config, url, baseDecimal, lang} from "../../../config/common";
const ac = new Account();
class Manage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ac:''
        }
    }

    componentWillMount() {
        const address = this.props.match.params.address;
        let act = new Account(address);
        if(act.Detail()){
            this.setState({
                ac:act
            })
        }else{
            Toast.fail(lang.e().toast.error.accountExisted,1)
            setTimeout(function () {
                url.goPage(url.Personal,"")
            },1000)
        }
    }

    changePasswordHint = ()=>{
        const detail = this.state.ac.Detail();
        Modal.prompt(lang.e().page.walletManage.changePasswordHint, '',
            [
                {
                    text: lang.e().button.cancel,
                    onPress: value => new Promise((resolve) => {
                        resolve();
                    }),
                },
                {
                    text: lang.e().button.confirm,
                    onPress: value => new Promise((resolve, reject) => {
                        if(value){
                            detail.hint = value;
                            storage.set(keys.detailKey(detail.address),detail)
                            resolve();
                            Toast.success(lang.e().toast.success.save,1)
                        }else{
                            reject();
                        }
                    }),
                },
            ], 'default', detail.hint, [lang.e().page.walletManage.changePasswordHint])
    }

    exportMnemonicPhrase = ()=>{
        let that = this;
        Modal.prompt(lang.e().page.walletManage.export, '',
            [
                {
                    text: lang.e().button.cancel,
                    onPress: value => new Promise((resolve) => {
                        resolve();
                    }),
                },
                {
                    text: lang.e().button.confirm,
                    onPress: password => new Promise((resolve, reject) => {

                        if(password){
                            Toast.loading(lang.e().toast.loading.exporting,60)
                            ac.exportMnemonic(that.props.match.params.address,password).then(data=>{
                                Toast.success(lang.e().toast.export,2)
                                resolve();
                                url.goPage(url.AccountCreate2,url.manage(that.props.match.params.address));
                            }).catch(e=>{
                                if (e.indexOf("wrong passphrase") > -1) {
                                    Toast.fail(lang.e().toast.error.passwordError, 2);
                                } else {
                                    Toast.fail(e, 3);
                                }
                                reject();
                            });
                        }else{
                            reject();
                        }
                    }),
                },
            ], 'secure-text', null, [lang.e().page.walletManage.password])
    }

    render() {
        return <div style={{height: document.documentElement.clientHeight-45}}>
            <div className="layout-top">
                <NavBar
                    mode="light"
                    leftContent={<Icon type="left"/>}
                    onLeftClick={()=>{
                        // window.location.replace("/#/walletManage/")
                        url.goBack();
                    }}
                >
                    {lang.e().page.my.walletManage}
                </NavBar>

            </div>
            <WhiteSpace size="lg"/>
            <div style={{marginTop:"45px"}}>
                <List>
                    <WingBlank size="lg">
                        <List.Item
                            arrow="horizontal"
                            thumb={<Icon className="icon-avatar" type={this.state.ac.Detail().avatar} size="lg"/>}
                            multipleLine
                            onClick={()=>{
                                // window.location.replace("/#/manage/name/"+ this.state.ac.Detail().address)
                                url.goPage(url.manageName(this.state.ac.Detail().address),url.manage(this.props.match.params.address));
                            }}
                        >
                            {this.state.ac.Detail().name} <List.Item.Brief>{ this.state.ac.Detail().mainPKr}</List.Item.Brief>
                        </List.Item>
                    </WingBlank>
                </List>
                <WhiteSpace size="lg"/>
                <List>
                    <WingBlank size="lg">
                        <List.Item arrow="horizontal" onClick={this.changePasswordHint} thumb={<Icon type="iconcustom-hint" color="gray"/>}><span >{lang.e().page.walletManage.changePasswordHint}</span></List.Item>
                        <List.Item arrow="horizontal" onClick={this.exportMnemonicPhrase} thumb={<Icon type="iconword" color="gray"/>}><span >{lang.e().page.walletManage.export}</span></List.Item>
                    </WingBlank>
                </List>
            </div>
        </div>
    }
}

export default Manage