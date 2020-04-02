declare var require: any
var React = require('react');
var connect = require('react-redux').connect;
var FundicionLinks = require('./FundicionLinks').default;
var UserLinks = require('../UserLinks').default;

class FundicionNavbar extends React.Component {
	render()
	{
       return (
            <div className="header">
				<FundicionLinks />
                <UserLinks />
            </div>
        );
    }
}

export default connect(null,null)(FundicionNavbar);