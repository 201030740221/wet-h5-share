import {Router, Route, IndexRoute, useRouterHistory} from 'react-router';
import Video from 'react-html5video';

var ActivityPage = React.createClass({
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},
	/*请求数据*/
	getActivityData(_type){

		let self = this;

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
            mask: false,
            videoPreImg: null,
            videoUrl: null,
        };
    },
    componentDidMount: function () {
       this.getActivityData(2);
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
    videoShow(videoSrc,videoPreImg){
        this.setState({
            mask: true
        })
        let _video_node = '<video id="example_video_1" class="video-js vjs-default-skin" controls preload="none" poster='+videoPreImg+' data-setup="{}"><source src='+videoSrc+' type="video/mp4" /></video>';
        $('#mask_video').append(_video_node);
    },

    componentDidUpdate(){

    },
    maskHandle(){
        this.setState({
            mask: false
        })
        $('#mask_video').empty();
    },

    render: function () {

    	let self = this;
    	if(this.state.loading){
    		return (
    				<p>正在加载中，请稍等片刻哦...</p>
    			)
    	}
    	let source = this.state.source;
        source.start = source.start || {};
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
		                即可拍出你和Bigbang的直播小视频啦!
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
                                    </div>
                                )
                            }else{
                                _node = (
                                    <img className="img_list" src={item.image} alt="" key={key} onClick={self.videoShow.bind(null,item.mediaurl,item.image)} />
                                )
                            }
                            return _node
                        })
                    }
                    </div>
                </div>
                <div className={this.state.mask?"mask shown":"mask hidden"} onClick={self.maskHandle}>
                    <div id="mask_video" className="mask_video">
                       
                    </div>
                </div>
		    </div>
        );
    }
});

module.exports = ActivityPage;