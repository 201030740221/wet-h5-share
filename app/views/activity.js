import {Router, Route, IndexRoute, useRouterHistory} from 'react-router';
import PagePushContent from '../components/page-push-content';

var ActivityPage = React.createClass({
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},
    GetRequest() { 
        var url = location.search; //获取url中"?"符后的字串 
        var theRequest = new Object(); 
        if (url.indexOf("?") != -1) { 
            var str = url.substr(1); 
            let strs = str.split("&"); 
            for(var i = 0; i < strs.length; i ++) { 
            theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]); 
            } 
        } 
        return theRequest; 
    },
	/*请求数据*/
	getActivityData(_type,current_page){

		let self = this;
        let _id_data = this.GetRequest();
        let _id = _id_data['id'] || 1;

		$.ajax({
	        dataType: 'json',
            data: {
                    id:_id,
                    type:_type,
                    page: current_page,
                    count: 10
                },
	        url: 'http://hd.wecut.com/api/starlive/list.php',
	        success: function(res){

                    let _videoData = res.data.video;
                    let _arr = self.state.videoArr;
                    let _videoArr = _arr.concat(_videoData);
                    let page = self.state.page;
	        		self.setState({
	        			loading: false,
                        islast: res.data.islast,
	        			source: res.data,
                        videoArr: _videoArr,
                        page: page+1
	        		})
	                //处理data数据
        		}
		});
	},


    //微信配置接口
    getWechatConfig(){

        let self = this;
        $.ajax({
            dataType: 'json',
            data: {},
            url: 'http://hd.wecut.com/api/wx/token.php',
            success: function(res){
                self.wechatConfig(res.data);
            }
        });
    },

    //微信分享配置
    wechatConfig(configData){
          //获取微信wx.config的配置信息接口
          console.log(configData,'weChatJsConfig');
          var apiList = ['onMenuShareTimeline', 'onMenuShareAppMessage'];
           wx.config({
                debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId:  configData.appId, // 必填，公众号的唯一标识
                timestamp: configData.timestamp, // 必填，生成签名的时间戳
                nonceStr: configData.nonceStr, // 必填，生成签名的随机串
                signature: configData.signature,// 必填，签名，见附录1
                jsApiList: apiList // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
          wx.ready(function(){
            wx.checkJsApi({
                jsApiList: apiList, // 需要检测的JS接口列表，所有JS接口列表见附录2,
                success: function(res) {
                    // 以键值对的形式返回，可用的api值true，不可用为false
                    // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
                    console.log(res);
                }
            });

            let title='分享赢iphone',
                link = 'www.wecut.com',
                image = '';

            wx.onMenuShareTimeline({
                title: title, // 分享标题
                link: link, // 分享链接
                imgUrl: image, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });

            wx.onMenuShareAppMessage({
                title: title, // 分享标题
                desc: 'wecut', // 分享描述
                link: link, // 分享链接
                imgUrl: image, // 分享图标
                type: 'link', // 分享类型,music、video或link，不填默认为link
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
        });
    },

    getInitialState: function () {

        this.getWechatConfig();//微信配置接口

        return {
        	source: {},
            videoArr: [],
            type: 2,
            page: 1,
            islast: 0,
        	loading: true,
            videoPreImg: null,
            videoUrl: null,
            botton_icon: false
        };
    },
    componentDidMount: function () {
       this.getActivityData(this.state.type,this.state.page);
       if(platform() == 'iOS'){
            this.setState({
                botton_icon: false
            })
        }else if (platform() == 'Android') {
            this.setState({
                botton_icon: true
            })
        }
    },
    navHandle(type){
        if(type=='new'){
            this.setState({
                type: 1
            })
            this.getActivityData(1,1);
        }
        if(type=='host'){
            this.setState({
                type: 2
            })
            this.getActivityData(2,1);
        }
    },

    videoList(videoData){
        let self = this;
        let _node = videoData.map(function(item,key){
            return (
                    <div className="video_section" key={key}>
                        <video width="100%"  controls="controls" poster={item.image}>
                          <source src={item.mediaurl} type="video/mp4" />
                        </video>
                        <div className={self.state.botton_icon?"video_btn":"video_btn"}></div>
                    </div>
                )
        })
        return _node;
    },
    componentDidUpdate(){
       /* $('.video_btn').click(function(){

            var _this = this;
            var _video = $(this).siblings('video');
            _video[0].play();
            $(this).hide();

            _video[0].addEventListener("click",function(){  
                
                console.log(99);  
            });  
            _video[0].addEventListener("ended",function(){  
                $(_this).show();
            });  
        })*/
    },
    canRefresh(){
       /* pageager = this.state.pager
        isLastPage = pager.current_page == pager.last_page
        canRefresh = this.state.goodsList.length && !isLastPage
*/
        return true;
    },
       
    pushLoad(){
        let _type = this.state.type;
        let _page = this.state.page;
        this.getActivityData(_type,_page);/*滚动刷新数据*/
    },
        
    render: function () {

    	let self = this;
    	if(this.state.loading){
    		return (
    				<p>正在加载中，请稍等片刻哦...</p>
    			)
    	}
    	let source = this.state.source || {};
        source.star = source.star || {};
        let video = this.state.videoArr || [];
    	console.log(video);
       
        let type = this.state.type;
        return (
            <div className="whole activity_page">
		        <div className="p_r">
		            <img className="activity_banner" src="images/logo.png" alt=""/>
                    <div className="time_data">
                        <p className="w-font-weight w-f-16">{source.star.name}</p>
                        <p>已和 {source.star.copynum} 个人直播</p>
                    </div>
		        </div>
		        <div className="activity_content first_content">
		            <p className="activity_dec">
		                - 点击底部下载 WECUT    
		            </p>
		            <p className="activity_dec">
		                - 打开WECUT，点击“欧巴来看我直播”封面
		            </p>
		            <p className="activity_dec">
		                即可拍出你和   {source.star.name}  的直播小视频啦!
		            </p>
		        </div>
		        <div className="">
                    <div className="nav_section">
                        <div className="fl nav_li" onClick={this.navHandle.bind(null,'new')}>
                            <div className={type==1?"title active":"title"}>最新</div>
                        </div>
                        <div className="fr nav_li" onClick={this.navHandle.bind(null,'host')}>
                            <div className={type==2?"title active":"title"}>最热</div>
                        </div>
                    </div>
		        </div>
                <div className="activity_content">
                     <PagePushContent 
                        onPushRefresh={this.pushLoad} 
                        canRefresh={this.canRefresh}
                       
                        islast={this.state.islast}
                        >
                        <div id="video_list" className="img_section video_section">
                            {this.videoList(video)}
                        </div>
                    </PagePushContent>
                </div>
		    </div>
        );
    }
});

module.exports = ActivityPage;