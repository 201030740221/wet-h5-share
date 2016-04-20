import Events from "./utils/events";

var View = React.createClass({
  propTypes: {
    'onPushRefresh': React.PropTypes.func,
    'canRefresh': React.PropTypes.func
  },
  getDefaultProps: function() {},
  getInitialState: function() {
    return {
      'loaded': false
    };
  },
  componentWillReceiveProps: function(props) {
    this.offEvt();
    this.init();
    if (props.onPushRefresh && props.canRefresh) {
        this.onEvt();
    }
  },
  componentDidMount: function() {
    this.init();
    if (this.props.onPushRefresh && this.props.canRefresh) {
       this.onEvt();
    }
  },
  componentWillUnmount: function() {
    this.offEvt();
  },
  loaded: function(isLoaded) {
    this.setState({
      'loaded': isLoaded
    });
  },
  init: function() {
    this.page = React.findDOMNode(this);
    this.maxH = 100;
  },
  offEvt: function() {
    Events.off(this.page, 'scroll', this.scroll);
    Events.off(this.page, 'touchstart', this.touchstart);
    Events.off(this.page, 'touchmove', this.touchmove);
    Events.off(this.page, 'touchend', this.touchend);
  },
  onEvt: function() {
    this.offEvt();
    if (this.props.onscroll) {
      Events.on(this.page, 'scroll', this.scroll);
    }
    Events.on(this.page, 'touchstart', this.touchstart);
    Events.on(this.page, 'touchmove', this.touchmove);
    Events.on(this.page, 'touchend', this.touchend);
  },
  touchstart: function(e) {
    if (!this.props.canRefresh()) {
      return this.loaded(true);
    }
    this.loaded(false);
    this.currPosY = e.touches[0].screenY;
    this.originPageH = this.page.offsetHeight;
  },
  touchmove: function(e) {
    var pushup;
    pushup = React.findDOMNode(this.refs.pushup);
    this.movePosY = e.touches[0].screenY;
    this.isUping = this.currPosY > this.movePosY;
    this.isDowning = this.currPosY < this.movePosY;
    this.currPosY = this.movePosY;
    this.pageMovePos = this.page.scrollTop + this.originPageH;
    if (this.isUping && this.pageMovePos >= this.page.scrollHeight) {
      this.upingStart = this.upingStart || this.movePosY;
      this.downingStart = null;
      this._height = Math.min(this.maxH, Math.abs(this.movePosY - this.upingStart));
      pushup.style.height = this._height + 'px';
      if (this._height === this.maxH) {
        e.preventDefault();
      }
    }
    if (this.isDowning && this.pageMovePos <= this.page.scrollHeight) {
      this.upingStart = null;
      this.downingStart = this.downingStart || this.movePosY;
      pushup.style.height = Math.max(0, pushup.offsetHeight - (this.movePosY - this.downingStart)) + 'px';
    }
  },
  touchend: function(e) {
    var pushup;
    if (!this.props.canRefresh()) {
      return this.loaded(true);
    }
    this.loaded(false);
    pushup = React.findDOMNode(this.refs.pushup);
    this.upingStart = null;
    if (pushup.offsetHeight) {
       pushup.offsetHeight > this.maxH / 1.5 && this.props.onPushRefresh.call(this.page, function() {
         pushup.style.height = '0';
      });
    }

  },
  scroll: function(e) {
    this.props.onscroll.call(this.page, e);
  },
  render: function() {
    var classMap, classRefresh, classes, isPushRefresh, pushLoding;
    var isPushRefresh = !!this.props.onPushRefresh;
    console.log(isPushRefresh);
    classMap = {
      'page-content': true,
      'push-refresh': isPushRefresh
    };
    /*classes = SP.classSet(classMap, this.props.className);
    pushLoding = '';
    classRefresh = SP.classSet({
      'push-refresh-tip': true,
      'loaded': this.state.loaded
    });*/

    if(isPushRefresh) {
        if(this.props.islast){
            pushLoding = <div className={classRefresh?"":""} ref="pushup">没有更多信息啦</div>
        }else{
            pushLoding = <div className={classRefresh?"":""} ref="pushup">上拉刷新...</div>
        } 
    }
            
    return (
            <div {...this.props} className={classes?"":""}>
                {this.props.children}
                {pushLoding}
            </div>
        )
       
    }
});

module.exports = View;
