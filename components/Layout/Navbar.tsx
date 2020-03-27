declare var require: any

var React = require('react');
var connect = require('react-redux').connect;
var EcommerceLinks = require('./EcommerceLinks').default;
var UserLinks = require('./UserLinks').default;


class Navbar extends React.Component {
    render() {
        
        return (
            <div className="header">
                <EcommerceLinks />
                <UserLinks />
            </div>
        );
    }
}

export default connect(
    null,
    null
)(Navbar);