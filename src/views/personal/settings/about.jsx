import React, {Component} from 'react'
import {Icon, List, NavBar,Toast,Button} from "antd-mobile";
import {lang, url} from "../../../config/common";
import sero from "../../../logo.png";
import './about.css'
import axios from 'axios'

const urls = [
    {
        name: "Website",
        value: "https://sero.cash",
        url: "https://sero.cash"
    }, {
        name: "GitHub",
        value: "https://github.com/sero-cash/",
        url: "https://github.com/sero-cash/"
    }, {
        name: "Twitter",
        value: "@SEROdotCASH",
        url: ""
    }, {
        name: "Wechat",
        value: "@SERO9413",
        url: ""
    }]

class AboutUs extends Component {

    constructor(props) {
        super(props);

        this.state = {}
    }

    componentDidMount() {

    }

    checkUpdate() {
        const ua = navigator.userAgent;
        if (ua.indexOf('Html5Plus') > -1 && ua.indexOf('StreamApp') === -1) {
            let url = "http://popup-github.sero.cash/client.json";
            const localUtc = new Date().getTimezoneOffset() / 60;
            if (localUtc === -8) {
                url = "http://sero-cash.gitee.io/popup/client.json";
            }

            console.log("plus.runtime.",plus.runtime.version);

            axios.get(url).then(response=>{
                const rsp = response.data[lang.e().key];
                const version = rsp["version"];
                if (version !== plus.runtime.version) {
                    plus.nativeUI.confirm(rsp["note"], function (event) {
                        if (0 === event.index) {
                            plus.runtime.openURL(rsp["url"]);
                        }
                    }, rsp["title"], [lang.e().button.update, lang.e().button.cancel]);
                }
            }).catch(err=>{
                console.log(JSON.stringify(err));
            })
        }
    }

    render() {

        let abouts = [];
        let i = 0;
        urls.forEach(function (o) {
            abouts.push(
                <List.Item key={i++} arrow="horizontal" extra={<span style={{color: "#0066cc", flexBasis: "60%"}} onClick={() => {
                    if (o.url) {
                        url.goPage(url.browser(o.url))
                    }
                }}>{o.value}</span>}>{o.name}</List.Item>
            )
        })

        return (
            <div>
                <NavBar
                    mode="light"
                    leftContent={<Icon type="left" onClick={() => {
                        url.goBack()
                    }}/>}
                >
                    {lang.e().page.my.about}
                </NavBar>
                <div>
                    <div className="my-header"
                         style={{"height": document.documentElement.clientHeight * 0.15, padding: "30px 0px"}}>
                        <img src={sero} style={{width: "60px"}}/>
                    </div>
                    <List>
                        {abouts}
                        <List.Item key={i++} arrow="horizontal" extra={<span onClick={
                            () => this.checkUpdate()
                        }>1.1.0</span>}>Version</List.Item>
                    </List>
                </div>
            </div>
        )
    }
}

export default AboutUs