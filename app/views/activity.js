import {Router, Route, IndexRoute, useRouterHistory} from 'react-router';
import Video from 'react-html5video';

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
	getActivityData(_type){

		let self = this;
        let _id_data = this.GetRequest();
        let _id = _id_data['id'];

		$.ajax({
	        dataType: 'json',
            data: {id:1,type:_type},
	        url: 'http://hd.wecut.com/api/starlive/list.php',
	        success: function(res){

	        		self.setState({
	        			loading: false,
	        			source: res.data
	        		})
	                //处理data数据
        		}
		});
	},
    getInitialState: function () {
        return {
        	source: {},
            type: 2,
        	loading: true,
            videoPreImg: null,
            videoUrl: null,
            botton_icon: false
        };
    },
    componentDidMount: function () {
       this.getActivityData(2);
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
            this.getActivityData(1);
        }
        if(type=='host'){
            this.setState({
                type: 2
            })
            this.getActivityData(2);
        }
    },
    query(selector){
        return document.querySelector(selector);
    },
    videoShow(videoSrc,videoPreImg){

        let _video = this.query('.video__el');
        if(_video){
           _video.pause(); 
        } 

        let self = this;
        $('#mask_box').show();
    
        let _width = document.body.clientWidth ;
        let _height = document.body.clientHeight; 
        let _video_node = '<video id="video_show" class="video_content" controls="controls" autoplay="autoplay" width='+_width+'  height='+_height+' webkit-playsinline poster='+videoPreImg+'><source src='+videoSrc+' type="video/mp4" /></video>';
        $('#mask_video').append(_video_node);

        let media = this.query('#video_show');
        media.play();
        media.addEventListener('ended',function(){
            console.log(88);
            self.maskHandle();
        });
    },

    maskHandle(){
        $('#mask_box').hide();
        $('#mask_video').empty();
    },
    componentDidUpdate(){
        let _video = this.query('.video__el');
        _video.play();
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
        let video = source.video || [];
    	console.log(source);
        console.log(this.state.videoUrl);

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
                    <div className="img_section">
                    {
                        video.map(function(item,key){
                            let _node = '';
                            if(key==0&&type==2){
                                _node = (
                                    <div className="video_section" onClick={self.videoShow.bind(null,item.mediaurl,item.image)}>
                                        <Video 
                                            className="video_content" 
                                            style={{width:'100%'}}
                                            autoPlay  
                                            poster={item.image}
                                            >
                                            <source src={item.mediaurl} type="video/mp4" />
                                        </Video>
                                        <div className={self.state.botton_icon?"play_btn":""}></div>
                                    </div>
                                )
                            }else{
                                if(item.image){
                                     _node = (
                                        <img className="img_list" src={item.image} alt="" key={key} onClick={self.videoShow.bind(null,item.mediaurl,item.image)} />
                                    )
                                }else{
                                    _node = null;
                                }
                               
                            }
                            return _node
                        })
                    }
                    </div>
                </div>
                <div id="mask_box" className="mask" onClick={self.maskHandle}>
                    <div id="mask_video" className="mask_video">
                       
                    </div>
                </div>
		    </div>
        );
    }
});

module.exports = ActivityPage;