import {Router, Route, IndexRoute, useRouterHistory} from 'react-router';
var moment = require('moment');
import CountDown from '../components/count-down.js'


var CountDownContent = React.createClass({
    render: function(){
        var timeTitle = '离截至时间：';
        if(this.props.isworking){
            timeTitle = '距离结束时间：';
        }
        if(this.props.days === 0 && this.props.hours === 0 && this.props.minutes === 0 && this.props.seconds === 0){
            return (
                <div className="flashsale-countdown time_data"><span className="time_title">{timeTitle}</span><em>加载中...</em> </div>
            );
        } else{
            return (
                <div className="flashsale-countdown time_data"><span className="time_title">{timeTitle}</span><em>{this.props.days + "天 " + this.props.hours + ":" + this.props.minutes + ":" + this.props.seconds}</em> </div>
            );
        }

    }
});


var ActivityPage = React.createClass({
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},
	/*请求数据*/
	getActivityData(){

		let self = this;

		$.ajax({
	        dataType: 'json',
	        url: 'http://hd.wecut.com/api/starlive/rank.php',
	        success: function(data){

	        		self.setState({
	        			loading: false,
	        			end_time: data.data.seconds,
	        			source: data
	        		})
	                //处理data数据
        		}
		});
	},
    getInitialState: function () {
    	let _startTime = moment().format('YYYY-MM-DD HH:mm:ss');
        return {
        	source: {},
        	start_time: _startTime,
        	end_time: '',
        	loading: true
        };
    },
    componentDidMount: function () {
       this.getActivityData();
    },
    viewHandle(tid){
    	doGoTule(tid);
    },

    componentDidUpdate(){

    },

     setBeginTime: function(){
       return '2016-04-15 00:00:12';
    },
     // 准备期间 <div className="flashsale-countdown">剩余时间：<em>{this.state.flashsale.countdownText}</em> </div>
    renderReady: function(){
        return (
            <div>
                <CountDown 
                	callback={this.setBeginTime} 
                	data={{ startTime: this.state.start_time, endTime: this.state.end_time }}
            	 	component={CountDownContent} 
            	 />
            </div>
        );
    },

    render: function () {

    	let self = this;
    	if(this.state.loading){
    		return (
    				<p>正在加载中，请稍等片刻哦...</p>
    			)
    	}
    	let source = this.state.source;
    	let star = source.data.star || [];
    	console.log(source);
        return (
            <div className="whole activity_page">
		        <div className="p_r">
		            <img className="activity_banner" src="images/logo.png" alt=""/>

	            	{this.renderReady()}

		        </div>
		        <div className="activity_content first_content">
		            <p className="activity_dec">
		                如果你开直播，最想哪位欧巴来围观送花
		            </p>
		            <p className="activity_dec">
		                - 选中心仪的欧巴，点击【黄色开拍按钮】
		            </p>
		            <p className="activity_dec">
		                - 再点击左下角的【翻拍】
		            </p>
		            <p className="activity_dec">
		                - 官方会挑选参与的优质用户，送出3台美图V4s手机！
		            </p>
		        </div>
		        <div className="activity_content">
		        {
		        	star.map(function(item,key){
	        			return (
	        				<div className='list' key={key}>
				            	<div className="list_left">
				            		<img className="list_img" src={item.image} alt="" />
				            		<div className="list_dec">
				            			<p className="large_title">{item.name}</p>
				            			<p>围观：{item.copynum}</p>
				            		</div>
				            		<div className="view_icon" onClick={self.viewHandle.bind(null,item.tid)}></div>
				            	</div>
				            	<div className="list_right fr hidden">
				            		<div className="share_icon "></div>
				            	</div>
				            </div>
	        			)
		        	})
		        }
		        </div>
		    </div>
        );
    }
});

module.exports = ActivityPage;