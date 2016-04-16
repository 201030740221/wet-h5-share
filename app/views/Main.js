'use strict';
import "../css/style";

var Main = React.createClass({
    render: function () {
        return (
            <div className='whole_page'>
                {this.props.children}
            </div>
        );
    }
});

module.exports = Main;