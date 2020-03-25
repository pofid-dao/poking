import React, {Component} from 'react'
import {Grid, SearchBar,Toast,Modal,List,Button} from 'antd-mobile'
import Layout from "../layout/layout";
import {storage, keys, url, lang,config} from "../../config/common";
import './dapp.css'
import {versionControlDataEn,versionControlDataCn,popupDataEn,popupDataCn} from './dapp-data'

let dataRecent =[];

class DApp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data:versionControlDataEn,
            popupData:popupDataEn,
            modal2:false,
            dapp:'',
            dappUrl:''
        }
    }

    componentDidMount() {

        if(config.isZH()){
            this.setState({
                data:versionControlDataCn,
                popupData:popupDataCn
            })
        }else{
            this.setState({
                data:versionControlDataEn,
                popupData:popupDataEn
            })
        }
    }

    showModal = (e) => {
        this.setState({
            "modal2": true,
            "dapp":e.text,
            "dappUrl":e.url
        });
    }

    onClose = () => {
        this.setState({
            "modal2": false,
        });
    }



    render() {

        const {data,popupData} = this.state;
        let dapps = storage.get(keys.dapp.list);
        if(dapps) {
            dataRecent=[];
            let tripMap = new Map();
            for(let contractAddress of dapps){
                if(!tripMap.get(contractAddress) === true){
                    tripMap.set(contractAddress,true);
                    let dapp = storage.get(keys.dappsInfoKey(contractAddress));
                    dataRecent.push({
                        icon: <div className="dapp-icon"><img src={dapp.logo} className="dapp-img"/>
                        </div>,
                        text: dapp.name,
                        url: dapp.url,
                    })
                }
            }
        }

        return <Layout selectedTab="dapp">
            <div className="layout-top" style={{color:"#f7f7f7"}}>
                <SearchBar placeholder={lang.e().page.dapp.search} maxLength={200} onSubmit={(val) => {
                    // window.location.replace("/#/browser/"+encodeURIComponent(val));
                    if(val){
                        if(val.indexOf("http")>-1){
                            url.goPage(url.browser(val), url.DApp);
                        }else{
                            Toast.fail(lang.e().page.dapp.invalidDApp,3)
                        }
                    }

                }}/>
            </div>

            <div style={{padding:'45px 0 60px',overflow:'scroll',background:"#fdfdfd"}} >
                <div className="sub-title">{lang.e().page.dapp.popup} </div>
                <div style={{textAlign: 'center'}}>
                    <Grid data={popupData} activeStyle={false}  onClick={
                        (e,index)=>{
                            url.goPage(url.browser(e.url),url.DApp);
                        }
                    } hasLine={false}/>
                </div>

                <div className="sub-title">{lang.e().page.dapp.recommended} </div>
                <div style={{textAlign: 'center'}}>
                    <Grid data={data} activeStyle={false}  onClick={
                        (e,index)=>{
                            this.showModal(e)
                        }
                    } hasLine={false}/>
                </div>

                <div>
                    {
                        dataRecent.length>0?<div>
                            <div className="sub-title">{lang.e().page.dapp.recent} </div>
                            <div style={{textAlign: 'center'}}>
                                <Grid data={dataRecent} activeStyle={false} onClick={
                                    (e,index)=>{
                                        this.showModal(e)
                                    }
                                } hasLine={false}/>

                            </div>
                        </div>:""
                    }
                </div>
            </div>

            <Modal
                popup
                visible={this.state.modal2}
                onClose={()=>this.onClose()}
                animationType="slide-up"
            >
                <List renderHeader={() => <div><h3>{lang.e().modal.dappTip1}</h3></div>} >
                    <List.Item key={1}>
                        <p className="popup-list">{lang.e().modal.dappTip2}{this.state.dapp}{lang.e().modal.dappTip3}</p>
                    </List.Item>
                    <List.Item>
                        <Button type="primary" onClick={()=>{
                            this.onClose();
                            url.goPage(url.browser(this.state.dappUrl),url.DApp);
                        }}>{lang.e().button.ok}</Button>
                    </List.Item>
                </List>
            </Modal>

        </Layout>
    }
}

export default DApp